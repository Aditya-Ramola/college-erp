import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AddIcon from "@mui/icons-material/Add";
import BoyIcon from "@mui/icons-material/Boy";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import { IconButton, Collapse, useMediaQuery, Divider } from "@mui/material";
import decode from "jwt-decode";

const isNotActiveStyle = "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 my-1";
const isActiveStyle = "flex items-center px-5 gap-3 text-blue-600 transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 my-1";

const Sidebar = ({ isMobileMenuOpen, setMobileMenuOpen }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [openSection, setOpenSection] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');
  
  const logout = () => {
    alert("OOPS! Your session expired. Please Login again");
    dispatch({ type: "LOGOUT" });
    navigate("/login/adminLogin");
  };
  
  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("admin")));
  }, [navigate]);

  // Toggle section collapse
  const toggleSection = (section) => {
    setOpenSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Close mobile menu when navigation occurs on mobile
  const handleNavigation = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Get sidebar classes based on mobile state
  const getSidebarClasses = () => {
    const baseClasses = "bg-white z-20 shadow-xl rounded-lg transition-all duration-300 ease-in-out";
    
    if (isMobile) {
      return `absolute top-0 left-0 h-screen ${isMobileMenuOpen ? 'w-64' : 'w-0 overflow-hidden'} ${baseClasses}`;
    }
    
    return `relative flex-[0.2] ${baseClasses}`;
  };

  return (
    <div className={getSidebarClasses()}>
      {isMobile && isMobileMenuOpen && (
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center">
            <img
              src="https://icon-library.com/images/cms-icon/cms-icon-11.jpg"
              alt="CMS Logo"
              className="h-8 w-8"
            />
            <h1 className="font-bold text-blue-600 text-lg ml-2">College ERP</h1>
          </div>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <ArrowBackIcon />
          </IconButton>
        </div>
      )}
      
      <div className="overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-gray-300 h-full">
        <div className="p-2">
          <NavLink
            to="/admin/home"
            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
            onClick={handleNavigation}
          >
            <HomeIcon />
            <h1 className="font-normal">Dashboard</h1>
          </NavLink>
          
          <NavLink
            to="/admin/profile"
            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
            onClick={handleNavigation}
          >
            <AssignmentIndIcon />
            <h1 className="font-normal">Profile</h1>
          </NavLink>
        </div>
        
        <Divider />
        
        <div className="p-2">
          <NavLink
            to="/admin/createNotice"
            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
            onClick={handleNavigation}
          >
            <NotificationsActiveIcon />
            <h1 className="font-normal">Create Notice</h1>
          </NavLink>
          
          <NavLink
            to="/admin/pendingregistrations"
            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
            onClick={handleNavigation}
          >
            <HowToRegIcon />
            <h1 className="font-normal">Pending Registrations</h1>
          </NavLink>
        </div>
        
        <Divider />
        
        <div className="p-2">
          <div 
            className="flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 cursor-pointer"
            onClick={() => toggleSection('admin')}
          >
            <AssignmentIndIcon />
            <h1 className="font-normal">Admin Management</h1>
          </div>
          
          <Collapse in={openSection.admin || !isMobile} timeout="auto" unmountOnExit>
            <div className="ml-4">
              <NavLink
                to="/admin/alladmin"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <AssignmentIndIcon />
                <h1 className="font-normal">Our Administrators</h1>
              </NavLink>
              <NavLink
                to="/admin/addadmin"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <AddIcon />
                <h1 className="font-normal">Add Admin</h1>
              </NavLink>
              <NavLink
                to="/admin/deleteadmin"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <DeleteIcon />
                <h1 className="font-normal">Delete Admin</h1>
              </NavLink>
            </div>
          </Collapse>
        </div>
        
        <Divider />
        
        <div className="p-2">
          <div 
            className="flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 cursor-pointer"
            onClick={() => toggleSection('department')}
          >
            <CorporateFareIcon />
            <h1 className="font-normal">Department Management</h1>
          </div>
          
          <Collapse in={openSection.department || !isMobile} timeout="auto" unmountOnExit>
            <div className="ml-4">
              <NavLink
                to="/admin/adddepartment"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <AddIcon />
                <h1 className="font-normal">Add Department</h1>
              </NavLink>
              <NavLink
                to="/admin/deletedepartment"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <DeleteIcon />
                <h1 className="font-normal">Delete Department</h1>
              </NavLink>
            </div>
          </Collapse>
        </div>
        
        <Divider />
        
        <div className="p-2">
          <div 
            className="flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 cursor-pointer"
            onClick={() => toggleSection('faculty')}
          >
            <EngineeringIcon />
            <h1 className="font-normal">Faculty Management</h1>
          </div>
          
          <Collapse in={openSection.faculty || !isMobile} timeout="auto" unmountOnExit>
            <div className="ml-4">
              <NavLink
                to="/admin/allfaculty"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <EngineeringIcon />
                <h1 className="font-normal">Our Faculty</h1>
              </NavLink>
              <NavLink
                to="/admin/addfaculty"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <AddIcon />
                <h1 className="font-normal">Add Faculty</h1>
              </NavLink>
              <NavLink
                to="/admin/deletefaculty"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <DeleteIcon />
                <h1 className="font-normal">Delete Faculty</h1>
              </NavLink>
            </div>
          </Collapse>
        </div>
        
        <Divider />
        
        <div className="p-2">
          <div 
            className="flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 cursor-pointer"
            onClick={() => toggleSection('student')}
          >
            <BoyIcon />
            <h1 className="font-normal">Student Management</h1>
          </div>
          
          <Collapse in={openSection.student || !isMobile} timeout="auto" unmountOnExit>
            <div className="ml-4">
              <NavLink
                to="/admin/allstudent"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <BoyIcon />
                <h1 className="font-normal">Our Students</h1>
              </NavLink>
              <NavLink
                to="/admin/addstudent"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <AddIcon />
                <h1 className="font-normal">Add Students</h1>
              </NavLink>
              <NavLink
                to="/admin/deletestudent"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <DeleteIcon />
                <h1 className="font-normal">Delete Student</h1>
              </NavLink>
            </div>
          </Collapse>
        </div>
        
        <Divider />
        
        <div className="p-2">
          <div 
            className="flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 cursor-pointer"
            onClick={() => toggleSection('subject')}
          >
            <MenuBookIcon />
            <h1 className="font-normal">Subject Management</h1>
          </div>
          
          <Collapse in={openSection.subject || !isMobile} timeout="auto" unmountOnExit>
            <div className="ml-4">
              <NavLink
                to="/admin/allsubject"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <MenuBookIcon />
                <h1 className="font-normal">Subjects</h1>
              </NavLink>
              <NavLink
                to="/admin/addsubject"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <AddIcon />
                <h1 className="font-normal">Add Subject</h1>
              </NavLink>
              <NavLink
                to="/admin/deletesubject"
                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                onClick={handleNavigation}
              >
                <DeleteIcon />
                <h1 className="font-normal">Delete Subject</h1>
              </NavLink>
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
