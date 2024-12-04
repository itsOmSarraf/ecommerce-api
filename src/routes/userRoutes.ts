// src/routes/userRoutes.ts
import { Router } from 'express';
import { userController } from '../controllers/userControllers';

const router = Router();

// Create user
router.post('/', userController.createUser);

// Get user by ID
router.get('/:id', userController.getUser);

// Update user
router.put('/:id', userController.updateUser);

export default router;
