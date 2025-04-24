import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/user.model';
import { AppError } from './error';

interface JwtPayload {
    id: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Not authorized to access this route', 401));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key'
        ) as JwtPayload;

        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        if (user.role === UserRole.PHARMACY && !user.isApproved) {
            return next(new AppError('Pharmacy not approved yet', 403));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new AppError('Not authorized to access this route', 401));
    }
};

export const authorize = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('User role not authorized to access this route', 403)
            );
        }
        next();
    };
}; 