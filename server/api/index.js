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

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,  // Disable CSP for simplicity in Vercel environment
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? [
        "https://college-erp-e3je.vercel.app", 
        "https://sgrru-erp.vercel.app",
        process.env.FRONTEND_URL
      ].filter(Boolean)
    : "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
app.use(cors(corsOptions));

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

// API routes
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to SGRRU-ERP API");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is healthy" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Internal server error", 
    error: process.env.NODE_ENV === "development" ? err.message : undefined 
  });
});

// Export the serverless function handler
export default async function handler(req, res) {
  // Connect to database
  try {
    await connectToDatabase();
  } catch (error) {
    return res.status(500).json({ message: "Database connection failed", error: error.message });
  }
  
  // Pass the request to the Express app
  return app(req, res);
} 