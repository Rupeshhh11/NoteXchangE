import { Router } from 'express';
import { register, login, logout, sendOTP, verifyOTP } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

export default router;
