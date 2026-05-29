import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
} from '../controllers/taskController';

const router = Router();

router.get('/', getAllTasks);
router.post('/', authenticate, createTask);
router.get('/:id', getTaskById);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);

export default router;
