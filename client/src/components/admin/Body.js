import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EngineeringIcon from "@mui/icons-material/Engineering";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BoyIcon from "@mui/icons-material/Boy";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Card, CardContent, Typography, Grid, Box, Paper } from "@mui/material";

const Body = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex-[0.8] mt-3 px-4 md:px-8 overflow-y-auto">
      <div className="space-y-5">
        <Typography variant="h5" className="text-gray-600 font-semibold mb-4">
          Admin Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          {/* Admin Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl overflow-hidden"
              onClick={() => navigate("/admin/alladmin")}
            >
              <Box className="bg-gradient-to-r from-green-600 to-teal-600 py-3 px-4 flex items-center text-white">
                <AssignmentIndIcon className="mr-2" />
                <Typography variant="h6">Administrators</Typography>
              </Box>
              <CardContent className="p-4">
                <Typography variant="body1" className="text-gray-600 mb-2">
                  Manage all system administrators
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  View, add, or remove admin accounts
                </Typography>
              </CardContent>
            </Paper>
          </Grid>
          
          {/* Faculty Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl overflow-hidden"
              onClick={() => navigate("/admin/allfaculty")}
            >
              <Box className="bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 flex items-center text-white">
                <EngineeringIcon className="mr-2" />
                <Typography variant="h6">Faculty</Typography>
              </Box>
              <CardContent className="p-4">
                <Typography variant="body1" className="text-gray-600 mb-2">
                  Access faculty information
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  View, add, or remove faculty members
                </Typography>
              </CardContent>
            </Paper>
          </Grid>
          
          {/* Student Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl overflow-hidden"
              onClick={() => navigate("/admin/allstudent")}
            >
              <Box className="bg-gradient-to-r from-red-500 to-pink-500 py-3 px-4 flex items-center text-white">
                <BoyIcon className="mr-2" />
                <Typography variant="h6">Students</Typography>
              </Box>
              <CardContent className="p-4">
                <Typography variant="body1" className="text-gray-600 mb-2">
                  Access student information
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  View, add, or remove students
                </Typography>
              </CardContent>
            </Paper>
          </Grid>
          
          {/* Department Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl overflow-hidden"
              onClick={() => navigate("/admin/adddepartment")}
            >
              <Box className="bg-gradient-to-r from-purple-600 to-violet-600 py-3 px-4 flex items-center text-white">
                <CorporateFareIcon className="mr-2" />
                <Typography variant="h6">Departments</Typography>
              </Box>
              <CardContent className="p-4">
                <Typography variant="body1" className="text-gray-600 mb-2">
                  Manage academic departments
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Add or remove departments
                </Typography>
              </CardContent>
            </Paper>
          </Grid>
          
          {/* Subject Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl overflow-hidden"
              onClick={() => navigate("/admin/allsubject")}
            >
              <Box className="bg-gradient-to-r from-amber-500 to-orange-500 py-3 px-4 flex items-center text-white">
                <MenuBookIcon className="mr-2" />
                <Typography variant="h6">Subjects</Typography>
              </Box>
              <CardContent className="p-4">
                <Typography variant="body1" className="text-gray-600 mb-2">
                  Manage course subjects
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  View, add, or remove subjects
                </Typography>
              </CardContent>
            </Paper>
          </Grid>
          
          {/* Notice Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl overflow-hidden"
              onClick={() => navigate("/admin/createnotice")}
            >
              <Box className="bg-gradient-to-r from-cyan-500 to-blue-500 py-3 px-4 flex items-center text-white">
                <NotificationsActiveIcon className="mr-2" />
                <Typography variant="h6">Notices</Typography>
              </Box>
              <CardContent className="p-4">
                <Typography variant="body1" className="text-gray-600 mb-2">
                  Manage system announcements
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Create new notices for users
                </Typography>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Body;
