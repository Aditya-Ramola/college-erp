import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getNotice } from "../../redux/actions/adminActions";
import {
  getAttendance,
  getSubject,
  getTestResult,
} from "../../redux/actions/studentActions";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import Body from "./Body";
import Header from "./Header";
import Sidebar from "./Sidebar";

const StudentHome = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const student = useSelector((state) => state.student.student);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSubject(user.result.department, user.result.year));
    dispatch(
      getTestResult(
        user.result.department,
        user.result.year,
        user.result.section
      )
    );
    dispatch(
      getAttendance(
        user.result.department,
        user.result.year,
        user.result.section
      )
    );
    dispatch(getNotice());
  }, [dispatch]);

  if (!student) {
    return <Navigate to="/login/studentLogin" />;
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

export default StudentHome;
