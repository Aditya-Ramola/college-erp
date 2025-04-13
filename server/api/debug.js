import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

// Setup Admin model
let Admin;
try {
  Admin = mongoose.model('Admin');
} catch {
  // If model doesn't exist yet, create it
  const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    username: {
      type: String,
      required: true,
      unique: true,
    },
    passwordUpdated: {
      type: Boolean,
      default: false,
    },
  });
  Admin = mongoose.model('Admin', adminSchema);
}

// Connect to MongoDB
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected in debug endpoint");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

// Simple debug handler for CORS testing
export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  // For GET requests, just return a simple status
  if (req.method === 'GET') {
    try {
      // Try to connect to the database
      await connectToDatabase();
      
      // Check if admin with username 'admin' exists
      const admin = await Admin.findOne({ username: 'admin' });
      
      return res.status(200).json({ 
        message: 'Debug endpoint working',
        dbConnected: isConnected,
        adminExists: !!admin,
        adminDetails: admin ? {
          username: admin.username,
          passwordUpdated: admin.passwordUpdated,
          // Don't return sensitive info
        } : null
      });
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error in debug endpoint', 
        error: error.message 
      });
    }
  }
  
  // For POST requests, check credentials
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      
      // Connect to database
      await connectToDatabase();
      
      // Find admin
      const admin = await Admin.findOne({ username });
      
      if (!admin) {
        return res.status(404).json({ 
          message: "Admin doesn't exist",
          usernameProvided: username 
        });
      }
      
      // Check password
      const isPasswordCorrect = await bcrypt.compare(password, admin.password);
      
      return res.status(200).json({
        usernameFound: true,
        passwordCorrect: isPasswordCorrect
      });
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error checking credentials', 
        error: error.message 
      });
    }
  }
  
  // Default response for other methods
  return res.status(405).json({ message: 'Method not allowed' });
} 