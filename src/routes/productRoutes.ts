// In src/routes/productRoutes.ts

import { Router } from 'express';
import { productController } from '../controllers/productControllers';

const router = Router();

// Existing routes
router.post('/', productController.createProduct);
router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);

// Add new route for total stock
router.get('/stock/total', productController.getTotalStock);

export default router;
