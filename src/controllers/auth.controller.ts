import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    public static async registerCustomer(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { email, password, name } = req.body;
            const result = await AuthService.registerCustomer({ email, password, name });

            res.status(201).json({
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    public static async registerPharmacy(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const {
                email,
                password,
                name,
                pharmacyName,
                license,
                address,
                phone,
                openingHours,
            } = req.body;

            const result = await AuthService.registerPharmacy({
                email,
                password,
                name,
                pharmacyName,
                license,
                address,
                phone,
                openingHours
            });

            res.status(201).json({
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    public static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login({ email, password });

            res.status(200).json({
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    public static async getCurrentUser(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await AuthService.getCurrentUser(req.user._id);

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            next(error);
        }
    }
} 