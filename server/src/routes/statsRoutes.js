import express from 'express';
import { getAdminStats } from '../controllers/statsController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only: system statistics
router.get('/admin/stats', protect, authorizeRoles('admin'), getAdminStats);

export default router;
