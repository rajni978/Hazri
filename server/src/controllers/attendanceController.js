import crypto from 'crypto';
import AttendanceSession from '../models/AttendanceSession.js';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import Mentor from '../models/Mentor.js';
import Class from '../models/Class.js';
import Subject from '../models/Subject.js';

const hashOTP = (otp) =>
  crypto.createHash('sha256').update(otp).digest('hex');

export const createSession = async (req, res) => {
  try {
    const { classId, subjectId } = req.body;

    if (!classId) {
      return res.status(400).json({ success: false, message: 'Class is required' });
    }

    const mentor = await Mentor.findOne({
      user: req.user.id,
      isActive: true,
    });

    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor profile not found' });
    }

    const assigned = mentor.assignedClasses.some(
      (id) => id.toString() === classId
    );

    if (!assigned) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this class',
      });
    }

    const classExists = await Class.findOne({
      _id: classId,
      isActive: true,
    });

    if (!classExists) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    let subject = null;

    if (subjectId) {
      const subjectAssigned = mentor.assignedSubjects.some(
        (id) => id.toString() === subjectId
      );

      if (!subjectAssigned) {
        return res.status(403).json({
          success: false,
          message: 'You are not assigned to this subject',
        });
      }

      subject = await Subject.findOne({
        _id: subjectId,
        isActive: true,
        classes: classId,
      });

      if (!subject) {
        return res.status(400).json({
          success: false,
          message: 'Subject is not assigned to this class',
        });
      }
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const session = await AttendanceSession.create({
      class: classId,
      subject: subject?._id || null,
      mentor: mentor._id,
      otpHash: hashOTP(otp),
      expiresAt,
    });

    res.status(201).json({
      success: true,
      message: 'Attendance session created',
      session: {
        id: session._id,
        class: classExists.className,
        subject: subject?.subjectName || null,
        otp,
        expiresAt,
      },
    });
  } catch (error) {
    console.error('Create attendance session error:', error);
    res.status(500).json({ success: false, message: 'Could not create attendance session' });
  }
};

export const listSessions = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id });

    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor profile not found' });
    }

    const sessions = await AttendanceSession.find({ mentor: mentor._id })
      .populate('class', 'className classCode')
      .populate('subject', 'subjectName subjectCode')
      .sort({ createdAt: -1 });

    res.json({ success: true, sessions });
  } catch (error) {
    console.error('List attendance sessions error:', error);
    res.status(500).json({ success: false, message: 'Could not load sessions' });
  }
};

export const checkIn = async (req, res) => {
  try {
    const { sessionId, otp } = req.body;

    if (!sessionId || !/^\d{6}$/.test(String(otp || ''))) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid session ID and six-digit OTP',
      });
    }

    const student = await Student.findOne({
      user: req.user.id,
      isActive: true,
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const session = await AttendanceSession.findById(sessionId);

    if (!session || session.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Attendance session not found or closed',
      });
    }

    if (session.expiresAt <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Ask your mentor to create a new session',
      });
    }

    if (!student.class || student.class.toString() !== session.class.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this class',
      });
    }

    const submittedHash = Buffer.from(hashOTP(String(otp)), 'hex');
    const storedHash = Buffer.from(session.otpHash, 'hex');

    if (
      submittedHash.length !== storedHash.length ||
      !crypto.timingSafeEqual(submittedHash, storedHash)
    ) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }

    const record = await Attendance.create({
      session: session._id,
      student: student._id,
      status: 'present',
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance: record,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already checked in for this session',
      });
    }

    console.error('Attendance check-in error:', error);
    res.status(500).json({ success: false, message: 'Could not mark attendance' });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user.id,
      isActive: true,
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const records = await Attendance.find({ student: student._id })
      .populate({
        path: 'session',
        populate: [
          { path: 'class', select: 'className classCode' },
          { path: 'subject', select: 'subjectName subjectCode' },
        ],
      })
      .sort({ checkedInAt: -1 });

    res.json({ success: true, attendance: records });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ success: false, message: 'Could not load attendance' });
  }
};
export const getSessionAttendance = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id });
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor profile not found" });

    const session = await AttendanceSession.findOne({ _id: req.params.sessionId, mentor: mentor._id });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Attendance session not found',
      });
    }

    const records = await Attendance.find({ session: session._id })
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'fullName email',
        },
      })
      .sort({ checkedInAt: -1 });

    res.json({
      success: true,
      session,
      attendance: records,
    });
  } catch (error) {
    console.error('Session attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not load session attendance',
    });
  }
};
export const regenerateOTP = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      user: req.user.id,
      isActive: true,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found',
      });
    }

    const session = await AttendanceSession.findOne({
      _id: req.params.sessionId,
      mentor: mentor._id,
      status: 'active',
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Active attendance session not found',
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    session.otpHash = hashOTP(otp);
    session.expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await session.save();

    res.json({
      success: true,
      message: 'OTP regenerated successfully',
      otp,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error('Regenerate OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not regenerate OTP',
    });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!['present', 'late', 'absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid attendance status',
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A reason is required for attendance correction',
      });
    }

    const mentor = await Mentor.findOne({
      user: req.user.id,
      isActive: true,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found',
      });
    }

    const record = await Attendance.findById(req.params.attendanceId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    const session = await AttendanceSession.findOne({
      _id: record.session,
      mentor: mentor._id,
      status: 'active',
    });

    if (!session) {
      return res.status(403).json({
        success: false,
        message: 'Session not found or already finalized',
      });
    }

    record.status = status;
    record.reason = reason.trim();
    record.markedBy = req.user.id;

    await record.save();

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      attendance: record,
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not update attendance',
    });
  }
};
export const finalizeSession = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      user: req.user.id,
      isActive: true,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found',
      });
    }

    const session = await AttendanceSession.findOne({
      _id: req.params.sessionId,
      mentor: mentor._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Attendance session not found',
      });
    }

    if (session.status === 'finalized') {
      return res.status(400).json({
        success: false,
        message: 'Attendance session is already finalized',
      });
    }

    session.status = 'finalized';
    session.finalizedAt = new Date();
    session.finalizedBy = req.user.id;

    await session.save();

    res.json({
      success: true,
      message: 'Attendance session finalized successfully',
      session,
    });
  } catch (error) {
    console.error('Finalize session error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not finalize attendance session',
    });
  }
};
export const exportSessionAttendance = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      user: req.user.id,
      isActive: true,
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found',
      });
    }

    const session = await AttendanceSession.findOne({
      _id: req.params.sessionId,
      mentor: mentor._id,
    })
      .populate('class', 'className')
      .populate('subject', 'subjectName');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Attendance session not found',
      });
    }

    const records = await Attendance.find({
      session: session._id,
    }).populate({
      path: 'student',
      select: 'studentId',
      populate: {
        path: 'user',
        select: 'fullName',
      },
    });

    const escapeCSV = (value) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;

    const rows = [
      [
        'Roll Number',
        'Student Name',
        'Class',
        'Subject',
        'Date',
        'Status',
        'Check-in Time',
        'Reason',
      ],
      ...records.map((record) => [
        record.student?.studentId || '',
        record.student?.user?.fullName || '',
        session.class?.className || '',
        session.subject?.subjectName || 'General',
        new Date(session.createdAt).toLocaleDateString('en-IN'),
        record.status,
        record.checkedInAt
          ? new Date(record.checkedInAt).toLocaleString('en-IN')
          : '',
        record.reason || '',
      ]),
    ];

    const csv = rows
      .map((row) => row.map(escapeCSV).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="attendance-${session._id}.csv"`
    );

    res.send('\uFEFF' + csv);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not export attendance',
    });
  }
};
