import { Router, Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import User from '../models/User';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const router = Router();

router.post('/upload', authenticate, upload.single('file'), (req: any, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
});

router.post('/:id/submit-verification', authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.userId !== req.params.id && req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { phoneNumber, aadhaarImage, userPhoto, profilePicturePreference } = req.body;

        await user.update({
            phoneNumber,
            isPhoneVerified: true,
            otpVerified: true,
            aadhaarImage,
            userPhoto,
            profilePicturePreference: profilePicturePreference || 'default',
            verificationStatus: 'Verified',
            isIdentityVerified: true,
        });

        res.status(200).json({ message: 'Verification details submitted successfully', user });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to submit verification' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch user' });
    }
});

router.put('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.userId !== req.params.id && req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update(req.body);
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to update profile' });
    }
});

export default router;
