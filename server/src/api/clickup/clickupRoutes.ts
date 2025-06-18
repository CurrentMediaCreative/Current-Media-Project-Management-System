import express from 'express';
import { getTask, getSubTasks, updateTask } from './clickupController';

const router = express.Router();

router.get('/tasks/:taskId', getTask);
router.get('/tasks/:taskId/subtasks', getSubTasks);
router.patch('/tasks/:taskId', updateTask);

export default router;
