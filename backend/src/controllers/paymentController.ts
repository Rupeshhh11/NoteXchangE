import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Payment from '../models/Payment';
import Task from '../models/Task';
import Wallet from '../models/Wallet';

// Create payment order (Razorpay)
export const createPaymentOrder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { taskId, amount } = req.body;

        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const payment = await Payment.create({
            taskId,
            clientId: req.userId,
            amount,
            status: 'pending',
        } as any);

        res.status(201).json({
            message: 'Payment order created',
            payment,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to create payment order' });
    }
};

// Verify payment
export const verifyPayment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { paymentId, razorpayOrderId, razorpaySignature } = req.body;

        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.razorpayOrderId = razorpayOrderId;
        payment.razorpaySignature = razorpaySignature;
        payment.status = 'completed';

        await payment.save();

        // Update wallet
        const wallet = await Wallet.findOne({ where: { userId: payment.serviceProviderId } });
        if (wallet) {
            wallet.balance += payment.amount;
            wallet.totalEarned += payment.amount;
            await wallet.save();
        }

        res.status(200).json({
            message: 'Payment verified successfully',
            payment,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to verify payment' });
    }
};

// Get payments
export const getPayments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const payments = await Payment.findAll({
            where: {
                clientId: req.userId,
            },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(payments);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch payments' });
    }
};
