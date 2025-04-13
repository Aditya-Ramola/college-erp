import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Get Admin model 
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

// Load environment variables
dotenv.config();

// Setup Express
const app = express();

// Direct CORS handling for preflight OPTIONS request
app.options("*", (req, res) => {
  console.log("Handling OPTIONS preflight in admin-login");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  res.status(204).end();
});

// Express middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  next();
});

// CORS middleware
app.use(cors({
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Body parsing middleware
app.use(bodyParser.json());

// Connect to MongoDB
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  
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

// Login handler
const adminLogin = async (req, res) => {
  console.log("Admin login request received:", req.body);
  
  const { username, password } = req.body;
  
  try {
    const existingAdmin = await Admin.findOne({ username });
    
    if (!existingAdmin) {
      console.log("Admin not found:", username);
      return res.status(404).json({ message: "Admin doesn't exist" });
    }
    
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    
    if (!isPasswordCorrect) {
      console.log("Invalid password for:", username);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
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
    res.status(200).json({
      result: existingAdmin,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Routes
app.post("/api/admin/login", adminLogin);

// Export the serverless handler
export default async function handler(req, res) {
  console.log("Admin login handler invoked:", req.method, req.url, req.headers.origin);
  
  // Handle CORS preflight request directly
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request at serverless level");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    return res.status(204).end();
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
  
  // Pass the request to the Express app
  return app(req, res);
}