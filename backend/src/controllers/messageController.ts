import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Message from '../models/Message';
import User from '../models/User';

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { recipientId, taskId, message, attachments } = req.body;

        const msg = await Message.create({
            senderId: req.userId,
            recipientId,
            taskId,
            message,
            attachments: attachments || [],
        } as any);

        res.status(201).json({
            message: 'Message sent successfully',
            data: msg,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to send message' });
    }
};

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { recipientId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

        const { count, rows } = await Message.findAndCountAll({
            where: {
                senderId: [req.userId, recipientId].filter(Boolean) as string[],
                recipientId: [req.userId, recipientId].filter(Boolean) as string[],
            },
            include: [
                { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'profileImage'] },
                { model: User, as: 'recipient', attributes: ['id', 'firstName', 'lastName', 'profileImage'] },
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit as string),
            offset,
        });

        res.status(200).json({
            messages: rows,
            total: count,
            page: parseInt(page as string),
            totalPages: Math.ceil(count / parseInt(limit as string)),
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch messages' });
    }
};

// Mark message as read
export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { messageId } = req.params;

        const msg = await Message.findByPk(messageId);
        if (!msg) {
            return res.status(404).json({ message: 'Message not found' });
        }

        msg.isRead = true;
        await msg.save();

        res.status(200).json({
            message: 'Message marked as read',
            data: msg,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to mark message' });
    }
};
