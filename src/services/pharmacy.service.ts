import { Pharmacy } from '../models/pharmacy.model';
import { User } from '../models/user.model';
import { AppError } from '../middleware/error';
import mongoose from 'mongoose';
import {
    UpdatePharmacyDto,
    PharmacyResponse,
    PharmacyListResponse,
    PharmacyData,
} from '../interfaces/pharmacy.interface';

export class PharmacyService {
    public static async getAllVerifiedPharmacies(): Promise<PharmacyListResponse> {
        const pharmacies = await Pharmacy.find({ isVerified: true })
            .populate('user', 'name email')
            .select('-__v');

        return {
            success: true,
            count: pharmacies.length,
            data: pharmacies.map(this.transformPharmacyData),
        };
    }

    public static async getPharmacyById(id: string): Promise<PharmacyResponse> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid pharmacy ID', 400);
        }

        const pharmacy = await Pharmacy.findById(id)
            .populate('user', 'name email')
            .select('-__v');

        if (!pharmacy) {
            throw new AppError('Pharmacy not found', 404);
        }

        return {
            success: true,
            data: this.transformPharmacyData(pharmacy),
        };
    }

    public static async getPendingPharmacies(): Promise<PharmacyListResponse> {
        const pharmacies = await Pharmacy.find({ isVerified: false })
            .populate('user', 'name email')
            .select('-__v');

        return {
            success: true,
            count: pharmacies.length,
            data: pharmacies.map(this.transformPharmacyData),
        };
    }

    public static async approvePharmacy(id: string): Promise<PharmacyResponse> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid pharmacy ID', 400);
        }

        const pharmacy = await Pharmacy.findById(id);
        if (!pharmacy) {
            throw new AppError('Pharmacy not found', 404);
        }

        pharmacy.isVerified = true;
        await pharmacy.save();

        const user = await User.findById(pharmacy.user);
        if (user) {
            user.isApproved = true;
            await user.save();
        }

        return {
            success: true,
            data: this.transformPharmacyData(pharmacy),
        };
    }

    public static async updatePharmacy(
        id: string,
        userId: mongoose.Types.ObjectId,
        updateData: UpdatePharmacyDto
    ): Promise<PharmacyResponse> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid pharmacy ID', 400);
        }

        // Validate phone number if provided
        if (updateData.phone && !this.isValidPhone(updateData.phone)) {
            throw new AppError('Invalid phone number format', 400);
        }

        // Validate opening hours if provided
        if (updateData.openingHours) {
            if (
                !this.isValidTimeFormat(updateData.openingHours.open) ||
                !this.isValidTimeFormat(updateData.openingHours.close)
            ) {
                throw new AppError('Invalid time format. Use HH:MM format', 400);
            }
        }

        let pharmacy = await Pharmacy.findById(id);
        if (!pharmacy) {
            throw new AppError('Pharmacy not found', 404);
        }

        // Check if the pharmacy belongs to the logged-in user
        if (pharmacy.user.toString() !== userId.toString()) {
            throw new AppError('Not authorized to update this pharmacy', 403);
        }

        pharmacy = await Pharmacy.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate('user', 'name email');

        return {
            success: true,
            data: this.transformPharmacyData(pharmacy),
        };
    }

    private static transformPharmacyData(pharmacy: any): PharmacyData {
        return {
            id: pharmacy._id,
            name: pharmacy.name,
            license: pharmacy.license,
            address: pharmacy.address,
            phone: pharmacy.phone,
            openingHours: pharmacy.openingHours,
            isVerified: pharmacy.isVerified,
            user: {
                name: pharmacy.user.name,
                email: pharmacy.user.email,
            },
        };
    }

    private static isValidPhone(phone: string): boolean {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    }

    private static isValidTimeFormat(time: string): boolean {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    }
} 