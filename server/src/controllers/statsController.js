import User from '../models/User.js';
import Student from '../models/Student.js';
import Mentor from '../models/Mentor.js';
import Class from '../models/Class.js';
import Subject from '../models/Subject.js';

/**
 * GET /api/admin/stats
 * Admin: overall system statistics.
 */
export const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, totalMentors, totalClasses, totalSubjects] =
      await Promise.all([
        Student.countDocuments({ isActive: true }),
        Mentor.countDocuments({ isActive: true }),
        Class.countDocuments({ isActive: true }),
        Subject.countDocuments({ isActive: true }),
      ]);

    const studentsByClass = await Student.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$class', count: { $sum: 1 } } },
    ]);

    return res.json({
      success: true,
      message: 'System statistics',
      data: {
        totalStudents,
        totalMentors,
        totalClasses,
        totalSubjects,
        studentsByClass,
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
