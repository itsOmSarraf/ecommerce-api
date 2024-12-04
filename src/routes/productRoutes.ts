// src/routes/productRoutes.ts
import { Router } from 'express';
import { productController } from '../controllers/productControllers';

const router = Router();

// Create product
router.post('/', productController.createProduct);

// Get product by ID
router.get('/:id', productController.getProduct);

// Update product
router.put('/:id', productController.updateProduct);

export default router;
