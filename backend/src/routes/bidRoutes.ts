import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    placeBid,
    getBidsForTask,
    acceptBid,
    rejectBid,
} from '../controllers/bidController';

const router = Router();

router.post('/', authenticate, placeBid);
router.get('/task/:taskId', getBidsForTask);
router.put('/:bidId/accept', authenticate, acceptBid);
router.put('/:bidId/reject', authenticate, rejectBid);

export default router;
