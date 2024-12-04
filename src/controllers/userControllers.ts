// src/controllers/userController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { CreateUserDto, UpdateUserDto } from '../types/user';

const prisma = new PrismaClient();

export const userController = {
	// Create user
	async createUser(req: Request<{}, {}, CreateUserDto>, res: Response) {
		try {
			const { name, email, phone } = req.body;

			// Check if user with email already exists
			const existingUser = await prisma.user.findUnique({
				where: { email }
			});

			if (existingUser) {
				return res.status(400).json({
					error: 'User with this email already exists'
				});
			}

			const user = await prisma.user.create({
				data: {
					name,
					email,
					phone
				}
			});

			res.status(201).json(user);
		} catch (error) {
			console.error('Create user error:', error);
			res.status(500).json({
				error: 'Failed to create user'
			});
		}
	},

	// Get user by ID
	async getUser(req: Request<{ id: string }>, res: Response) {
		try {
			const { id } = req.params;

			const user = await prisma.user.findUnique({
				where: { id }
			});

			if (!user) {
				return res.status(404).json({
					error: 'User not found'
				});
			}

			res.json(user);
		} catch (error) {
			console.error('Get user error:', error);
			res.status(500).json({
				error: 'Failed to get user'
			});
		}
	},

	// Update user
	async updateUser(
		req: Request<{ id: string }, {}, UpdateUserDto>,
		res: Response
	) {
		try {
			const { id } = req.params;
			const { name, email, phone } = req.body;

			// Check if user exists
			const existingUser = await prisma.user.findUnique({
				where: { id }
			});

			if (!existingUser) {
				return res.status(404).json({
					error: 'User not found'
				});
			}

			// If email is being updated, check if new email is already taken
			if (email && email !== existingUser.email) {
				const emailTaken = await prisma.user.findUnique({
					where: { email }
				});

				if (emailTaken) {
					return res.status(400).json({
						error: 'Email is already taken'
					});
				}
			}

			const updatedUser = await prisma.user.update({
				where: { id },
				data: {
					name,
					email,
					phone
				}
			});

			res.json(updatedUser);
		} catch (error) {
			console.error('Update user error:', error);
			res.status(500).json({
				error: 'Failed to update user'
			});
		}
	}
};
