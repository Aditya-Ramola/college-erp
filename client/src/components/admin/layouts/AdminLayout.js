import React, { useState } from "react";
import { useMediaQuery } from "@mui/material";
import Header from "../Header";
import Sidebar from "../Sidebar";

/**
 * Reusable layout component for admin pages
 * Provides responsive layout with mobile sidebar toggle
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Page content to display
 */
const AdminLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(max-width:1024px)');
  
  // Toggle mobile sidebar
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="bg-[#f0f2f5] min-h-screen flex flex-col">
      {/* Main layout with responsive behavior */}
      <div className="flex flex-col h-screen">
        <Header toggleMobileMenu={toggleMobileMenu} />
        
        <div className="flex flex-1 relative overflow-hidden">
          <Sidebar 
            isMobileMenuOpen={mobileMenuOpen} 
            setMobileMenuOpen={setMobileMenuOpen} 
          />
          
          <div 
            className={`flex-1 transition-all duration-300 overflow-auto ${
              isMobile && mobileMenuOpen ? 'opacity-50' : 'opacity-100'
            }`}
            onClick={() => isMobile && mobileMenuOpen && setMobileMenuOpen(false)}
          >
            <div className={`${isMobile ? 'p-2' : 'p-4'}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout; 