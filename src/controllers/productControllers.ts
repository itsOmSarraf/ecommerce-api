// src/controllers/productController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productController = {
	// Create product
	async createProduct(req: Request, res: Response) {
		try {
			const { name, category, price, stock } = req.body;

			// Basic validation
			if (!name || !category || price === undefined || stock === undefined) {
				return res.status(400).json({
					error: 'Missing required fields'
				});
			}

			if (price < 0 || stock < 0) {
				return res.status(400).json({
					error: 'Price and stock must be non-negative'
				});
			}

			const product = await prisma.product.create({
				data: {
					name,
					category,
					price: parseFloat(price),
					stock: parseInt(stock)
				}
			});

			res.status(201).json(product);
		} catch (error) {
			console.error('Create product error:', error);
			res.status(500).json({
				error: 'Failed to create product'
			});
		}
	},

	// Get product by ID
	async getProduct(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const product = await prisma.product.findUnique({
				where: { id }
			});

			if (!product) {
				return res.status(404).json({
					error: 'Product not found'
				});
			}

			res.json(product);
		} catch (error) {
			console.error('Get product error:', error);
			res.status(500).json({
				error: 'Failed to get product'
			});
		}
	},

	// Update product
	async updateProduct(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { name, category, price, stock } = req.body;

			// Check if product exists
			const existingProduct = await prisma.product.findUnique({
				where: { id }
			});

			if (!existingProduct) {
				return res.status(404).json({
					error: 'Product not found'
				});
			}

			// Validate price and stock if provided
			if (price !== undefined && price < 0) {
				return res.status(400).json({
					error: 'Price must be non-negative'
				});
			}

			if (stock !== undefined && stock < 0) {
				return res.status(400).json({
					error: 'Stock must be non-negative'
				});
			}

			const updatedProduct = await prisma.product.update({
				where: { id },
				data: {
					name,
					category,
					price: price !== undefined ? parseFloat(price) : undefined,
					stock: stock !== undefined ? parseInt(stock) : undefined
				}
			});

			res.json(updatedProduct);
		} catch (error) {
			console.error('Update product error:', error);
			res.status(500).json({
				error: 'Failed to update product'
			});
		}
	}
};
