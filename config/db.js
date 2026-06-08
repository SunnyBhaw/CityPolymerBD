import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  uri: process.env.DATABASE_URL || 'mongodb://localhost:27017/citypolymerbd',
};

export async function connectDb() {
  try {
    await mongoose.connect(dbConfig.uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export default dbConfig;
