import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SET_ERRORS } from '../redux/actionTypes';

/**
 * A protected route component that checks for user authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.userType - Type of user for this route (admin, faculty, student)
 * @returns {React.ReactNode} - Protected component or redirect
 */
const ProtectedRoute = ({ children, userType }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Clear any errors when navigating between protected routes
  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [location.pathname, dispatch]);
  
  // Get stored user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  
  // If no user or token, redirect to login
  if (!user || !user.token) {
    // Redirect to the appropriate login page based on userType
    let loginPath = '/login';
    
    if (userType === 'admin') {
      loginPath = '/login/adminlogin';
    } else if (userType === 'faculty') {
      loginPath = '/login/facultylogin';
    } else if (userType === 'student') {
      loginPath = '/login/studentlogin';
    }
    
    // Use replace: true to prevent back button issues
    return <Navigate to={loginPath} replace={true} />;
  }
  
  // Check if the user role matches the required role for this route
  if (
    (userType === 'admin' && user.result.role !== 'admin') ||
    (userType === 'faculty' && user.result.role !== 'faculty') ||
    (userType === 'student' && user.result.role !== 'student')
  ) {
    // Redirect to the main login page if role doesn't match
    return <Navigate to="/login" replace={true} />;
  }
  
  // User is authenticated and has correct role, render children
  return children;
};

export default ProtectedRoute; 