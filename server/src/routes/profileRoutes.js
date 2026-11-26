import express from 'express';
import {
  getStudentProfile,
  updateStudentProfile,
  getMentorProfile,
  updateMentorProfile,
} from '../controllers/profileController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Self-service profile routes
router.get('/student', protect, authorizeRoles('student'), getStudentProfile);
router.put('/student', protect, authorizeRoles('student'), updateStudentProfile);
router.get('/mentor', protect, authorizeRoles('mentor'), getMentorProfile);
router.put('/mentor', protect, authorizeRoles('mentor'), updateMentorProfile);

export default router;
