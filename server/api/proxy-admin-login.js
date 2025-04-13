import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

// Mongoose models
let Admin;
try {
  Admin = mongoose.model('Admin');
} catch {
  // Define schema if model doesn't exist
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

// Database connection
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

export default async function handler(req, res) {
  // Explicitly set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only proceed with POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to database
    await connectToDatabase();
    
    // Extract credentials
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    console.log(`Login attempt for: ${username}`);
    
    // Find admin
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      console.log(`Admin not found: ${username}`);
      return res.status(404).json({ message: "Admin doesn't exist" });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      console.log(`Invalid password for: ${username}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        username: admin.username,
        id: admin._id,
        role: 'admin',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log(`Login successful for: ${username}`);
    
    // Send response
    return res.status(200).json({
      result: admin,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
} 