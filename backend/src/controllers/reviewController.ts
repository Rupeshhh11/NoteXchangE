import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Review from '../models/Review';
import Task from '../models/Task';
import User from '../models/User';

export const createReview = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { taskId, toUserId, rating, comment } = req.body;

        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const review = await Review.create({
            taskId,
            fromUserId: req.userId,
            toUserId,
            rating,
            comment,
        } as any);

        // Update user rating
        const reviews = await Review.findAll({ where: { toUserId } });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        const user = await User.findByPk(toUserId);
        if (user) {
            user.rating = avgRating;
            user.ratingCount = reviews.length;
            await user.save();
        }

        res.status(201).json({
            message: 'Review created successfully',
            review,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to create review' });
    }
};

// Get reviews for user
export const getUserReviews = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const reviews = await Review.findAll({
            where: { toUserId: userId },
            include: [
                { model: User, as: 'reviewer', attributes: ['id', 'firstName', 'lastName', 'profileImage'] },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(reviews);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch reviews' });
    }
};

// Get review for specific task
export const getTaskReview = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;

        const review = await Review.findOne({ where: { taskId } });
        if (!review) {
            return res.status(404).json({ message: 'No review found for this task' });
        }

        res.status(200).json(review);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch review' });
    }
};
