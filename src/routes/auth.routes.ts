import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Register customer
router.post(
    '/register/customer',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
        body('name').notEmpty().withMessage('Name is required'),
    ],
    AuthController.registerCustomer
);

// Register pharmacy
router.post(
    '/register/pharmacy',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
        body('name').notEmpty().withMessage('Name is required'),
        body('pharmacyName').notEmpty().withMessage('Pharmacy name is required'),
        body('license').notEmpty().withMessage('License number is required'),
        body('phone').notEmpty().withMessage('Phone number is required'),
    ],
    AuthController.registerPharmacy
);

// Login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    AuthController.login
);

// Get current user
router.get('/me', protect, AuthController.getCurrentUser);

export default router; 