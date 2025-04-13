import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
    console.log("MongoDB connected in admin-login");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

// Serverless handler - direct approach without Express
export default async function handler(req, res) {
  console.log("Admin login handler invoked:", req.method, req.url);
  
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight in admin-login");
    res.status(200).end();
    return;
  }
  
  // Only proceed with POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Connect to database
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return res.status(500).json({ 
      message: "Database connection failed", 
      error: error.message 
    });
  }
  
  // Parse body for POST request
  const { username, password } = req.body;
  console.log("Login attempt for:", username);
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  try {
    // Find admin
    const existingAdmin = await Admin.findOne({ username });
    
    if (!existingAdmin) {
      console.log("Admin not found:", username);
      return res.status(404).json({ message: "Admin doesn't exist" });
    }
    
    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    
    if (!isPasswordCorrect) {
      console.log("Invalid password for:", username);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Generate token
    const token = jwt.sign(
      {
        username: existingAdmin.username,
        id: existingAdmin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    console.log("Admin login successful:", username);
    return res.status(200).json({
      result: existingAdmin,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      message: "Something went wrong", 
      error: error.message 
    });
  }
}