import express from 'express';
import { registerStudent,
    loginUser
 } from '../controllers/authController.js';

import {
  protect,
  authorizeRoles,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Public student registration
router.post('/register', registerStudent);
// Login for students, mentors and admins
router.post('/login',loginUser);


// Protected route: any authenticated user
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Protected route: admin only
router.get('/admin-check', protect, authorizeRoles('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Admin access granted',
  });
});

export default router;
