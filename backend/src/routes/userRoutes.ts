import { Router, Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import User from '../models/User';

const router = Router();

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
