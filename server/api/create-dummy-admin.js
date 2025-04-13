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
    console.log("MongoDB connected in create-dummy-admin");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

// Create admin function
const createDummyAdmin = async () => {
  try {
    const username = "ADMDUMMY";
    const existingAdmin = await Admin.findOne({ username });
    
    if (existingAdmin) {
      console.log("Admin ADMDUMMY already exists");
      return existingAdmin;
    }
    
    // Create new admin
    const hashedPassword = await bcrypt.hash("123", 12);
    const newAdmin = await Admin.create({
      name: "Dummy Admin",
      email: "admin@test.com",
      password: hashedPassword,
      username,
      passwordUpdated: true,
    });
    
    console.log("Dummy Admin created with ID:", newAdmin._id);
    return newAdmin;
  } catch (error) {
    console.error("Error creating dummy admin:", error.message);
    throw error;
  }
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests for security
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Connect to database
    await connectToDatabase();
    
    // Create dummy admin
    const admin = await createDummyAdmin();
    
    // Return success
    return res.status(200).json({
      message: 'Dummy admin created or already exists',
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name
      }
    });
  } catch (error) {
    console.error("Create dummy admin error:", error);
    return res.status(500).json({ 
      message: "Failed to create dummy admin", 
      error: error.message 
    });
  }
} 