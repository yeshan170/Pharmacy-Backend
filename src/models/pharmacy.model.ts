import mongoose, { Document, Schema } from 'mongoose';

export interface IPharmacy extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    license: string;
    address: {
        street: string;
        city: string;
        district: string;
        postalCode: string;
    };
    phone: string;
    openingHours: {
        open: string;
        close: string;
    };
    isVerified: boolean;
}

const pharmacySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Pharmacy name is required'],
        },
        license: {
            type: String,
            required: [true, 'License number is required'],
            unique: true,
        },
        address: {
            street: {
                type: String,
                required: [true, 'Street address is required'],
            },
            city: {
                type: String,
                required: [true, 'City is required'],
            },
            district: {
                type: String,
                required: [true, 'District is required'],
            },
            postalCode: {
                type: String,
                required: [true, 'Postal code is required'],
            },
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
        },
        openingHours: {
            open: {
                type: String,
                required: [true, 'Opening time is required'],
            },
            close: {
                type: String,
                required: [true, 'Closing time is required'],
            },
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Pharmacy = mongoose.model<IPharmacy>('Pharmacy', pharmacySchema); 