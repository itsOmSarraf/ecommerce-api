// src/controllers/orderController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const orderController = {
	// Create order
	async createOrder(req: Request, res: Response) {
		try {
			const { userId, productId, quantity } = req.body;

			// Validate inputs
			if (!userId || !productId || !quantity) {
				return res.status(400).json({
					error: 'Missing required fields'
				});
			}

			// Check if product exists and has enough stock
			const product = await prisma.product.findUnique({
				where: { id: productId }
			});

			if (!product) {
				return res.status(404).json({
					error: 'Product not found'
				});
			}

			if (product.stock < quantity) {
				return res.status(400).json({
					error: 'Not enough stock available'
				});
			}

			// Create order and update stock in a transaction
			const order = await prisma.$transaction(async (prisma) => {
				// Create the order
				const newOrder = await prisma.order.create({
					data: {
						userId,
						productId,
						quantity
					}
				});

				// Update product stock
				await prisma.product.update({
					where: { id: productId },
					data: {
						stock: product.stock - quantity
					}
				});

				return newOrder;
			});

			res.status(201).json(order);
		} catch (error) {
			console.error('Create order error:', error);
			res.status(500).json({
				error: 'Failed to create order'
			});
		}
	},

	// Get order by ID
	async getOrder(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const order = await prisma.order.findUnique({
				where: { id },
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true
						}
					},
					product: {
						select: {
							id: true,
							name: true,
							price: true
						}
					}
				}
			});

			if (!order) {
				return res.status(404).json({
					error: 'Order not found'
				});
			}

			res.json(order);
		} catch (error) {
			console.error('Get order error:', error);
			res.status(500).json({
				error: 'Failed to get order'
			});
		}
	},

	// Update order
	async updateOrder(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { quantity } = req.body;

			// Find existing order
			const existingOrder = await prisma.order.findUnique({
				where: { id },
				include: {
					product: true
				}
			});

			if (!existingOrder) {
				return res.status(404).json({
					error: 'Order not found'
				});
			}

			// Calculate stock difference
			const stockDifference = existingOrder.quantity - quantity;
			const newStock = existingOrder.product.stock + stockDifference;

			if (newStock < 0) {
				return res.status(400).json({
					error: 'Not enough stock available'
				});
			}

			// Update order and stock in a transaction
			const updatedOrder = await prisma.$transaction(async (prisma) => {
				// Update the order
				const order = await prisma.order.update({
					where: { id },
					data: { quantity },
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true
							}
						},
						product: {
							select: {
								id: true,
								name: true,
								price: true
							}
						}
					}
				});

				// Update product stock
				await prisma.product.update({
					where: { id: existingOrder.productId },
					data: {
						stock: newStock
					}
				});

				return order;
			});

			res.json(updatedOrder);
		} catch (error) {
			console.error('Update order error:', error);
			res.status(500).json({
				error: 'Failed to update order'
			});
		}
	},

	// Get orders from last 7 days
	async getRecentOrders(req: Request, res: Response) {
		try {
			const sevenDaysAgo = new Date();
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

			const orders = await prisma.order.findMany({
				where: {
					createdAt: {
						gte: sevenDaysAgo
					}
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true
						}
					},
					product: {
						select: {
							id: true,
							name: true,
							price: true
						}
					}
				},
				orderBy: {
					createdAt: 'desc'
				}
			});

			res.json(orders);
		} catch (error) {
			console.error('Get recent orders error:', error);
			res.status(500).json({
				error: 'Failed to get recent orders'
			});
		}
	},

	// Get orders by user ID
	async getUserOrders(req: Request, res: Response) {
		try {
			const { userId } = req.params;

			const orders = await prisma.order.findMany({
				where: {
					userId
				},
				include: {
					product: {
						select: {
							id: true,
							name: true,
							price: true
						}
					}
				},
				orderBy: {
					createdAt: 'desc'
				}
			});

			res.json(orders);
		} catch (error) {
			console.error('Get user orders error:', error);
			res.status(500).json({
				error: 'Failed to get user orders'
			});
		}
	},

	// Get users who bought a specific product
	async getProductBuyers(req: Request, res: Response) {
		try {
			const { productId } = req.params;

			const buyers = await prisma.user.findMany({
				where: {
					orders: {
						some: {
							productId
						}
					}
				},
				select: {
					id: true,
					name: true,
					email: true,
					orders: {
						where: {
							productId
						},
						select: {
							id: true,
							quantity: true,
							createdAt: true
						}
					}
				}
			});

			res.json(buyers);
		} catch (error) {
			console.error('Get product buyers error:', error);
			res.status(500).json({
				error: 'Failed to get product buyers'
			});
		}
	}
};
