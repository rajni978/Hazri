import Class from '../models/Class.js';
import Subject from '../models/Subject.js';
import Mentor from '../models/Mentor.js';

function normalizeIds(ids) {
  if (!ids) return [];
  const arr = Array.isArray(ids) ? ids : [ids];
  return arr.filter((id) => id && String(id).trim());
}

export const listAssignments = async (req, res) => {
  try {
    const classes = await Class.find({ isActive: true })
      .populate('mentors', 'mentorId phone')
      .select('className classCode mentors')
      .lean();

    const subjects = await Subject.find({ isActive: true })
      .populate('mentors', 'mentorId phone')
      .select('subjectName subjectCode mentors')
      .lean();

    return res.json({
      success: true,
      message: 'Assignments retrieved',
      data: { classes, subjects },
    });
  } catch (error) {
    console.error('List assignments error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const assignMentorsToClass = async (req, res) => {
  try {
    const { classId, mentorIds } = req.body;
    const ids = normalizeIds(mentorIds);
    if (!classId || !ids.length) {
      return res.status(400).json({
        success: false,
        message: 'classId and mentorIds are required',
      });
    }

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const mentors = await Mentor.find({ _id: { $in: ids }, isActive: true }).lean();
    if (mentors.length !== ids.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more mentor ids are invalid or inactive',
      });
    }

    classDoc.mentors = Array.from(
      new Set([...classDoc.mentors.map(String), ...ids.map(String)])
    ).map((id) => id);
    await classDoc.save();

    await Mentor.updateMany(
      { _id: { $in: ids } },
      { $addToSet: { assignedClasses: classId } }
    );

    const populated = await Class.findById(classDoc._id)
      .populate('mentors', 'mentorId phone isActive')
      .lean();

    return res.json({
      success: true,
      message: 'Mentors assigned to class',
      data: populated,
    });
  } catch (error) {
    console.error('Assign mentors to class error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const assignMentorsToSubject = async (req, res) => {
  try {
    const { subjectId, mentorIds } = req.body;
    const ids = normalizeIds(mentorIds);
    if (!subjectId || !ids.length) {
      return res.status(400).json({
        success: false,
        message: 'subjectId and mentorIds are required',
      });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const mentors = await Mentor.find({ _id: { $in: ids }, isActive: true }).lean();
    if (mentors.length !== ids.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more mentor ids are invalid or inactive',
      });
    }

    subject.mentors = Array.from(
      new Set([...subject.mentors.map(String), ...ids.map(String)])
    ).map((id) => id);
    await subject.save();

    await Mentor.updateMany(
      { _id: { $in: ids } },
      { $addToSet: { assignedSubjects: subjectId } }
    );

    const populated = await Subject.findById(subject._id)
      .populate('mentors', 'mentorId phone isActive')
      .lean();

    return res.json({
      success: true,
      message: 'Mentors assigned to subject',
      data: populated,
    });
  } catch (error) {
    console.error('Assign mentors to subject error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateClassMentors = async (req, res) => {
  try {
    const { classId } = req.params;
    const { mentorIds } = req.body;
    const ids = normalizeIds(mentorIds);

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const valid = await Mentor.find({ _id: { $in: ids }, isActive: true }).lean();
    if (ids.length && valid.length !== ids.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more mentor ids are invalid or inactive',
      });
    }

    const previous = [...classDoc.mentors.map(String)];
    classDoc.mentors = ids.map(String);
    await classDoc.save();

    const removed = previous.filter((id) => !ids.includes(id));
    if (removed.length) {
      await Mentor.updateMany(
        { _id: { $in: removed } },
        { $pull: { assignedClasses: classId } }
      );
    }
    const added = ids.filter((id) => !previous.includes(id));
    if (added.length) {
      await Mentor.updateMany(
        { _id: { $in: added } },
        { $addToSet: { assignedClasses: classId } }
      );
    }

    const populated = await Class.findById(classDoc._id)
      .populate('mentors', 'mentorId phone isActive')
      .lean();

    return res.json({
      success: true,
      message: 'Class mentors updated',
      data: populated,
    });
  } catch (error) {
    console.error('Update class mentors error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSubjectMentors = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { mentorIds } = req.body;
    const ids = normalizeIds(mentorIds);

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const valid = await Mentor.find({ _id: { $in: ids }, isActive: true }).lean();
    if (ids.length && valid.length !== ids.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more mentor ids are invalid or inactive',
      });
    }

    const previous = [...subject.mentors.map(String)];
    subject.mentors = ids.map(String);
    await subject.save();

    const removed = previous.filter((id) => !ids.includes(id));
    if (removed.length) {
      await Mentor.updateMany(
        { _id: { $in: removed } },
        { $pull: { assignedSubjects: subjectId } }
      );
    }
    const added = ids.filter((id) => !previous.includes(id));
    if (added.length) {
      await Mentor.updateMany(
        { _id: { $in: added } },
        { $addToSet: { assignedSubjects: subjectId } }
      );
    }

    const populated = await Subject.findById(subject._id)
      .populate('mentors', 'mentorId phone isActive')
      .lean();

    return res.json({
      success: true,
      message: 'Subject mentors updated',
      data: populated,
    });
  } catch (error) {
    console.error('Update subject mentors error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const removeMentorFromClass = async (req, res) => {
  try {
    const { classId, mentorId } = req.params;

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    classDoc.mentors = classDoc.mentors.filter((id) => String(id) !== mentorId);
    await classDoc.save();

    await Mentor.findByIdAndUpdate(mentorId, { $pull: { assignedClasses: classId } });

    return res.json({ success: true, message: 'Mentor removed from class' });
  } catch (error) {
    console.error('Remove mentor from class error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const removeMentorFromSubject = async (req, res) => {
  try {
    const { subjectId, mentorId } = req.params;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    subject.mentors = subject.mentors.filter((id) => String(id) !== mentorId);
    await subject.save();

    await Mentor.findByIdAndUpdate(mentorId, { $pull: { assignedSubjects: subjectId } });

    return res.json({ success: true, message: 'Mentor removed from subject' });
  } catch (error) {
    console.error('Remove mentor from subject error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/assignments/class/:classId/subjects
 * Admin: assign one or more subjects to a class.
 * Body: { subjectIds: [...] }
 */
export const assignSubjectsToClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { subjectIds } = req.body;
    const ids = normalizeIds(subjectIds);
    if (!ids.length) {
      return res.status(400).json({
        success: false,
        message: 'subjectIds are required',
      });
    }

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const subjects = await Subject.find({ _id: { $in: ids }, isActive: true }).lean();
    if (subjects.length !== ids.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more subject ids are invalid or inactive',
      });
    }

    classDoc.subjects = Array.from(
      new Set([...classDoc.subjects.map(String), ...ids.map(String)])
    ).map((id) => id);
    await classDoc.save();

    await Subject.updateMany(
      { _id: { $in: ids } },
      { $addToSet: { classes: classId } }
    );

    const populated = await Class.findById(classDoc._id)
      .populate('subjects', 'subjectName subjectCode')
      .lean();

    return res.json({
      success: true,
      message: 'Subjects assigned to class',
      data: populated,
    });
  } catch (error) {
    console.error('Assign subjects to class error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * DELETE /api/assignments/class/:classId/subjects/:subjectId
 * Admin: remove a subject from a class.
 */
export const removeSubjectFromClass = async (req, res) => {
  try {
    const { classId, subjectId } = req.params;

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    classDoc.subjects = classDoc.subjects.filter((id) => String(id) !== subjectId);
    await classDoc.save();

    await Subject.findByIdAndUpdate(subjectId, { $pull: { classes: classId } });

    return res.json({ success: true, message: 'Subject removed from class' });
  } catch (error) {
    console.error('Remove subject from class error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
