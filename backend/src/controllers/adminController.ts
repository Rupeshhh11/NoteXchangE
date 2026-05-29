import { Request, Response } from 'express';
import { AuthenticatedRequest, authorize } from '../middleware/auth';
import User from '../models/User';
import Task from '../models/Task';

// Get all users (admin only)
export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch users' });
    }
};

// Get all tasks (admin only)
export const getAllTasksAdmin = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const tasks = await Task.findAll({
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch tasks' });
    }
};

// Block user (admin only)
export const blockUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = false;
        await user.save();

        res.status(200).json({
            message: 'User blocked successfully',
            user,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to block user' });
    }
};

// Get dashboard stats (admin only)
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const totalUsers = await User.count();
        const totalTasks = await Task.count();
        const completedTasks = await Task.count({ where: { status: 'completed' } });

        res.status(200).json({
            totalUsers,
            totalTasks,
            completedTasks,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch stats' });
    }
};
