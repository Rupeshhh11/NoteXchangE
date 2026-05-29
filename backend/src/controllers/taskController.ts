import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Task from '../models/Task';

// Get all tasks
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

// Create new task
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

// Get task by ID
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
