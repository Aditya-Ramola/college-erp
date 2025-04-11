import React from "react";
import { Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login/studentlogin");
  };
  return (
    <div className="flex-[0.05] flex justify-between items-center mx-5 my-2">
      <div className="flex items-center">
        <SchoolIcon className="text-red-500 mr-1" />
        <div>
          <h1 className="font-bold text-red-500 text-sm leading-none">SGRRU-ERP</h1>
          <p className="text-gray-500 text-xs">Student Portal</p>
        </div>
      </div>
      <h1 className="hidden md:block font-semibold text-black">Welcome</h1>
      <div className="flex items-center space-x-3">
        <Avatar
          src={user.result.avatar}
          alt={user.result.name.charAt(0)}
          sx={{ width: 24, height: 24, bgcolor: 'red.500' }}
          className="border-red-500 border-2"
        />
        <h1>{user.result.name.split(" ")[0]}</h1>
        <LogoutIcon
          onClick={logout}
          className="cursor-pointer hover:scale-125 transition-all"
        />
      </div>
    </div>
  );
};

export default Header;
