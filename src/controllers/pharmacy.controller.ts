import { Request, Response, NextFunction } from 'express';
import { PharmacyService } from '../services/pharmacy.service';

export class PharmacyController {
    public static async getAllPharmacies(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const result = await PharmacyService.getAllVerifiedPharmacies();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public static async getPharmacy(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const pharmacy = await PharmacyService.getPharmacyById(req.params.id);

            res.status(200).json({
                success: true,
                data: pharmacy,
            });
        } catch (error) {
            next(error);
        }
    }

    public static async getPendingPharmacies(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await PharmacyService.getPendingPharmacies();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public static async approvePharmacy(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const pharmacy = await PharmacyService.approvePharmacy(req.params.id);

            res.status(200).json({
                success: true,
                data: pharmacy,
            });
        } catch (error) {
            next(error);
        }
    }

    public static async updatePharmacy(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const pharmacy = await PharmacyService.updatePharmacy(
                req.params.id,
                req.user._id,
                req.body
            );

            res.status(200).json({
                success: true,
                data: pharmacy,
            });
        } catch (error) {
            next(error);
        }
    }
} 