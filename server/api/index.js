import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import adminRoutes from "../routes/adminRoutes.js";
import studentRoutes from "../routes/studentRoutes.js";
import facultyRoutes from "../routes/facultyRoutes.js";
import { addDummyAdmin } from "../controller/adminController.js";

// Load environment variables
dotenv.config();

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

// CORS setup - configured to be permissive for development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Handle OPTIONS requests explicitly
app.options('*', (req, res) => {
  console.log("Handling OPTIONS request");
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
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
    
    // Add dummy admin in development mode
    if (process.env.NODE_ENV === "development") {
      await addDummyAdmin();
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to SGRRU-ERP API");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is healthy" });
});

// Debug route to check request handling
app.post("/api/debug", (req, res) => {
  res.status(200).json({ 
    message: "Debug endpoint reached successfully", 
    body: req.body,
    headers: req.headers
  });
});

// API routes - must come after middleware setup
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);

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