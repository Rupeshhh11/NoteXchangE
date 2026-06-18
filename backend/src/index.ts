import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';

dotenv.config();

import './models/associations';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import bidRoutes from './routes/bidRoutes';
import paymentRoutes from './routes/paymentRoutes';
import messageRoutes from './routes/messageRoutes';
import reviewRoutes from './routes/reviewRoutes';
import adminRoutes from './routes/adminRoutes';
import errorHandler from './middleware/errorHandler';
import { authenticate } from './middleware/auth';

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
});

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Server is running', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', authenticate, adminRoutes);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join-chat', (roomId: string) => {
        socket.join(`chat-${roomId}`);
        socket.emit('joined-chat', { roomId });
    });
    socket.on('send-message', (data: any) => {
        io.to(`chat-${data.roomId}`).emit('receive-message', data);
    });
    socket.on('task-updated', (taskId: string, data: any) => {
        io.emit(`task-${taskId}`, data);
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

app.use(errorHandler);
app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

export default app;
export { io };
