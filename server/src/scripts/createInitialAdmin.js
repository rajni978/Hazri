
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

async function createInitialAdmin() {
  try {
    const { MONGODB_URI, INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD } = process.env;

    if (!MONGODB_URI || !INITIAL_ADMIN_NAME || !INITIAL_ADMIN_EMAIL || !INITIAL_ADMIN_PASSWORD) {
      throw new Error('Missing initial admin configuration in .env');
    }

    if (INITIAL_ADMIN_PASSWORD.length < 8) {
      throw new Error('Admin password must be at least 8 characters');
    }

    await mongoose.connect(MONGODB_URI);

    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('An admin account already exists. No new account created.');
      return;
    }

    const admin = await User.create({
      fullName: INITIAL_ADMIN_NAME.trim(),
      email: INITIAL_ADMIN_EMAIL.trim().toLowerCase(),
      password: INITIAL_ADMIN_PASSWORD,
      role: 'admin',
      isActive: true,
    });

    console.log('Initial admin created successfully!');
    console.log('Name:', admin.fullName);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
  } catch (error) {
    console.error('Admin setup failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

createInitialAdmin();
