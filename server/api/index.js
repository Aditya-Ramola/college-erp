import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from './auth-middleware.js';

// Load environment variables
dotenv.config();

// MongoDB Models (defined inline for Vercel serverless)
let Admin, Student, Faculty, Subject, Department, Test, Notice;

// Initialize MongoDB models
const initModels = () => {
  try {
    // Try to get existing models first
    Admin = mongoose.models.Admin || mongoose.model('Admin');
    Student = mongoose.models.Student || mongoose.model('Student');
    Faculty = mongoose.models.Faculty || mongoose.model('Faculty');
    Subject = mongoose.models.Subject || mongoose.model('Subject');
    Department = mongoose.models.Department || mongoose.model('Department');
    Test = mongoose.models.Test || mongoose.model('Test');
    Notice = mongoose.models.Notice || mongoose.model('Notice');
  } catch (error) {
    console.log("Defining MongoDB models");
    
    // Admin Schema
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

    // Department Schema
    const departmentSchema = new mongoose.Schema({
      department: {
        type: String,
        required: true,
        unique: true,
      },
    });
    Department = mongoose.model('Department', departmentSchema);

    // Faculty Schema
    const facultySchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
      },
      department: {
        type: String,
        required: true,
      },
      designation: {
        type: String,
        required: true,
      },
      dob: {
        type: String,
        required: true,
      },
      joiningYear: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      contactNumber: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
      passwordUpdated: {
        type: Boolean,
        default: false,
      },
    });
    Faculty = mongoose.model('Faculty', facultySchema);

    // Student Schema
    const studentSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
      },
      department: {
        type: String,
        required: true,
      },
      year: {
        type: String,
        required: true,
      },
      section: {
        type: String,
        required: true,
      },
      batch: {
        type: String,
        required: true,
      },
      dob: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      contactNumber: {
        type: String,
        required: true,
      },
      fatherName: {
        type: String,
        required: true,
      },
      motherName: {
        type: String,
        required: true,
      },
      fatherContactNumber: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
      passwordUpdated: {
        type: Boolean,
        default: false,
      },
    });
    Student = mongoose.model('Student', studentSchema);

    // Subject Schema
    const subjectSchema = new mongoose.Schema({
      department: {
        type: String,
        required: true,
      },
      subjectCode: {
        type: String,
        required: true,
      },
      subjectName: {
        type: String,
        required: true,
      },
      totalLectures: {
        type: Number,
        required: true,
      },
      year: {
        type: String,
        required: true,
      },
      attendancePercentage: {
        type: Number,
        default: 0,
      },
    });
    Subject = mongoose.model('Subject', subjectSchema);

    // Test Schema
    const testSchema = new mongoose.Schema({
      department: {
        type: String,
        required: true,
      },
      year: {
        type: String,
        required: true,
      },
      section: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      marks: [
        {
          student: {
            type: String,
          },
          marks: {
            type: Number,
          },
        },
      ],
      test: {
        type: String,
        required: true,
      },
      totalMarks: {
        type: Number,
        required: true,
      },
      teacher: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
    });
    Test = mongoose.model('Test', testSchema);

    // Notice Schema
    const noticeSchema = new mongoose.Schema({
      from: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      topic: {
        type: String,
        required: true,
      },
    });
    Notice = mongoose.model('Notice', noticeSchema);
  }
};

// Create Express app
const app = express();

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Security middleware with reduced restrictions for Vercel
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
  xssFilter: true
}));

// Define allowed origins
const allowedOrigins = [
  'https://college-erp-4dle.vercel.app',
  'https://college-erp-flame.vercel.app',
  'http://localhost:3000'
];

// CORS setup - simplified direct approach
app.use((req, res, next) => {
  // Set CORS headers for all responses
  res.header('Access-Control-Allow-Origin', 'https://college-erp-4dle.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    // For OPTIONS requests, just send the headers and return
    return res.status(204).end();
  }
  
  next();
});

// Body parsing middleware - BEFORE route handlers
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// Connect to MongoDB
let isConnected = false;
const createTestAdmin = async () => {
  try {
    // Check if admin with username 'admin' exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      console.log("Creating test admin account");
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('Admin@123456', 12);
      
      // Create the admin
      const newAdmin = new Admin({
        name: 'Admin',
        email: 'admin@test.com',
        username: 'admin',
        password: hashedPassword,
        passwordUpdated: true
      });
      
      await newAdmin.save();
      console.log("Test admin account created successfully");
    } else {
      console.log("Test admin account already exists");
    }
  } catch (error) {
    console.error("Error creating test admin:", error);
  }
};

// Function to create initial department if none exists
const createInitialDepartment = async () => {
  try {
    // Check if any departments exist
    const departmentCount = await Department.countDocuments();
    
    if (departmentCount === 0) {
      console.log("Creating initial department...");
      
      // Create Computer Science department
      const newDepartment = new Department({
        department: "Computer Science"
      });
      
      await newDepartment.save();
      console.log("Initial department created successfully");
    } else {
      console.log(`${departmentCount} departments exist in the database`);
    }
  } catch (error) {
    console.error("Error creating initial department:", error);
  }
};

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
    console.log("MongoDB connected");
    
    // Initialize models
    initModels();
    
    // Create test admin if needed
    await createTestAdmin();
    
    // Create initial department if needed
    await createInitialDepartment();
    
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

// Debug route for checking connectivity
app.get("/api/debug", async (req, res) => {
  try {
    // Find admin with username 'admin'
    const admin = await Admin.findOne({ username: 'admin' });
    
    return res.status(200).json({ 
      message: 'Debug endpoint working',
      dbConnected: isConnected,
      adminExists: !!admin,
      adminDetails: admin ? {
        username: admin.username,
        passwordUpdated: admin.passwordUpdated,
      } : null
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error in debug endpoint', 
      error: error.message 
    });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to SGRRU-ERP API");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is healthy" });
});

// Admin login route - directly defined here for Vercel
app.post("/api/admin/login", async (req, res) => {
  try {
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
    
    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordCorrect) {
      console.log(`Invalid password for: ${username}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Generate token
    const token = jwt.sign(
      {
        username: admin.username,
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    console.log(`Login successful for: ${username}`);
    return res.status(200).json({
      result: admin,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      message: "Something went wrong", 
      error: error.message 
    });
  }
});

// Faculty login - route directly defined for Vercel
app.post("/api/faculty/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    console.log(`Faculty login attempt for: ${username}`);
    
    // Find faculty
    const faculty = await Faculty.findOne({ username });
    
    if (!faculty) {
      console.log(`Faculty not found: ${username}`);
      return res.status(404).json({ message: "Faculty doesn't exist" });
    }
    
    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, faculty.password);
    
    if (!isPasswordCorrect) {
      console.log(`Invalid password for faculty: ${username}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Generate token
    const token = jwt.sign(
      {
        username: faculty.username,
        id: faculty._id,
        role: "faculty",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    console.log(`Faculty login successful for: ${username}`);
    return res.status(200).json({
      result: faculty,
      token,
    });
  } catch (error) {
    console.error("Faculty login error:", error);
    return res.status(500).json({ 
      message: "Something went wrong", 
      error: error.message 
    });
  }
});

// Student login - route directly defined for Vercel
app.post("/api/student/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    console.log(`Student login attempt for: ${username}`);
    
    // Find student
    const student = await Student.findOne({ username });
    
    if (!student) {
      console.log(`Student not found: ${username}`);
      return res.status(404).json({ message: "Student doesn't exist" });
    }
    
    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, student.password);
    
    if (!isPasswordCorrect) {
      console.log(`Invalid password for student: ${username}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Generate token
    const token = jwt.sign(
      {
        username: student.username,
        id: student._id,
        role: "student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    console.log(`Student login successful for: ${username}`);
    return res.status(200).json({
      result: student,
      token,
    });
  } catch (error) {
    console.error("Student login error:", error);
    return res.status(500).json({ 
      message: "Something went wrong", 
      error: error.message 
    });
  }
});

// Add password update route for admin
app.post("/api/admin/updatepassword", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find the admin
    const admin = await Admin.findById(req.userId);
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    // Check if current password is correct
    const isPasswordCorrect = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    admin.password = hashedPassword;
    admin.passwordUpdated = true;
    
    await admin.save();
    
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// 404 handler
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    message: "Route not found",
    path: req.url,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err.stack);
  res.status(500).json({ 
    message: "Internal server error", 
    error: process.env.NODE_ENV === "development" ? err.message : "Server error"
  });
});

// Export the serverless function handler
export default async function handler(req, res) {
  console.log(`Serverless function invoked: ${req.method} ${req.url}`);
  
  // Set CORS headers first - before anything else
  // This ensures headers are set even if errors occur later
  res.setHeader('Access-Control-Allow-Origin', 'https://college-erp-4dle.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Handle OPTIONS method for preflight requests immediately
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request directly in handler");
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