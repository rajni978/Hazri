import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';



const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'fullName is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'mentor', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      required: [true, 'role is required'],
      default: 'student',
    },
    rollNumber: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash the password before saving, but only when it is new or modified.
 * This keeps existing hashes intact on updates that do not touch the password.
 * Note: this hook is promise-based (no `next` callback) because Mongoose 9
 * awaits the returned promise instead of invoking a callback.
 */
userSchema.pre('save', async function hashPasswordBeforeSave() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare a plain-text candidate password against the stored hash.
 * Intended for future login functionality.
 *
 * @param {string} candidatePassword - Plain-text password to verify.
 * @returns {Promise<boolean>} true if the password matches, false otherwise.
 */
userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword
) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index(
  { rollNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      role: 'student',
      rollNumber: { $type: 'string' },
    },
  }
);

const User = mongoose.model('User', userSchema);

export default User;
