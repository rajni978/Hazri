import express from 'express';
import {
   createSession,
  listSessions,
  checkIn,
  getMyAttendance,
  getSessionAttendance,
  regenerateOTP,
  updateAttendance,
  finalizeSession,
  exportSessionAttendance,
} from '../controllers/attendanceController.js';

import {
  protect,
  authorizeRoles,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/sessions', protect, authorizeRoles('mentor'), createSession);
router.get('/sessions', protect, authorizeRoles('mentor'), listSessions);
router.get('/sessions/:sessionId/attendance', protect, authorizeRoles('mentor'), getSessionAttendance);
router.post('/sessions/:sessionId/regenerate', protect, authorizeRoles('mentor'), regenerateOTP);
router.post('/check-in', protect, authorizeRoles('student'), checkIn);
router.get('/my', protect, authorizeRoles('student'), getMyAttendance);
router.patch(
  '/:attendanceId',
  protect,
  authorizeRoles('mentor'),
  updateAttendance
);
router.patch(
  '/sessions/:sessionId/finalize',
  protect,
  authorizeRoles('mentor'),
  finalizeSession
);

router.get(
  '/sessions/:sessionId/export',
  protect,
  authorizeRoles('mentor'),
  exportSessionAttendance
);
export default router;
