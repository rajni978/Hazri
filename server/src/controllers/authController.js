import User from '../models/User.js';
import Student from '../models/Student.js';
import jwt from 'jsonwebtoken';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**

 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const registerStudent = async (req, res) => {
  try {
    const { fullName, email, password, rollNumber } = req.body;

    if (!rollNumber || !String(rollNumber).trim()) {
  return res.status(400).json({
    success: false,
    message: 'Roll number is required',
  });
}


    // --- Required field validation ---
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

    if (password === undefined || password === null || String(password).trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'password is required',
      });
    }

    // --- Trim and normalize ---
    const trimmedFullName = String(fullName).trim();
    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedPassword = String(password);
    const normalizedRollNumber = String(rollNumber).trim().toUpperCase();

    // --- Email format validation ---
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // --- Password length validation ---
    if (trimmedPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    // --- Duplicate email check ---
    const existingUser = await User.findOne({ email: trimmedEmail }).lean();
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    // --- Create student account ---
    // role is hard-coded to 'student'. Any role/isActive sent by the client is ignored.
    const userData = {
      fullName: trimmedFullName,
      email: trimmedEmail,
      password: trimmedPassword,
      role: 'student',
       rollNumber: normalizedRollNumber,
    };

    const user = await User.create(userData);

    try {
      await Student.create({
        user: user._id,
        studentId: normalizedRollNumber,
        phone: '',
        isActive: true,
      });
    } catch (profileError) {
      await User.findByIdAndDelete(user._id);
      throw profileError;
    }

    // --- Response (password excluded via schema select: false + explicit pick) ---
    const userResponse = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      user: userResponse,
    });
  } catch (error) {
    // Duplicate key (email unique index) race condition fallback
        if (error && error.code === 11000) {
  if (error.keyPattern?.rollNumber) {
    return res.status(409).json({
      success: false,
      message: 'This roll number is already registered',
    });
  }

  if (error.keyPattern?.email) {
    return res.status(409).json({
      success: false,
      message: 'Email is already registered',
    });
  }
}

    // Never expose stack traces or sensitive database details to the client.
    console.error('Registration error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user and explicitly include the hidden password field
    const user = await User.findOne({
      email: String(email).trim().toLowerCase(),
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check whether the account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive',
      });
    }

    // Compare entered password with stored bcrypt hash
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        subject: user._id.toString(),
        expiresIn: '1d',
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

