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
try {
    const { orderId, paymentId, signature } = req.body;
    // Implement signature verification
    res.status(200).json({ message: 'Payment verified' });
} catch (error: any) {
    res.status(500).json({ message: error.message || 'Payment verification failed' });
}
});

export default router;
