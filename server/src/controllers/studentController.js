
import Student from '../models/Student.js';
import User from '../models/User.js';
import Class from '../models/Class.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function findStudentById(studentId) {
  return Student.findById(studentId)
    .populate('user', 'fullName email role isActive')
    .populate('class', 'className classCode academicYear description')
    .lean();
}

export const listStudents = async (req, res) => {
  try {
    const { q, class: classId, page = 1, limit = 50 } = req.query;
    const studentFilter = { isActive: true };

    if (classId) studentFilter.class = classId;

    const students = await Student.find(studentFilter)
      .populate('user', 'fullName email role isActive')
      .populate('class', 'className classCode academicYear')
      .sort({ createdAt: -1 })
      .lean();

    let results = students;

    if (q) {
      const query = String(q).trim().toLowerCase();

      results = results.filter(
        (s) =>
          (s.studentId && s.studentId.toLowerCase().includes(query)) ||
          (s.user && s.user.fullName &&
            s.user.fullName.toLowerCase().includes(query)) ||
          (s.user && s.user.email &&
            s.user.email.toLowerCase().includes(query))
      );
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 50, 1),
      100
    );

    const total = results.length;
    const data = results.slice(
      (pageNumber - 1) * limitNumber,
      pageNumber * limitNumber
    );

    return res.json({
      success: true,
      message: 'Students retrieved',
      data,
      meta: { total, page: pageNumber, limit: limitNumber },
    });
  } catch (error) {
    console.error('List students error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await findStudentById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    return res.json({
      success: true,
      message: 'Student details',
      data: student,
    });
  } catch (error) {
    console.error('Get student error:', error.message);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student id',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const createStudent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      studentId,
      phone,
      class: classId,
    } = req.body;

    if (!fullName || !String(fullName).trim()) {
      return res.status(400).json({
        success: false,
        message: 'fullName is required',
      });
    }

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: 'email is required',
      });
    }

    if (!password || String(password).trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    if (!studentId || !String(studentId).trim()) {
      return res.status(400).json({
        success: false,
        message: 'studentId is required',
      });
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const normalizedStudentId = String(studentId)
      .trim()
      .toUpperCase();

    const existingUser = await User.findOne({
      email: trimmedEmail,
    }).lean();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    const existingStudentId = await Student.findOne({
      studentId: normalizedStudentId,
    }).lean();

    if (existingStudentId) {
      return res.status(409).json({
        success: false,
        message: 'Student ID is already registered',
      });
    }

    if (classId) {
      const classDoc = await Class.findById(classId).lean();

      if (!classDoc) {
        return res.status(400).json({
          success: false,
          message: 'Invalid class id',
        });
      }
    }

    const user = await User.create({
      fullName: String(fullName).trim(),
      email: trimmedEmail,
      password: String(password),
      role: 'student',
      rollNumber: normalizedStudentId,
      isActive: true,
    });

    const student = await Student.create({
      user: user._id,
      studentId: normalizedStudentId,
      phone: phone ? String(phone).trim() : '',
      class: classId || null,
      isActive: true,
    });

    const populated = await findStudentById(student._id);

    return res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: populated,
    });
  } catch (error) {
    console.error('Create student error:', error.message);

    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email or student ID already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const {
      fullName,
      email,
      phone,
      class: classId,
      studentId,
      isActive,
      password,
    } = req.body;

    const user = await User.findById(student.user).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student user account not found',
      });
    }

    if (studentId !== undefined) {
      const normalizedStudentId = String(studentId).trim().toUpperCase();

      if (!normalizedStudentId) {
        return res.status(400).json({
          success: false,
          message: 'Student ID cannot be empty',
        });
      }

      if (normalizedStudentId !== student.studentId) {
        const exists = await Student.findOne({
          studentId: normalizedStudentId,
          _id: { $ne: student._id },
        }).lean();

        if (exists) {
          return res.status(409).json({
            success: false,
            message: 'Student ID is already registered',
          });
        }

        student.studentId = normalizedStudentId;
        user.rollNumber = normalizedStudentId;
      }
    }

    if (phone !== undefined) {
      student.phone = String(phone).trim();
    }

    if (classId !== undefined) {
      if (classId) {
        const classDoc = await Class.findById(classId).lean();

        if (!classDoc) {
          return res.status(400).json({
            success: false,
            message: 'Invalid class id',
          });
        }
      }

      student.class = classId || null;
    }

    if (isActive !== undefined) {
      const activeStatus =
        isActive === true ||
        isActive === 'true' ||
        isActive === 1 ||
        isActive === '1';

      student.isActive = activeStatus;
      user.isActive = activeStatus;
    }

    if (fullName !== undefined) {
      if (!String(fullName).trim()) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty',
        });
      }

      user.fullName = String(fullName).trim();
    }

    if (email !== undefined) {
      const trimmedEmail = String(email).trim().toLowerCase();

      if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
      }

      const emailOwner = await User.findOne({
        email: trimmedEmail,
      }).lean();

      if (
        emailOwner &&
        emailOwner._id.toString() !== student.user.toString()
      ) {
        return res.status(409).json({
          success: false,
          message: 'Email is already registered',
        });
      }

      user.email = trimmedEmail;
    }

    if (password !== undefined && String(password) !== '') {
      if (String(password).trim().length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long',
        });
      }

      user.password = String(password);
    }

    await student.save();
    await user.save();

    const populated = await findStudentById(student._id);

    return res.json({
      success: true,
      message: 'Student updated successfully',
      data: populated,
    });
  } catch (error) {
    console.error('Update student error:', error.message);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student id',
      });
    }

    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email or student ID already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    student.isActive = false;
    await student.save();

    await User.findByIdAndUpdate(student.user, {
      isActive: false,
    });

    return res.json({
      success: true,
      message: 'Student deactivated',
    });
  } catch (error) {
    console.error('Delete student error:', error.message);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student id',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
