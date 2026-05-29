import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    createReview,
    getUserReviews,
    getTaskReview,
} from '../controllers/reviewController';

const router = Router();

router.post('/', authenticate, createReview);
router.get('/user/:userId', getUserReviews);
router.get('/task/:taskId', getTaskReview);

export default router;
