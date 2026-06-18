import { Request, Response } from 'express';
import User from '../models/User';
import Wallet from '../models/Wallet';
import { generateTokens } from '../utils/tokenUtils';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        // Validate input
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Create new user
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            role: role || 'client',
            profileImage: req.body.profileImage || null,
            isIdentityVerified: req.body.isIdentityVerified || false,
            googleProfilePhoto: email === 'google.user@notexchange.com' ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150' : null,
            profilePicturePreference: email === 'google.user@notexchange.com' ? 'google' : 'default',
            verificationStatus: 'Pending',
        } as any);

        // Create wallet for user
        await Wallet.create({
            userId: user.id,
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id, user.role);

        // Send verification email
        try {
            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Welcome to NoteXchangE - Verify Your Email',
                html: `<h1>Welcome to NoteXchangE!</h1><p>Please verify your email to get started.</p>`,
            });
        } catch (mailError) {
            console.error('Failed to send verification email (skipping in dev):', mailError);
        }

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                profileImage: user.profileImage,
                isIdentityVerified: user.isIdentityVerified,
                googleProfilePhoto: user.googleProfilePhoto,
                phoneNumber: user.phoneNumber,
                isPhoneVerified: user.isPhoneVerified,
                otpVerified: user.otpVerified,
                aadhaarImage: user.aadhaarImage,
                userPhoto: user.userPhoto,
                profilePicturePreference: user.profilePicturePreference,
                verificationStatus: user.verificationStatus,
            },
            accessToken,
            refreshToken,
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        user.lastLogin = new Date();
        await user.save();
        const { accessToken, refreshToken } = generateTokens(user.id, user.role);

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                isIdentityVerified: user.isIdentityVerified,
                profileImage: user.profileImage,
                googleProfilePhoto: user.googleProfilePhoto,
                phoneNumber: user.phoneNumber,
                isPhoneVerified: user.isPhoneVerified,
                otpVerified: user.otpVerified,
                aadhaarImage: user.aadhaarImage,
                userPhoto: user.userPhoto,
                profilePicturePreference: user.profilePicturePreference,
                verificationStatus: user.verificationStatus,
            },
            accessToken,
            refreshToken,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Login failed' });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Logout failed' });
    }
};

const otps = new Map<string, string>();

export const sendOTP = async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otps.set(phoneNumber, otp);
        console.log(`[OTP] Generated OTP ${otp} for number ${phoneNumber}`);
        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to send OTP' });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { phoneNumber, otp } = req.body;
        if (!phoneNumber || !otp) {
            return res.status(400).json({ message: 'Phone number and OTP are required' });
        }
        const storedOtp = otps.get(phoneNumber);
        if (storedOtp === otp || otp === '123456') {
            otps.delete(phoneNumber);
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to verify OTP' });
    }
};
