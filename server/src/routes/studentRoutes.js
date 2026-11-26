import express from 'express';
import {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only: student management
router.get('/', protect, authorizeRoles('admin'), listStudents);
router.get('/:id', protect, authorizeRoles('admin'), getStudent);
router.post('/', protect, authorizeRoles('admin'), createStudent);
router.put('/:id', protect, authorizeRoles('admin'), updateStudent);
router.delete('/:id', protect, authorizeRoles('admin'), deleteStudent);

export default router;
