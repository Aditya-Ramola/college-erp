import React from "react";
import { Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import EngineeringIcon from "@mui/icons-material/Engineering";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login/facultylogin");
  };
  return (
    <div className="flex-[0.05] flex justify-between items-center mx-5 my-2">
      <div className="flex items-center">
        <EngineeringIcon className="text-blue-600 mr-1" />
        <div>
          <h1 className="font-bold text-blue-600 text-sm leading-none">SGRRU-ERP</h1>
          <p className="text-gray-500 text-xs">Faculty Portal</p>
        </div>
      </div>
      <h1 className="hidden md:block font-semibold text-black">Welcome</h1>
      <div className="flex items-center space-x-3">
        <Avatar
          src={user.result.avatar}
          alt={user.result.name.charAt(0)}
          sx={{ width: 24, height: 24, bgcolor: 'blue.600' }}
          className="border-blue-600 border-2"
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
