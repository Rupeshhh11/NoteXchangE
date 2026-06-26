import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getMyTasks,
    acquireTask,
} from '../controllers/taskController';

const router = Router();

router.get('/', getAllTasks);
router.post('/', authenticate, createTask);
router.get('/my-tasks', authenticate, getMyTasks);
router.post('/:id/acquire', authenticate, acquireTask);
router.get('/:id', getTaskById);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);

export default router;
