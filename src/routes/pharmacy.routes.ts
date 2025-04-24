import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/user.model';
import { PharmacyController } from '../controllers/pharmacy.controller';

const router = express.Router();

// Get all pharmacies (public)
router.get('/', PharmacyController.getAllPharmacies);

// Get single pharmacy (public)
router.get('/:id', PharmacyController.getPharmacy);

// Get pending pharmacy registrations (admin only)
router.get(
    '/admin/pending',
    protect,
    authorize(UserRole.ADMIN),
    PharmacyController.getPendingPharmacies
);

// Approve pharmacy registration (admin only)
router.put(
    '/admin/approve/:id',
    protect,
    authorize(UserRole.ADMIN),
    PharmacyController.approvePharmacy
);

// Update pharmacy details (pharmacy owner only)
router.put(
    '/:id',
    protect,
    authorize(UserRole.PHARMACY),
    PharmacyController.updatePharmacy
);

export default router; 