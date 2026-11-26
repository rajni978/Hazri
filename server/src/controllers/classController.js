import Class from '../models/Class.js';
import Student from '../models/Student.js';
import Mentor from '../models/Mentor.js';
import Subject from '../models/Subject.js';

async function findClassById(classId) {
  return Class.findById(classId)
    .populate('students', 'studentId phone isActive')
    .populate('mentors', 'mentorId phone isActive')
    .populate('subjects', 'subjectName subjectCode')
    .lean();
}

export const listClasses = async (req, res) => {
  try {
    const { q, page = 1, limit = 50 } = req.query;
    const classes = await Class.find({ isActive: true })
      .populate('students', 'studentId')
      .populate('mentors', 'mentorId')
      .populate('subjects', 'subjectName')
      .sort({ createdAt: -1 })
      .lean();

    let results = classes;
    if (q) {
      const query = String(q).trim().toLowerCase();
      results = results.filter(
        (c) =>
          (c.className && c.className.toLowerCase().includes(query)) ||
          (c.classCode && c.classCode.toLowerCase().includes(query)) ||
          (c.description && c.description.toLowerCase().includes(query))
      );
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
    const total = results.length;
    const data = results.slice((pageNumber - 1) * limitNumber, pageNumber * limitNumber);

    return res.json({
      success: true,
      message: 'Classes retrieved',
      data,
      meta: { total, page: pageNumber, limit: limitNumber },
    });
  } catch (error) {
    console.error('List classes error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getClass = async (req, res) => {
  try {
    const classDoc = await findClassById(req.params.id);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    return res.json({ success: true, message: 'Class details', data: classDoc });
  } catch (error) {
    console.error('Get class error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid class id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createClass = async (req, res) => {
  try {
    const { className, classCode, description, academicYear } = req.body;

    if (!className || !String(className).trim()) {
      return res.status(400).json({ success: false, message: 'className is required' });
    }
    if (!classCode || !String(classCode).trim()) {
      return res.status(400).json({ success: false, message: 'classCode is required' });
    }

    const normalizedCode = String(classCode).trim().toUpperCase();

    const existing = await Class.findOne({ classCode: normalizedCode }).lean();
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: 'Class code already exists' });
    }

    const classDoc = await Class.create({
      className: String(className).trim(),
      classCode: normalizedCode,
      description: description ? String(description).trim() : '',
      academicYear: academicYear ? String(academicYear).trim() : '',
      students: [],
      mentors: [],
      subjects: [],
      isActive: true,
    });

    const populated = await findClassById(classDoc._id);
    return res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: populated,
    });
  } catch (error) {
    console.error('Create class error:', error.message);
    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Class code already exists',
      });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateClass = async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const { className, classCode, description, academicYear, isActive } = req.body;

    if (classCode && String(classCode).trim().toUpperCase() !== classDoc.classCode) {
      const normalizedCode = String(classCode).trim().toUpperCase();
      const exists = await Class.findOne({ classCode: normalizedCode }).lean();
      if (exists) {
        return res.status(409).json({ success: false, message: 'Class code already exists' });
      }
      classDoc.classCode = normalizedCode;
    }
    if (className) classDoc.className = String(className).trim();
    if (description !== undefined) classDoc.description = String(description).trim();
    if (academicYear !== undefined) classDoc.academicYear = String(academicYear).trim();
    if (isActive !== undefined) classDoc.isActive = Boolean(isActive);

    await classDoc.save();
    const populated = await findClassById(classDoc._id);
    return res.json({ success: true, message: 'Class updated', data: populated });
  } catch (error) {
    console.error('Update class error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid class id' });
    }
    if (error && error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Class code already exists' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    classDoc.isActive = false;
    await classDoc.save();

    return res.json({ success: true, message: 'Class deactivated' });
  } catch (error) {
    console.error('Delete class error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid class id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
