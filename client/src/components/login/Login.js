import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMediaQuery } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LockIcon from "@mui/icons-material/Lock";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import CopyrightIcon from "@mui/icons-material/Copyright";

/**
 * Modern login selection page
 * Provides animated options for different user roles
 */
const Login = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const isTablet = useMediaQuery("(max-width:1024px)");
  
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center bg-gradient-to-br from-blue-900 to-indigo-900 px-4 py-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center blur-sm opacity-20"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-indigo-900/50" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-6xl w-full flex flex-col items-center space-y-12 mt-8"
      >
        <div className="w-full max-w-4xl backdrop-blur-lg bg-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <SchoolIcon className="text-white text-4xl mr-4" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  SGRRU-ERP
                </h1>
                <p className="text-white/80 text-xs md:text-sm">
                  Shri Guru Ram Rai University
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center text-white space-x-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm">Secure Access</span>
            </div>
          </div>
          
          <div className="p-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'} gap-6`}
            >
              {/* Faculty Card */}
              <motion.div 
                variants={itemVariants}
                className="backdrop-blur-md bg-gradient-to-br from-indigo-600/80 to-blue-600/80 rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-6 flex flex-col items-center">
                  <EngineeringIcon className="text-white text-5xl mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-6">Faculty</h2>
                  <p className="text-white/90 text-center mb-6 text-sm">
                    Access grades, attendance, and course management tools
                  </p>
                  <Link
                    to="/login/facultylogin"
                    className="group w-full flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-lg py-3 px-4 transition-all duration-200"
                  >
                    <LockIcon className="mr-2 text-sm group-hover:scale-110 transition-transform duration-200" />
                    <span>Login</span>
                  </Link>
                </div>
              </motion.div>
              
              {/* Student Card */}
              <motion.div 
                variants={itemVariants}
                className="backdrop-blur-md bg-gradient-to-br from-red-600/80 to-pink-600/80 rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-6 flex flex-col items-center">
                  <SchoolIcon className="text-white text-5xl mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-6">Student</h2>
                  <p className="text-white/90 text-center mb-6 text-sm">
                    View grades, schedules, and manage your academic profile
                  </p>
                  <div className="w-full space-y-3">
                    <Link
                      to="/login/studentlogin"
                      className="group w-full flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-lg py-3 px-4 transition-all duration-200"
                    >
                      <LockIcon className="mr-2 text-sm group-hover:scale-110 transition-transform duration-200" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="group w-full flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-lg py-3 px-4 transition-all duration-200"
                    >
                      <AppRegistrationIcon className="mr-2 text-sm group-hover:scale-110 transition-transform duration-200" />
                      <span>Register</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
              
              {/* Admin Card */}
              <motion.div 
                variants={itemVariants}
                className="backdrop-blur-md bg-gradient-to-br from-green-600/80 to-teal-600/80 rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-6 flex flex-col items-center">
                  <AdminPanelSettingsIcon className="text-white text-5xl mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-6">Admin</h2>
                  <p className="text-white/90 text-center mb-6 text-sm">
                    Manage users, departments, and system settings
                  </p>
                  <Link
                    to="/login/adminlogin"
                    className="group w-full flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-lg py-3 px-4 transition-all duration-200"
                  >
                    <LockIcon className="mr-2 text-sm group-hover:scale-110 transition-transform duration-200" />
                    <span>Login</span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center max-w-2xl"
        >
          <p className="text-white/90 text-lg">
            Streamlined academic management for Shri Guru Ram Rai University.
            Secure, efficient, and user-friendly.
          </p>
        </motion.div>
      </motion.div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="z-10 w-full max-w-4xl mt-auto py-4 px-6 text-center"
      >
        <div className="border-t border-white/20 pt-4 flex flex-col md:flex-row justify-between items-center text-white/70">
          <div className="flex items-center mb-2 md:mb-0">
            <CopyrightIcon fontSize="small" className="mr-1" />
            <span>{new Date().getFullYear()} SGRRU-ERP. All rights reserved.</span>
          </div>
          <div className="flex items-center text-sm">
            <span>Designed & Developed by <span className="font-semibold text-white">Anurag Bhatt</span></span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
