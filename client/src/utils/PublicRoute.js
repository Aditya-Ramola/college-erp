import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * A public route component that redirects to dashboard if user is already authenticated
 * For login pages and other public pages
 * @param {Object} props - Component props 
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 * @param {string} props.restricted - Whether this route should redirect if authenticated
 * @returns {React.ReactNode} - Public component or redirect to dashboard
 */
const PublicRoute = ({ children, restricted = false }) => {
  // Get stored user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  
  // If restricted route (like login) and user is logged in, redirect to dashboard
  if (restricted && user && user.token) {
    // Redirect based on user role
    if (user.result.role === 'admin') {
      return <Navigate to="/admin/home" replace={true} />;
    } else if (user.result.role === 'faculty') {
      return <Navigate to="/faculty/home" replace={true} />;
    } else if (user.result.role === 'student') {
      return <Navigate to="/student/home" replace={true} />;
    }
  }
  
  // Not restricted or user not logged in, render children
  return children;
};

export default PublicRoute; 