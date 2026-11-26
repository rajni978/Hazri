import Student from '../models/Student.js';
import Mentor from '../models/Mentor.js';
import User from '../models/User.js';
import Class from '../models/Class.js';

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id, isActive: true })
      .populate('user', 'fullName email role isActive rollNumber')
      .populate('class', 'className classCode academicYear description')
      .lean();

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    let subjects = [];
    let mentors = [];
    if (student.class) {
      const classDoc = await Class.findById(student.class._id)
        .populate('subjects', 'subjectName subjectCode description')
        .populate('mentors', 'mentorId phone fullName')
        .lean();
      subjects = classDoc.subjects || [];
      mentors = classDoc.mentors || [];
    }

    return res.json({
      success: true,
      message: 'Student profile',
      data: { ...student, subjects, mentors },
    });
  } catch (error) {
    console.error('Get student profile error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMentorProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id, isActive: true })
      .populate('user', 'fullName email role isActive rollNumber')
      .populate('assignedClasses', 'className classCode academicYear description')
      .populate('assignedSubjects', 'subjectName subjectCode description classes')
      .lean();

    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor profile not found' });
    }

    let students = [];
    if (mentor.assignedClasses && mentor.assignedClasses.length) {
      const classIds = mentor.assignedClasses.map((c) => c._id || c);
      students = await Student.find({ class: { $in: classIds }, isActive: true })
        .populate('user', 'fullName email rollNumber')
        .populate('class', 'className classCode')
        .lean();
    }

    return res.json({
      success: true,
      message: 'Mentor profile',
      data: { ...mentor, students },
    });
  } catch (error) {
    console.error('Get mentor profile error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const { phone, fullName, email } = req.body;

    const student = await Student.findOne({ user: req.user.id, isActive: true });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    if (phone !== undefined) student.phone = String(phone).trim();
    await student.save();

    const updates = {};
    if (fullName) updates.fullName = String(fullName).trim();
    if (email) {
      const trimmedEmail = String(email).trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
      }
      const owner = await User.findOne({ email: trimmedEmail }).lean();
      if (owner && owner._id.toString() !== req.user.id) {
        return res.status(409).json({ success: false, message: 'Email is already registered' });
      }
      updates.email = trimmedEmail;
    }
    if (Object.keys(updates).length) {
      await User.findByIdAndUpdate(req.user.id, updates);
    }

    const updated = await Student.findOne({ user: req.user.id })
      .populate('user', 'fullName email role isActive rollNumber')
      .populate('class', 'className classCode academicYear')
      .lean();

    return res.json({ success: true, message: 'Profile updated', data: updated });
  } catch (error) {
    console.error('Update student profile error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateMentorProfile = async (req, res) => {
  try {
    const { phone, fullName, email } = req.body;

    const mentor = await Mentor.findOne({ user: req.user.id, isActive: true });
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor profile not found' });
    }

    if (phone !== undefined) mentor.phone = String(phone).trim();
    await mentor.save();

    const updates = {};
    if (fullName) updates.fullName = String(fullName).trim();
    if (email) {
      const trimmedEmail = String(email).trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
      }
      const owner = await User.findOne({ email: trimmedEmail }).lean();
      if (owner && owner._id.toString() !== req.user.id) {
        return res.status(409).json({ success: false, message: 'Email is already registered' });
      }
      updates.email = trimmedEmail;
    }
    if (Object.keys(updates).length) {
      await User.findByIdAndUpdate(req.user.id, updates);
    }

    const updated = await Mentor.findOne({ user: req.user.id })
      .populate('user', 'fullName email role isActive rollNumber')
      .populate('assignedClasses', 'className classCode academicYear')
      .populate('assignedSubjects', 'subjectName subjectCode')
      .lean();

    return res.json({ success: true, message: 'Profile updated', data: updated });
  } catch (error) {
    console.error('Update mentor profile error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
