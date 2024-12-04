// src/routes/orderRoutes.ts
import { Router } from 'express';
import { orderController } from '../controllers/orderControllers';

const router = Router();

// Basic CRUD operations with both transaction and optimistic approaches
router.post('/', orderController.createOrder); // Transaction-based
router.post('/optimistic', orderController.createOrderOptimistic); // Optimistic locking
router.get('/:id', orderController.getOrder);
router.put('/:id', orderController.updateOrder);

// Additional query endpoints
router.get('/recent/last7days', orderController.getRecentOrders);
router.get('/user/:userId', orderController.getUserOrders);
router.get('/product/:productId/buyers', orderController.getProductBuyers);

export default router;
