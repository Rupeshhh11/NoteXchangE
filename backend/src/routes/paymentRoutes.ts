import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    createPaymentOrder,
    verifyPayment,
    getPayments,
} from '../controllers/paymentController';

const router = Router();

router.post('/create-order', authenticate, createPaymentOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/', authenticate, getPayments);

export default router;



