import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    getAllUsers,
    getAllTasksAdmin,
    blockUser,
    getDashboardStats,
} from '../controllers/adminController';

const router = Router();

router.get('/users', authenticate, getAllUsers);
router.get('/tasks', authenticate, getAllTasksAdmin);
router.put('/users/:userId/block', authenticate, blockUser);
router.get('/stats', authenticate, getDashboardStats);

export default router;
