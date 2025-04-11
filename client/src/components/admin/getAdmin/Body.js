import React, { useEffect, useState } from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdmin } from "../../../redux/actions/adminActions";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { Button, Card, CardContent, Paper, Typography } from "@mui/material";
import { SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const admins = useSelector((state) => state.admin.allAdmin);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (admins?.length !== 0) {
      setLoading(false);
    }
  }, [admins]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <AdminPanelSettingsIcon />
          <h1>All Administrators</h1>
        </div>
        
        <Paper elevation={3} className="w-full p-4 bg-white rounded-xl">
          <Typography variant="h6" className="text-gray-700 font-semibold mb-4">
            System Administrators
          </Typography>
          
          <div className={classes.loadingAndError}>
            {loading && (
              <Spinner
                message="Loading administrators..."
                height={50}
                width={150}
                color="#111111"
                messageColor="#111"
              />
            )}
          </div>
          
          {!loading && admins?.length === 0 && (
            <Typography className="text-center text-gray-500 my-4">
              No administrators found in the system
            </Typography>
          )}
          
          {!loading && admins?.length !== 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {admins?.map((admin, idx) => (
                <Card 
                  key={idx} 
                  className="hover:shadow-lg transition-shadow duration-300"
                  sx={{ 
                    borderTop: '4px solid #10B981',
                    borderRadius: '8px'
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <AdminPanelSettingsIcon className="text-green-600 mr-2" />
                      <Typography variant="h6" className="font-semibold">
                        {admin.name}
                      </Typography>
                    </div>
                    
                    <div className="space-y-2 text-gray-600">
                      <div className="flex justify-between">
                        <Typography variant="body2" className="font-medium">Username:</Typography>
                        <Typography variant="body2">{admin.username}</Typography>
                      </div>
                      
                      <div className="flex justify-between">
                        <Typography variant="body2" className="font-medium">Email:</Typography>
                        <Typography variant="body2">{admin.email}</Typography>
                      </div>
                      
                      <div className="flex justify-between">
                        <Typography variant="body2" className="font-medium">Department:</Typography>
                        <Typography variant="body2">{admin.department || 'Not specified'}</Typography>
                      </div>
                      
                      <div className="flex justify-between">
                        <Typography variant="body2" className="font-medium">Join Date:</Typography>
                        <Typography variant="body2">
                          {admin.joiningDate ? new Date(admin.joiningDate).toLocaleDateString() : 'Not specified'}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default Body; 