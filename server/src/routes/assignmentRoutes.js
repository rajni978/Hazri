import express from 'express';
import {
  listAssignments,
  assignMentorsToClass,
  assignMentorsToSubject,
  assignSubjectsToClass,
  updateClassMentors,
  updateSubjectMentors,
  removeMentorFromClass,
  removeMentorFromSubject,
  removeSubjectFromClass,
} from '../controllers/assignmentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only: mentor assignment system
router.get('/', protect, authorizeRoles('admin'), listAssignments);
router.post(
  '/class',
  protect,
  authorizeRoles('admin'),
  assignMentorsToClass
);
router.post(
  '/subject',
  protect,
  authorizeRoles('admin'),
  assignMentorsToSubject
);
router.put(
  '/class/:classId',
  protect,
  authorizeRoles('admin'),
  updateClassMentors
);
router.put(
  '/subject/:subjectId',
  protect,
  authorizeRoles('admin'),
  updateSubjectMentors
);
router.delete(
  '/class/:classId/mentors/:mentorId',
  protect,
  authorizeRoles('admin'),
  removeMentorFromClass
);
router.delete(
  '/subject/:subjectId/mentors/:mentorId',
  protect,
  authorizeRoles('admin'),
  removeMentorFromSubject
);
router.post(
  '/class/:classId/subjects',
  protect,
  authorizeRoles('admin'),
  assignSubjectsToClass
);
router.delete(
  '/class/:classId/subjects/:subjectId',
  protect,
  authorizeRoles('admin'),
  removeSubjectFromClass
);

export default router;
