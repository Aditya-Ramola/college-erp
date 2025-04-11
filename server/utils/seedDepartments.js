import mongoose from 'mongoose';
import Department from '../models/department.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_URL)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Define departments to add
    const departments = [
      { department: 'Computer Science', departmentCode: 'CS' },
      { department: 'Electronics', departmentCode: 'EC' },
      { department: 'Mechanical', departmentCode: 'ME' },
      { department: 'Civil', departmentCode: 'CE' },
      { department: 'Electrical', departmentCode: 'EE' },
      { department: 'Information Technology', departmentCode: 'IT' }
    ];
    
    try {
      // Delete existing departments
      await Department.deleteMany({});
      console.log('Cleared existing departments');
      
      // Add departments
      await Department.insertMany(departments);
      console.log('Added departments successfully');
    } catch (error) {
      console.error('Error seeding departments:', error);
    } finally {
      // Disconnect from MongoDB
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  }); 