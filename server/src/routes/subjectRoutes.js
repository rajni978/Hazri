import express from 'express';
import {
  listSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only: subject management
router.get('/', protect, authorizeRoles('admin'), listSubjects);
router.get('/:id', protect, authorizeRoles('admin'), getSubject);
router.post('/', protect, authorizeRoles('admin'), createSubject);
router.put('/:id', protect, authorizeRoles('admin'), updateSubject);
router.delete('/:id', protect, authorizeRoles('admin'), deleteSubject);

export default router;
