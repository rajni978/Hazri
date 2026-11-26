import mongoose from 'mongoose';

const attendanceSessionSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor',
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'finalized'],
      default: 'active',
    },

    finalizedAt: {
  type: Date,
  default: null,
},
finalizedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null,
},
  },
  { timestamps: true }
);

attendanceSessionSchema.index({ expiresAt: 1 });

export default mongoose.model('AttendanceSession', attendanceSessionSchema);
