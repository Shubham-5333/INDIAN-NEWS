const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI ;
    
    // Attempt standard connection with 3-second timeout
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}). Starting MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`InMemory MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.error(`MongoDB Memory Server Error: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
