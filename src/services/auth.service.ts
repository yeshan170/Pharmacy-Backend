import { User, UserRole, IUser } from '../models/user.model';
import { Pharmacy } from '../models/pharmacy.model';
import { AppError } from '../middleware/error';
import jwt, { SignOptions, Secret, JwtPayload } from 'jsonwebtoken';
import {
    RegisterCustomerDto,
    RegisterPharmacyDto,
    LoginDto,
    AuthResponse,
} from '../interfaces/auth.interface';

export class AuthService {
    public static async registerCustomer(data: RegisterCustomerDto): Promise<AuthResponse> {
        // Validate email format
        if (!this.isValidEmail(data.email)) {
            throw new AppError('Invalid email format', 400);
        }

        // Validate password strength
        if (!this.isValidPassword(data.password)) {
            throw new AppError(
                'Password must be at least 6 characters long and contain at least one number',
                400
            );
        }

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new AppError('Email already exists', 400);
        }

        const user = (await User.create({
            email: data.email,
            password: data.password,
            name: data.name,
            role: UserRole.CUSTOMER,
        })).toObject();

        const createdUser = user as IUser;
        const token = this.generateToken(createdUser._id.toString());

        return {
            success: true,
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    public static async registerPharmacy(data: RegisterPharmacyDto): Promise<AuthResponse> {
        // Validate email format
        if (!this.isValidEmail(data.email)) {
            throw new AppError('Invalid email format', 400);
        }

        // Validate password strength
        if (!this.isValidPassword(data.password)) {
            throw new AppError(
                'Password must be at least 6 characters long and contain at least one number',
                400
            );
        }

        // Validate phone number
        if (!this.isValidPhone(data.phone)) {
            throw new AppError('Invalid phone number format', 400);
        }

        // Validate opening hours format
        if (!this.isValidTimeFormat(data.openingHours.open) || !this.isValidTimeFormat(data.openingHours.close)) {
            throw new AppError('Invalid time format. Use HH:MM format', 400);
        }

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new AppError('Email already exists', 400);
        }

        const existingPharmacy = await Pharmacy.findOne({ license: data.license });
        if (existingPharmacy) {
            throw new AppError('License number already exists', 400);
        }

        const user = await User.create({
            email: data.email,
            password: data.password,
            name: data.name,
            role: UserRole.PHARMACY,
            isApproved: false,
        }) as IUser;

        const pharmacy = await Pharmacy.create({
            user: user._id,
            name: data.pharmacyName,
            license: data.license,
            address: data.address,
            phone: data.phone,
            openingHours: data.openingHours,
        });

        const token = this.generateToken(user._id.toString());

        return {
            success: true,
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
            pharmacy,
        };
    }

    public static async login(data: LoginDto): Promise<AuthResponse> {
        if (!this.isValidEmail(data.email)) {
            throw new AppError('Invalid email format', 400);
        }

        const user = await User.findOne({ email: data.email }).select('+password') as IUser;
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isMatch = await user.comparePassword(data.password);
        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = this.generateToken(user._id.toString());

        return {
            success: true,
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    public static async getCurrentUser(userId: string) {
        const user = await User.findById(userId) as IUser | null;
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    private static generateToken(userId: string): string {
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const options = {
            expiresIn: 30 * 24 * 60 * 60  // 30 days in seconds
        };

        return jwt.sign({ id: userId }, secret, options);
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private static isValidPassword(password: string): boolean {
        return password.length >= 6 && /\d/.test(password);
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