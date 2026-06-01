import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Task from '../models/Task';
import Bid from '../models/Bid';
import User from '../models/User';

export const placeBid = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { taskId, amount, deliveryTime, description } = req.body;

        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const bid = await Bid.create({
            taskId,
            serviceProviderId: req.userId,
            amount,
            deliveryTime,
            description,
            status: 'pending',
        } as any);

        res.status(201).json({
            message: 'Bid placed successfully',
            bid,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to place bid' });
    }
};

export const getBidsForTask = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;

        const bids = await Bid.findAll({
            where: { taskId },
            include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'rating'] }],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(bids);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch bids' });
    }
};

export const acceptBid = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { bidId } = req.params;

        const bid = await Bid.findByPk(bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        const task = await Task.findByPk(bid.taskId);
        if (!task || task.clientId !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        bid.status = 'accepted';
        task.acceptedBidId = bidId;
        task.status = 'in_progress';

        await bid.save();
        await task.save();

        res.status(200).json({
            message: 'Bid accepted successfully',
            bid,
            task,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to accept bid' });
    }
};

// Reject a bid
export const rejectBid = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { bidId } = req.params;

        const bid = await Bid.findByPk(bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        bid.status = 'rejected';
        await bid.save();

        res.status(200).json({
            message: 'Bid rejected successfully',
            bid,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to reject bid' });
    }
};
