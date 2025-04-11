import React from "react";
import { Routes, Route } from "react-router-dom";
import AddAdmin from "./components/admin/addAdmin/AddAdmin";
import AddDepartment from "./components/admin/addDepartment/AddDepartment";
import AddFaculty from "./components/admin/addFaculty/AddFaculty";
import AddStudent from "./components/admin/addStudent/AddStudent";
import AddSubject from "./components/admin/addSubject/AddSubject";
import AdminHome from "./components/admin/AdminHome";

import GetFaculty from "./components/admin/getFaculty/GetFaculty";
import GetStudent from "./components/admin/getStudent/GetStudent";
import GetSubject from "./components/admin/getSubject/GetSubject";
import AdminProfile from "./components/admin/profile/Profile";
import AdminFirstTimePassword from "./components/admin/profile/update/firstTimePassword/FirstTimePassword";
import AdminPassword from "./components/admin/profile/update/password/Password";

import AdminUpdate from "./components/admin/profile/update/Update";
import CreateTest from "./components/faculty/createTest/CreateTest";
import FacultyHome from "./components/faculty/FacultyHome";
import MarkAttendance from "./components/faculty/markAttendance/MarkAttendance";
import FacultyProfile from "./components/faculty/profile/Profile";
import FacultyFirstTimePassword from "./components/faculty/profile/update/firstTimePassword/FirstTimePassword";
import FacultyPassword from "./components/faculty/profile/update/password/Password";
import FacultyUpdate from "./components/faculty/profile/update/Update";
import UploadMarks from "./components/faculty/uploadMarks/UploadMarks";
import AdminLogin from "./components/login/adminLogin/AdminLogin";
import FacultyLogin from "./components/login/facultyLogin/FacultyLogin";
import Login from "./components/login/Login";
import SignUp from "./components/login/SignUp";

import StudentLogin from "./components/login/studentLogin/StudentLogin";
import StudentFirstTimePassword from "./components/student/profile/update/firstTimePassword/FirstTimePassword";
import StudentHome from "./components/student/StudentHome";
import StudentProfile from "./components/student/profile/Profile";
import StudentUpdate from "./components/student/profile/update/Update";
import StudentPassword from "./components/student/profile/update/password/Password";
import SubjectList from "./components/student/subjectList/SubjectList";
import TestResult from "./components/student/testResult/TestResult";
import Attendance from "./components/student/attendance/Attendance";
import DeleteAdmin from "./components/admin/deleteAdmin/DeleteAdmin";
import DeleteDepartment from "./components/admin/deleteDepartment/DeleteDepartment";
import DeleteFaculty from "./components/admin/deleteFaculty/DeleteFaculty";
import DeleteStudent from "./components/admin/deleteStudent/DeleteStudent";
import DeleteSubject from "./components/admin/deleteSubject/DeleteSubject";
import CreateNotice from "./components/admin/createNotice/CreateNotice";
import PendingRegistrations from "./components/admin/pendingRegistrations/PendingRegistrations";
import GetAdmin from "./components/admin/getAdmin/GetAdmin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import route wrappers
import ProtectedRoute from "./utils/ProtectedRoute";
import PublicRoute from "./utils/PublicRoute";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
        
        {/* Login Routes - restricted means they redirect to dashboard if logged in */}
        <Route path="/login/adminlogin" element={<PublicRoute restricted><AdminLogin /></PublicRoute>} />
        <Route path="/login/facultylogin" element={<PublicRoute restricted><FacultyLogin /></PublicRoute>} />
        <Route path="/login/studentlogin" element={<PublicRoute restricted><StudentLogin /></PublicRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/home" element={<ProtectedRoute userType="admin"><AdminHome /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute userType="admin"><AdminProfile /></ProtectedRoute>} />
        <Route path="/admin/update" element={<ProtectedRoute userType="admin"><AdminUpdate /></ProtectedRoute>} />
        <Route path="/admin/update/password" element={<ProtectedRoute userType="admin"><AdminPassword /></ProtectedRoute>} />
        <Route path="/admin/updatepassword" element={<ProtectedRoute userType="admin"><AdminFirstTimePassword /></ProtectedRoute>} />
        <Route path="/admin/createnotice" element={<ProtectedRoute userType="admin"><CreateNotice /></ProtectedRoute>} />
        <Route path="/admin/addadmin" element={<ProtectedRoute userType="admin"><AddAdmin /></ProtectedRoute>} />
        <Route path="/admin/deleteadmin" element={<ProtectedRoute userType="admin"><DeleteAdmin /></ProtectedRoute>} />
        <Route path="/admin/adddepartment" element={<ProtectedRoute userType="admin"><AddDepartment /></ProtectedRoute>} />
        <Route path="/admin/deletedepartment" element={<ProtectedRoute userType="admin"><DeleteDepartment /></ProtectedRoute>} />
        <Route path="/admin/addfaculty" element={<ProtectedRoute userType="admin"><AddFaculty /></ProtectedRoute>} />
        <Route path="/admin/deletefaculty" element={<ProtectedRoute userType="admin"><DeleteFaculty /></ProtectedRoute>} />
        <Route path="/admin/deletestudent" element={<ProtectedRoute userType="admin"><DeleteStudent /></ProtectedRoute>} />
        <Route path="/admin/deletesubject" element={<ProtectedRoute userType="admin"><DeleteSubject /></ProtectedRoute>} />
        <Route path="/admin/allfaculty" element={<ProtectedRoute userType="admin"><GetFaculty /></ProtectedRoute>} />
        <Route path="/admin/alladmin" element={<ProtectedRoute userType="admin"><GetAdmin /></ProtectedRoute>} />
        <Route path="/admin/addstudent" element={<ProtectedRoute userType="admin"><AddStudent /></ProtectedRoute>} />
        <Route path="/admin/addsubject" element={<ProtectedRoute userType="admin"><AddSubject /></ProtectedRoute>} />
        <Route path="/admin/allsubject" element={<ProtectedRoute userType="admin"><GetSubject /></ProtectedRoute>} />
        <Route path="/admin/allstudent" element={<ProtectedRoute userType="admin"><GetStudent /></ProtectedRoute>} />
        <Route path="/admin/pendingregistrations" element={<ProtectedRoute userType="admin"><PendingRegistrations /></ProtectedRoute>} />

        {/* Faculty Routes */}
        <Route path="/faculty/home" element={<ProtectedRoute userType="faculty"><FacultyHome /></ProtectedRoute>} />
        <Route path="/faculty/password" element={<ProtectedRoute userType="faculty"><FacultyFirstTimePassword /></ProtectedRoute>} />
        <Route path="/faculty/profile" element={<ProtectedRoute userType="faculty"><FacultyProfile /></ProtectedRoute>} />
        <Route path="/faculty/update" element={<ProtectedRoute userType="faculty"><FacultyUpdate /></ProtectedRoute>} />
        <Route path="/faculty/update/password" element={<ProtectedRoute userType="faculty"><FacultyPassword /></ProtectedRoute>} />
        <Route path="/faculty/createtest" element={<ProtectedRoute userType="faculty"><CreateTest /></ProtectedRoute>} />
        <Route path="/faculty/uploadmarks" element={<ProtectedRoute userType="faculty"><UploadMarks /></ProtectedRoute>} />
        <Route path="/faculty/markattendance" element={<ProtectedRoute userType="faculty"><MarkAttendance /></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="/student/home" element={<ProtectedRoute userType="student"><StudentHome /></ProtectedRoute>} />
        <Route path="/student/password" element={<ProtectedRoute userType="student"><StudentFirstTimePassword /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute userType="student"><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/update" element={<ProtectedRoute userType="student"><StudentUpdate /></ProtectedRoute>} />
        <Route path="/student/update/password" element={<ProtectedRoute userType="student"><StudentPassword /></ProtectedRoute>} />
        <Route path="/student/subjectlist" element={<ProtectedRoute userType="student"><SubjectList /></ProtectedRoute>} />
        <Route path="/student/testresult" element={<ProtectedRoute userType="student"><TestResult /></ProtectedRoute>} />
        <Route path="/student/attendance" element={<ProtectedRoute userType="student"><Attendance /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
