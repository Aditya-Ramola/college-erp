import express from "express";
import {
  studentLogin,
  updatedPassword,
  updateStudent,
  testResult,
  attendance,
  registerStudent
} from "../controller/studentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes (no auth required)
router.post("/login", studentLogin);
router.post("/register", registerStudent);

// Protected routes (auth required)
router.post("/updatepassword", auth, updatedPassword);
router.post("/updateprofile", auth, updateStudent);
router.post("/testresult", auth, testResult);
router.post("/attendance", auth, attendance);

export default router;
