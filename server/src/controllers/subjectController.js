import Subject from '../models/Subject.js';
import Class from '../models/Class.js';
import Mentor from '../models/Mentor.js';

async function findSubjectById(subjectId) {
  return Subject.findById(subjectId)
    .populate('classes', 'className classCode academicYear')
    .populate('mentors', 'mentorId phone')
    .lean();
}

export const listSubjects = async (req, res) => {
  try {
    const { q, page = 1, limit = 50 } = req.query;
    const subjects = await Subject.find({ isActive: true })
      .populate('classes', 'className classCode')
      .populate('mentors', 'mentorId')
      .sort({ createdAt: -1 })
      .lean();

    let results = subjects;
    if (q) {
      const query = String(q).trim().toLowerCase();
      results = results.filter(
        (s) =>
          (s.subjectName && s.subjectName.toLowerCase().includes(query)) ||
          (s.subjectCode && s.subjectCode.toLowerCase().includes(query)) ||
          (s.description && s.description.toLowerCase().includes(query))
      );
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
    const total = results.length;
    const data = results.slice((pageNumber - 1) * limitNumber, pageNumber * limitNumber);

    return res.json({
      success: true,
      message: 'Subjects retrieved',
      data,
      meta: { total, page: pageNumber, limit: limitNumber },
    });
  } catch (error) {
    console.error('List subjects error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSubject = async (req, res) => {
  try {
    const subject = await findSubjectById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    return res.json({ success: true, message: 'Subject details', data: subject });
  } catch (error) {
    console.error('Get subject error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid subject id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, description } = req.body;

    if (!subjectName || !String(subjectName).trim()) {
      return res.status(400).json({ success: false, message: 'subjectName is required' });
    }
    if (!subjectCode || !String(subjectCode).trim()) {
      return res.status(400).json({ success: false, message: 'subjectCode is required' });
    }

    const normalizedCode = String(subjectCode).trim().toUpperCase();

    const existing = await Subject.findOne({ subjectCode: normalizedCode }).lean();
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: 'Subject code already exists' });
    }

    const subject = await Subject.create({
      subjectName: String(subjectName).trim(),
      subjectCode: normalizedCode,
      description: description ? String(description).trim() : '',
      classes: [],
      mentors: [],
      isActive: true,
    });

    const populated = await findSubjectById(subject._id);
    return res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: populated,
    });
  } catch (error) {
    console.error('Create subject error:', error.message);
    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Subject code already exists',
      });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const { subjectName, subjectCode, description, isActive } = req.body;

    if (subjectCode && String(subjectCode).trim().toUpperCase() !== subject.subjectCode) {
      const normalizedCode = String(subjectCode).trim().toUpperCase();
      const exists = await Subject.findOne({ subjectCode: normalizedCode }).lean();
      if (exists) {
        return res.status(409).json({ success: false, message: 'Subject code already exists' });
      }
      subject.subjectCode = normalizedCode;
    }
    if (subjectName) subject.subjectName = String(subjectName).trim();
    if (description !== undefined) subject.description = String(description).trim();
    if (isActive !== undefined) subject.isActive = Boolean(isActive);

    await subject.save();
    const populated = await findSubjectById(subject._id);
    return res.json({ success: true, message: 'Subject updated', data: populated });
  } catch (error) {
    console.error('Update subject error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid subject id' });
    }
    if (error && error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Subject code already exists' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    subject.isActive = false;
    await subject.save();

    return res.json({ success: true, message: 'Subject deactivated' });
  } catch (error) {
    console.error('Delete subject error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid subject id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
