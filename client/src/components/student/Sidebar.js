import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";
import { IconButton, Collapse, useMediaQuery, Divider } from "@mui/material";

const isNotActiveStyle = "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 my-1";
const isActiveStyle = "flex items-center px-5 gap-3 text-blue-600 transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 my-1";

const Sidebar = ({ isMobileMenuOpen, setMobileMenuOpen }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [openSection, setOpenSection] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(max-width:1024px)');
  
  const logout = () => {
    alert("OOPS! Your session expired. Please Login again");
    dispatch({ type: "LOGOUT" });
    navigate("/login/studentLogin");
  };
  
  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("student")));
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
    const baseClasses = "bg-white shadow-xl rounded-lg transition-all duration-300 ease-in-out";
    
    if (isMobile) {
      return `fixed top-0 left-0 h-screen ${isMobileMenuOpen ? 'w-64' : 'w-0 overflow-hidden'} ${baseClasses} z-50`;
    }
    
    if (isTablet) {
      return `relative w-[220px] ${baseClasses}`;
    }
    
    return `relative flex-[0.2] ${baseClasses}`;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    
      <div className={getSidebarClasses()}>
        {isMobile && isMobileMenuOpen && (
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center">
              <img
                src="https://icon-library.com/images/cms-icon/cms-icon-11.jpg"
                alt="CMS Logo"
                className="h-8 w-8"
              />
              <h1 className="font-bold text-blue-600 text-lg ml-2">SGRRU-ERP</h1>
            </div>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <ArrowBackIcon />
            </IconButton>
          </div>
        )}
        
        <div className="overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-gray-300 h-full max-h-screen pb-20">
          <div className="p-2">
            <NavLink
              to="/student/home"
              className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
              onClick={handleNavigation}
            >
              <HomeIcon />
              <h1 className="font-normal">Dashboard</h1>
            </NavLink>
            
            <NavLink
              to="/student/profile"
              className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
              onClick={handleNavigation}
            >
              <AssignmentIndIcon />
              <h1 className="font-normal">Profile</h1>
            </NavLink>
          </div>
          
          <Divider />
          
          <div className="p-2">
            <div 
              className="flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 cursor-pointer"
              onClick={() => toggleSection('academics')}
            >
              <MenuBookIcon />
              <h1 className="font-normal">Academics</h1>
            </div>
            
            <Collapse in={openSection.academics || (!isMobile && !isTablet)} timeout="auto" unmountOnExit>
              <div className="ml-4">
                <NavLink
                  to="/student/testresult"
                  className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                  onClick={handleNavigation}
                >
                  <DescriptionIcon />
                  <h1 className="font-normal">Test Results</h1>
                </NavLink>
                <NavLink
                  to="/student/attendance"
                  className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                  onClick={handleNavigation}
                >
                  <DescriptionIcon />
                  <h1 className="font-normal">Attendance</h1>
                </NavLink>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
