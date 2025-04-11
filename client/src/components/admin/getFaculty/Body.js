import React, { useEffect, useState } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useDispatch, useSelector } from "react-redux";
import { getFaculty } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import MenuItem from "@mui/material/MenuItem";
import { SET_ERRORS } from "../../../redux/actionTypes";
import { Avatar, Box, Card, CardContent, Grid, Paper, Typography, Divider, InputLabel, FormControl } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";

const Body = () => {
  const dispatch = useDispatch();
  const [department, setDepartment] = useState("");
  const [error, setError] = useState({});
  const departments = useSelector((state) => state.admin.allDepartment);
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});
    dispatch(getFaculty({ department }));
  };
  const faculties = useSelector((state) => state.admin.faculties.result);

  useEffect(() => {
    if (faculties?.length !== 0) {
      setLoading(false);
    }
  }, [faculties]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3 mx-4 md:mx-8">
      <div className="space-y-5">
        <div className="flex text-gray-600 items-center space-x-2">
          <EngineeringIcon />
          <Typography variant="h6">Faculty Directory</Typography>
        </div>
        
        <Grid container spacing={3}>
          {/* Filter Section */}
          <Grid item xs={12} md={3}>
            <Paper elevation={3} className="p-4 rounded-xl">
              <Box className="mb-4 flex items-center">
                <FilterListIcon className="mr-2 text-blue-600" />
                <Typography variant="h6">Filter Faculty</Typography>
              </Box>
              <Divider className="mb-4" />
              
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department"
                    value={department}
                    label="Department"
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.department}>
                        {dp.department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <button
                  type="submit"
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
                >
                  Search
                </button>
              </form>
            </Paper>
          </Grid>
          
          {/* Results Section */}
          <Grid item xs={12} md={9}>
            <Paper elevation={3} className="p-4 rounded-xl">
              <Box className="mb-4">
                <Typography variant="h6" className="text-gray-700">
                  {search ? `${department || 'All'} Department Faculty` : 'Select a Department'}
                </Typography>
                {search && !loading && faculties?.length > 0 && (
                  <Typography variant="body2" className="text-gray-500">
                    Found {faculties.length} faculty members
                  </Typography>
                )}
              </Box>
              <Divider className="mb-4" />
              
              <div className={classes.loadingAndError}>
                {loading && (
                  <Spinner
                    message="Loading faculty data..."
                    height={50}
                    width={150}
                    color="#111111"
                    messageColor="blue"
                  />
                )}
                {(error.noFacultyError || error.backendError) && (
                  <Typography color="error" variant="h6" className="font-medium">
                    {error.noFacultyError || error.backendError}
                  </Typography>
                )}
              </div>

              {search && !loading && Object.keys(error).length === 0 && faculties?.length !== 0 && (
                <Grid container spacing={3}>
                  {faculties?.map((faculty, idx) => (
                    <Grid item xs={12} sm={6} lg={4} key={idx}>
                      <Card className="hover:shadow-lg transition-all duration-300" sx={{ height: '100%' }}>
                        <CardContent>
                          <Box className="flex items-center mb-3">
                            <Avatar 
                              sx={{ 
                                bgcolor: 'primary.main',
                                width: 50,
                                height: 50,
                                marginRight: 2
                              }}
                            >
                              {faculty.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" component="div">
                                {faculty.name}
                              </Typography>
                              <Typography color="textSecondary">
                                {faculty.designation}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Divider className="my-2" />
                          
                          <Box className="mt-3 space-y-2">
                            <Box className="flex items-center">
                              <PersonIcon fontSize="small" className="mr-2 text-blue-500" />
                              <Typography variant="body2">
                                Username: {faculty.username}
                              </Typography>
                            </Box>
                            
                            <Box className="flex items-center">
                              <EmailIcon fontSize="small" className="mr-2 text-blue-500" />
                              <Typography variant="body2" noWrap>
                                {faculty.email}
                              </Typography>
                            </Box>
                            
                            <Box className="flex items-center">
                              <WorkIcon fontSize="small" className="mr-2 text-blue-500" />
                              <Typography variant="body2">
                                Department: {faculty.department}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              {search && !loading && Object.keys(error).length === 0 && faculties?.length === 0 && (
                <Box className="text-center py-6">
                  <Typography variant="h6" color="textSecondary">
                    No faculty members found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Try selecting a different department
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Body;
