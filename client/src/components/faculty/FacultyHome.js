import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotice } from "../../redux/actions/adminActions";
import Sidebar from "./Sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const FacultyHome = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const faculty = useSelector((state) => state.faculty.faculty);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNotice());
  }, [dispatch]);

  if (!faculty) {
    return <Navigate to="/login/facultyLogin" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isMobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header with menu button */}
        <div className="md:hidden bg-white shadow-sm p-2 flex items-center">
          <Button
            className="text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </Button>
          <h1 className="font-bold text-blue-600 text-lg ml-2">SGRRU-ERP</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FacultyHome;
