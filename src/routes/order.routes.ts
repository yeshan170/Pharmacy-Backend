import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/user.model';
import { OrderController } from '../controllers/order.controller';

const router = express.Router();

// Create order (customer only)
router.post('/', protect, authorize(UserRole.CUSTOMER), OrderController.createOrder);

// Get all orders for a customer
router.get('/my-orders', protect, OrderController.getCustomerOrders);

// Get all orders for a pharmacy
router.get(
    '/pharmacy-orders',
    protect,
    authorize(UserRole.PHARMACY),
    OrderController.getPharmacyOrders
);

// Get single order
router.get('/:id', protect, OrderController.getOrder);

// Update order status (pharmacy only)
router.put(
    '/:id/status',
    protect,
    authorize(UserRole.PHARMACY),
    OrderController.updateOrderStatus
);

// Cancel order (customer only, if order is still pending)
router.put(
    '/:id/cancel',
    protect,
    authorize(UserRole.CUSTOMER),
    OrderController.cancelOrder
);

export default router; 