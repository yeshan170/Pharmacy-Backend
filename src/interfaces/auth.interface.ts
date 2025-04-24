import { UserRole } from '../models/user.model';

export interface RegisterCustomerDto {
    email: string;
    password: string;
    name: string;
}

export interface RegisterPharmacyDto {
    email: string;
    password: string;
    name: string;
    pharmacyName: string;
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
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    };
    pharmacy?: any;
} 