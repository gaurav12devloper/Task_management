import express from 'express';
import { getTasks, createTask, editTask, deleteTask } from '../controllers/taskController';
import protect from '../middleware/authMiddleware';
import { validation,taskValidation, updateTaskValidation } from '../validation';
const router = express.Router();

router.route('/').get(protect,getTasks);
router.route('/create').post(taskValidation(),validation,protect,createTask);
router.route('/edit/:id').put(updateTaskValidation(),validation,protect,editTask);
router.route('/delete/:id').delete(protect,deleteTask);
export default router;