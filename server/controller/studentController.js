import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Department from "../models/department.js";
import Test from "../models/test.js";
import Marks from "../models/marks.js";
import Attendance from "../models/attendance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const studentLogin = async (req, res) => {
  const { username, password } = req.body;
  const errors = { usernameError: "", passwordError: "" };
  
  try {
    // Find student by username
    const existingStudent = await Student.findOne({ username });
    if (!existingStudent) {
      errors.usernameError = "Student doesn't exist.";
      return res.status(404).json(errors);
    }
    
    // Check if student account is active
    if (existingStudent.status === 'pending') {
      errors.usernameError = "Your account is pending approval by the administrator.";
      return res.status(403).json(errors);
    }
    
    if (existingStudent.status === 'inactive') {
      errors.usernameError = "Your account has been deactivated. Please contact the administrator.";
      return res.status(403).json(errors);
    }
    
    // Verify password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingStudent.password
    );
    
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid credentials";
      return res.status(401).json(errors);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: existingStudent.email,
        id: existingStudent._id,
        role: "student"
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return student data and token
    res.status(200).json({
      result: {
        _id: existingStudent._id,
        name: existingStudent.name,
        email: existingStudent.email,
        username: existingStudent.username,
        department: existingStudent.department,
        year: existingStudent.year,
        section: existingStudent.section,
        passwordUpdated: existingStudent.passwordUpdated,
        role: "student"
      },
      token
    });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: String };
    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        "Your password and confirmation password do not match";
      return res.status(400).json(errors);
    }

    const student = await Student.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();
    if (student.passwordUpdated === false) {
      student.passwordUpdated = true;
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: student,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      batch,
      section,
      year,
      fatherName,
      motherName,
      fatherContactNumber,
    } = req.body;
    const updatedStudent = await Student.findOne({ email });
    if (name) {
      updatedStudent.name = name;
      await updatedStudent.save();
    }
    if (dob) {
      updatedStudent.dob = dob;
      await updatedStudent.save();
    }
    if (department) {
      updatedStudent.department = department;
      await updatedStudent.save();
    }
    if (contactNumber) {
      updatedStudent.contactNumber = contactNumber;
      await updatedStudent.save();
    }
    if (batch) {
      updatedStudent.batch = batch;
      await updatedStudent.save();
    }
    if (section) {
      updatedStudent.section = section;
      await updatedStudent.save();
    }
    if (year) {
      updatedStudent.year = year;
      await updatedStudent.save();
    }
    if (motherName) {
      updatedStudent.motherName = motherName;
      await updatedStudent.save();
    }
    if (fatherName) {
      updatedStudent.fatherName = fatherName;
      await updatedStudent.save();
    }
    if (fatherContactNumber) {
      updatedStudent.fatherContactNumber = fatherContactNumber;
      await updatedStudent.save();
    }
    if (avatar) {
      updatedStudent.avatar = avatar;
      await updatedStudent.save();
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const testResult = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { notestError: String };
    const student = await Student.findOne({ department, year, section });
    const test = await Test.find({ department, year, section });
    if (test.length === 0) {
      errors.notestError = "No Test Found";
      return res.status(404).json(errors);
    }
    var result = [];
    for (var i = 0; i < test.length; i++) {
      var subjectCode = test[i].subjectCode;
      var subject = await Subject.findOne({ subjectCode });
      var marks = await Marks.findOne({
        student: student._id,
        exam: test[i]._id,
      });
      if (marks) {
        var temp = {
          marks: marks.marks,
          totalMarks: test[i].totalMarks,
          subjectName: subject.subjectName,
          subjectCode,
          test: test[i].test,
        };

        result.push(temp);
      }
    }

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const attendance = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { notestError: String };
    const student = await Student.findOne({ department, year, section });

    const attendence = await Attendance.find({
      student: student._id,
    }).populate("subject");
    if (!attendence) {
      res.status(400).json({ message: "Attendence not found" });
    }

    res.status(200).json({
      result: attendence.map((att) => {
        let res = {};
        res.percentage = (
          (att.lectureAttended / att.totalLecturesByFaculty) *
          100
        ).toFixed(2);
        res.subjectCode = att.subject.subjectCode;
        res.subjectName = att.subject.subjectName;
        res.attended = att.lectureAttended;
        res.total = att.totalLecturesByFaculty;
        return res;
      }),
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Handles new student registration requests
 * Creates student record with pending status for admin approval
 * @param {Object} req - Request object with student registration data
 * @param {Object} res - Response object
 * @returns {Object} Response with registration status
 */
export const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contactNumber,
      dob,
      department,
      year,
      section,
      avatar
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !contactNumber || !dob || !department || !year || !section) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ emailError: "Invalid email format" });
    }
    
    // Check if email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ emailError: "A student with this email already exists" });
    }

    // Check if the department exists
    const existingDepartment = await Department.findOne({ department });
    if (!existingDepartment) {
      return res.status(400).json({ message: "Department not found" });
    }

    // Generate username
    const departmentCode = existingDepartment.departmentCode;
    const students = await Student.find({ department });
    
    let studentCount;
    if (students.length < 10) {
      studentCount = "00" + students.length.toString();
    } else if (students.length < 100 && students.length > 9) {
      studentCount = "0" + students.length.toString();
    } else {
      studentCount = students.length.toString();
    }
    
    const currentYear = new Date().getFullYear();
    const username = ["STU", currentYear, departmentCode, studentCount].join("");
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new student with pending approval status
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      username,
      contactNumber,
      dob,
      department,
      year,
      section,
      avatar: avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=random",
      passwordUpdated: true,
      status: "pending" // Pending approval by admin
    });
    
    await newStudent.save();
    
    // Return success without sensitive data
    res.status(201).json({
      success: true,
      message: "Registration successful. Your account is pending approval by the administrator.",
      student: {
        name: newStudent.name,
        email: newStudent.email,
        username: newStudent.username,
        status: newStudent.status
      }
    });
  } catch (error) {
    console.error("Student registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};
