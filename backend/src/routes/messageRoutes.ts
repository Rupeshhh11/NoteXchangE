import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    sendMessage,
    getMessages,
    markAsRead,
} from '../controllers/messageController';

const router = Router();

router.post('/', authenticate, sendMessage);
router.get('/:recipientId', authenticate, getMessages);
router.put('/:messageId/read', authenticate, markAsRead);

export default router;
