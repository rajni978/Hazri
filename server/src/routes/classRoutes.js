import express from 'express';
import {
  listClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only: class management
router.get('/', protect, authorizeRoles('admin'), listClasses);
router.get('/:id', protect, authorizeRoles('admin'), getClass);
router.post('/', protect, authorizeRoles('admin'), createClass);
router.put('/:id', protect, authorizeRoles('admin'), updateClass);
router.delete('/:id', protect, authorizeRoles('admin'), deleteClass);

export default router;
