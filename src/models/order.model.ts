import mongoose, { Document, Schema } from 'mongoose';

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

interface OrderItem {
    name: string;
    quantity: number;
    prescriptionRequired: boolean;
    prescriptionImage?: string;
}

export interface IOrder extends Document {
    customer: mongoose.Types.ObjectId;
    pharmacy: mongoose.Types.ObjectId;
    items: OrderItem[];
    status: OrderStatus;
    deliveryAddress: {
        street: string;
        city: string;
        district: string;
        postalCode: string;
    };
    totalAmount: number;
    notes?: string;
}

const orderSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        pharmacy: {
            type: Schema.Types.ObjectId,
            ref: 'Pharmacy',
            required: true,
        },
        items: [
            {
                name: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                prescriptionRequired: {
                    type: Boolean,
                    default: false,
                },
                prescriptionImage: {
                    type: String,
                },
            },
        ],
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
        deliveryAddress: {
            street: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            district: {
                type: String,
                required: true,
            },
            postalCode: {
                type: String,
                required: true,
            },
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema); 