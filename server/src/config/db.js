import mongoose from 'mongoose';

/**
 * Connect to MongoDB using Mongoose.
 *
 * Reads the connection string from process.env.MONGODB_URI.
 * Throws a clear error if the URI is missing or invalid so the
 * application never silently pretends the database is connected.
 *
 * @returns {Promise<void>}
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    const error = new Error(
      'MONGODB_URI is not set. Define it in server/.env (copy from server/.env.example). ' +
        'The server will not start without a valid MongoDB connection string.'
    );
    console.error(error.message);
    throw error;
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    // Never log the full URI — it may contain credentials.
    console.error('Failed to connect to MongoDB:', error.message);
    throw error;
  }
}

/**
 * Get the human-readable Mongoose connection state.
 *
 * Mongoose connection states:
 *  0 = disconnected
 *  1 = connected
 *  2 = connecting
 *  3 = disconnecting
 *
 * @returns {string} One of 'disconnected', 'connected', 'connecting', 'disconnecting', or 'unknown'.
 */
export function getDbState() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const state = mongoose.connection.readyState;
  return states[state] || 'unknown';
}

export default { connectDB, getDbState };