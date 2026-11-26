import express from 'express';
import {
  listMentors,
  getMentor,
  createMentor,
  updateMentor,
  deleteMentor,
} from '../controllers/mentorController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only: mentor management
router.get('/', protect, authorizeRoles('admin'), listMentors);
router.get('/:id', protect, authorizeRoles('admin'), getMentor);
router.post('/', protect, authorizeRoles('admin'), createMentor);
router.put('/:id', protect, authorizeRoles('admin'), updateMentor);
router.delete('/:id', protect, authorizeRoles('admin'), deleteMentor);

export default router;
