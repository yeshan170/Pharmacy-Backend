import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
    public static async createOrder(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const order = await OrderService.createOrder(req.body, req.user._id);

            res.status(201).json({
                success: true,
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    public static async getCustomerOrders(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const result = await OrderService.getCustomerOrders(req.user._id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public static async getPharmacyOrders(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const result = await OrderService.getPharmacyOrders(req.user.pharmacy);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public static async getOrder(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const order = await OrderService.getOrderById(
                req.params.id,
                req.user._id,
                req.user.role,
                req.user.pharmacy
            );

            res.status(200).json({
                success: true,
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    public static async updateOrderStatus(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const order = await OrderService.updateOrderStatus(
                req.params.id,
                req.body.status,
                req.user.pharmacy
            );

            res.status(200).json({
                success: true,
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    public static async cancelOrder(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const order = await OrderService.cancelOrder(req.params.id, req.user._id);

            res.status(200).json({
                success: true,
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }
} 