const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_student_manager';
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}...`);
    
    // Connect with a 3 second timeout so the app won't hang if Mongo isn't running locally
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    
    isMongoConnected = true;
    console.log(` MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`\n[DATABASE NOTICE] MongoDB connection attempt failed: ${error.message}`);
    console.warn(`[DATABASE NOTICE] Activating Dual-Mode persistent local JSON storage.`);
    console.warn(`[DATABASE NOTICE] The application is FULLY functional (CRUD, Auth, Reports, Budgets).`);
    console.warn(`[DATABASE NOTICE] To use real MongoDB / Atlas, update MONGO_URI in server/.env and restart.\n`);
  }
};

const isUsingMongo = () => isMongoConnected && mongoose.connection.readyState === 1;

module.exports = { connectDB, isUsingMongo };
