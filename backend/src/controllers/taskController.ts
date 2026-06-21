import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Op } from 'sequelize';
import Task from '../models/Task';
import Bid from '../models/Bid';
import User from '../models/User';

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const { category, status, page = 1, limit = 10 } = req.query;

        const where: any = {};
        if (category) where.category = category;
        if (status) where.status = status;

        const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

        const { count, rows } = await Task.findAndCountAll({
            where,
            limit: parseInt(limit as string),
            offset,
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            tasks: rows,
            total: count,
            page: parseInt(page as string),
            totalPages: Math.ceil(count / parseInt(limit as string)),
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch tasks' });
    }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const task = await Task.create({
            clientId: req.userId,
            ...req.body,
        } as any);

        res.status(201).json({
            message: 'Task created successfully',
            task,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to create task' });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch task' });
    }
};

// Update task
export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.clientId !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await task.update(req.body);
        res.status(200).json({
            message: 'Task updated successfully',
            task,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to update task' });
    }
};

// Delete task
export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.clientId !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to delete task' });
    }
};

export const getMyTasks = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;

        // 1. Tasks posted by the user
        const postedTasks = await Task.findAll({
            where: { clientId: userId },
            include: [
                {
                    model: Bid,
                    as: 'bids',
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'firstName', 'lastName', 'email', 'rating'],
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        // 2. Active tasks: tasks in_progress where the user has the accepted bid
        const acceptedBids = await Bid.findAll({
            where: {
                serviceProviderId: userId,
                status: 'accepted'
            }
        });
        const acceptedTaskIds = acceptedBids.map(b => b.taskId);

        const activeTasks = await Task.findAll({
            where: {
                id: { [Op.in]: acceptedTaskIds },
                status: 'in_progress'
            },
            include: [
                {
                    model: User,
                    as: 'client',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ],
            order: [['updatedAt', 'DESC']]
        });

        // 3. Pending bids: bids made by the user that are still pending
        const pendingBids = await Bid.findAll({
            where: {
                serviceProviderId: userId,
                status: 'pending'
            },
            include: [
                {
                    model: Task,
                    as: 'task',
                    include: [
                        {
                            model: User,
                            as: 'client',
                            attributes: ['id', 'firstName', 'lastName', 'email']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            postedTasks,
            activeTasks,
            pendingBids
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch user tasks' });
    }
};

export const acquireTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.clientId === req.userId) {
            return res.status(400).json({ message: 'You cannot acquire your own task' });
        }
        if (task.status !== 'open') {
            return res.status(400).json({ message: 'Task is not open for acquisition' });
        }

        // Create an accepted bid for the user
        const bid = await Bid.create({
            taskId,
            serviceProviderId: req.userId,
            amount: task.budget,
            deliveryTime: 7, // default 7 days
            description: req.body.description || 'Acquired directly',
            status: 'accepted',
        } as any);

        // Update task status and accepted bid ID
        task.status = 'in_progress';
        task.acceptedBidId = bid.id;
        await task.save();

        res.status(200).json({
            message: 'Task acquired successfully',
            task,
            bid
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to acquire task' });
    }
};
