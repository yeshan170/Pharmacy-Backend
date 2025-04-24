import { OrderStatus } from '../models/order.model';

export interface CreateOrderDto {
    pharmacy: string;
    items: OrderItemDto[];
    deliveryAddress: {
        street: string;
        city: string;
        district: string;
        postalCode: string;
    };
    totalAmount: number;
    notes?: string;
}

export interface OrderItemDto {
    name: string;
    quantity: number;
    prescriptionRequired: boolean;
    prescriptionImage?: string;
}

export interface UpdateOrderStatusDto {
    status: OrderStatus;
}

export interface OrderResponse {
    success: boolean;
    data: OrderData;
}

export interface OrderListResponse {
    success: boolean;
    count: number;
    data: OrderData[];
}

export interface OrderData {
    id: string;
    customer: {
        name: string;
        email: string;
    };
    pharmacy: {
        name: string;
        address: {
            street: string;
            city: string;
            district: string;
            postalCode: string;
        };
        phone: string;
    };
    items: OrderItemDto[];
    status: OrderStatus;
    deliveryAddress: {
        street: string;
        city: string;
        district: string;
        postalCode: string;
    };
    totalAmount: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
} 