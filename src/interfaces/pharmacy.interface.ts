import { Document } from 'mongoose';

export interface UpdatePharmacyDto {
    name?: string;
    address?: {
        street: string;
        city: string;
        district: string;
        postalCode: string;
    };
    phone?: string;
    openingHours?: {
        open: string;
        close: string;
    };
}

export interface PharmacyResponse {
    success: boolean;
    data: PharmacyData;
}

export interface PharmacyListResponse {
    success: boolean;
    count: number;
    data: PharmacyData[];
}

export interface PharmacyData {
    id: string;
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
    user: {
        name: string;
        email: string;
    };
} 