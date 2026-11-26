import Mentor from '../models/Mentor.js';
import User from '../models/User.js';
import Class from '../models/Class.js';
import Subject from '../models/Subject.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function findMentorById(mentorId) {
  return Mentor.findById(mentorId)
    .populate('user', 'fullName email role isActive')
    .populate('assignedClasses', 'className classCode academicYear')
    .populate('assignedSubjects', 'subjectName subjectCode')
    .lean();
}

export const listMentors = async (req, res) => {
  try {
    const { q, page = 1, limit = 50 } = req.query;
    const mentors = await Mentor.find({ isActive: true })
      .populate('user', 'fullName email role isActive')
      .populate('assignedClasses', 'className classCode')
      .populate('assignedSubjects', 'subjectName subjectCode')
      .sort({ createdAt: -1 })
      .lean();

    let results = mentors;
    if (q) {
      const query = String(q).trim().toLowerCase();
      results = results.filter(
        (m) =>
          (m.mentorId && m.mentorId.toLowerCase().includes(query)) ||
          (m.user && m.user.fullName && m.user.fullName.toLowerCase().includes(query)) ||
          (m.user && m.user.email && m.user.email.toLowerCase().includes(query))
      );
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
    const total = results.length;
    const data = results.slice((pageNumber - 1) * limitNumber, pageNumber * limitNumber);

    return res.json({
      success: true,
      message: 'Mentors retrieved',
      data,
      meta: { total, page: pageNumber, limit: limitNumber },
    });
  } catch (error) {
    console.error('List mentors error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMentor = async (req, res) => {
  try {
    const mentor = await findMentorById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }
    return res.json({ success: true, message: 'Mentor details', data: mentor });
  } catch (error) {
    console.error('Get mentor error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid mentor id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
export const createMentor = async (req, res) => {
  try {
    const { fullName, email, password, mentorId, phone } = req.body;

    if (!fullName || !String(fullName).trim()) {
      return res.status(400).json({ success: false, message: 'fullName is required' });
    }
    if (!email || !String(email).trim()) {
      return res.status(400).json({ success: false, message: 'email is required' });
    }
    if (!password || String(password).trim().length < 8) {
      return res
        .status(400)
        .json({ success: false, message: 'Password must be at least 8 characters long' });
    }
    if (!mentorId || !String(mentorId).trim()) {
      return res.status(400).json({ success: false, message: 'mentorId is required' });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const existingUser = await User.findOne({ email: trimmedEmail }).lean();
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    const existingMentorId = await Mentor.findOne({
      mentorId: String(mentorId).trim().toUpperCase(),
    }).lean();
    if (existingMentorId) {
      return res
        .status(409)
        .json({ success: false, message: 'Mentor ID is already registered' });
    }

    const user = await User.create({
      fullName: String(fullName).trim(),
      email: trimmedEmail,
      password: String(password),
      role: 'mentor',
      rollNumber: String(mentorId).trim().toUpperCase(),
      isActive: true,
    });

    const mentor = await Mentor.create({
      user: user._id,
      mentorId: String(mentorId).trim().toUpperCase(),
      phone: phone ? String(phone).trim() : '',
      assignedClasses: [],
      assignedSubjects: [],
      isActive: true,
    });

    const populated = await findMentorById(mentor._id);
    return res.status(201).json({
      success: true,
      message: 'Mentor created successfully',
      data: populated,
    });
  } catch (error) {
    console.error('Create mentor error:', error.message);
    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email or mentor ID already exists',
      });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    const { fullName, email, phone, mentorId, isActive } = req.body;

    if (mentorId && String(mentorId).trim() !== mentor.mentorId) {
      const exists = await Mentor.findOne({
        mentorId: String(mentorId).trim().toUpperCase(),
      }).lean();
      if (exists) {
        return res.status(409).json({
          success: false,
          message: 'Mentor ID is already registered',
        });
      }
      mentor.mentorId = String(mentorId).trim().toUpperCase();
      await User.findByIdAndUpdate(mentor.user, {
        rollNumber: String(mentorId).trim().toUpperCase(),
      });
    }

    if (phone !== undefined) mentor.phone = String(phone).trim();
    if (isActive !== undefined) mentor.isActive = Boolean(isActive);

    await mentor.save();

    if (fullName || email) {
      const updates = {};
      if (fullName) updates.fullName = String(fullName).trim();
      if (email) {
        const trimmedEmail = String(email).trim().toLowerCase();
        if (!emailRegex.test(trimmedEmail)) {
          return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address',
          });
        }
        const emailOwner = await User.findOne({ email: trimmedEmail }).lean();
        if (emailOwner && emailOwner._id.toString() !== mentor.user.toString()) {
          return res.status(409).json({
            success: false,
            message: 'Email is already registered',
          });
        }
        updates.email = trimmedEmail;
      }
      await User.findByIdAndUpdate(mentor.user, updates);
    }

    const populated = await findMentorById(mentor._id);
    return res.json({ success: true, message: 'Mentor updated', data: populated });
  } catch (error) {
    console.error('Update mentor error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid mentor id' });
    }
    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email or mentor ID already exists',
      });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    mentor.isActive = false;
    await mentor.save();

    await User.findByIdAndUpdate(mentor.user, { isActive: false });

    return res.json({ success: true, message: 'Mentor deactivated' });
  } catch (error) {
    console.error('Delete mentor error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid mentor id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

