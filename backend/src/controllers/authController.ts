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
        } as any);

        // Create wallet for user
        await Wallet.create({
            userId: user.id,
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id, user.role);

        // Send verification email
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Welcome to NoteXchangE - Verify Your Email',
            html: `<h1>Welcome to NoteXchangE!</h1><p>Please verify your email to get started.</p>`,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
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
