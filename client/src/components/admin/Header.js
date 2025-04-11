import React from "react";
import { Avatar, IconButton, useMediaQuery } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";

const Header = ({ toggleMobileMenu }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login/adminLogin");
  };

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white shadow-md rounded-lg mx-2 my-2">
      <div className="flex items-center">
        {isMobile && (
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu"
            onClick={toggleMobileMenu}
            className="mr-2"
          >
            <MenuIcon />
          </IconButton>
        )}
        <div className="flex items-center">
          <SchoolIcon className="text-green-600" fontSize="medium" />
          <div className="ml-2">
            <h1 className="font-bold text-green-600 text-lg leading-none">SGRRU-ERP</h1>
            <p className="text-gray-500 text-xs hidden sm:block">Admin Panel</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="hidden md:flex items-center">
          <h1 className="mr-3 text-gray-700 font-medium">Welcome, {user.result.name.split(" ")[0]}</h1>
        </div>
        <div className="flex items-center">
          <Avatar
            src={user.result.avatar}
            alt={user.result.name.charAt(0)}
            sx={{ width: 32, height: 32, bgcolor: 'green.600' }}
            className="border-green-600 border-2"
          />
          <h1 className="mx-2 hidden sm:block">{user.result.name.split(" ")[0]}</h1>
          <IconButton onClick={logout} color="error" size="small">
            <LogoutIcon className="cursor-pointer hover:scale-110 transition-all" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Header;
