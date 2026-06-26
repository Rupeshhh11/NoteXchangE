import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateTokens = (userId: string, userRole: string) => {
    const accessToken = jwt.sign(
        { id: userId, role: userRole },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: (process.env.JWT_EXPIRY || '7d') as any }
    );

    const refreshToken = jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
        { expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || '30d') as any }
    );

    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'refresh-secret') as any;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};
