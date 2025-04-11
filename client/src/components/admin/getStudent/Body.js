import React, { useEffect, useState } from "react";
import BoyIcon from "@mui/icons-material/Boy";
import { useDispatch, useSelector } from "react-redux";
import { getStudent } from "../../../redux/actions/adminActions";
import { MenuItem, Select, FormControl, InputLabel, Typography, Grid, Paper, Box, Divider, Card, CardContent, Avatar, Chip } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { SET_ERRORS } from "../../../redux/actionTypes";
import FilterListIcon from "@mui/icons-material/FilterList";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import ClassIcon from "@mui/icons-material/Class";
import GroupsIcon from "@mui/icons-material/Groups";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [value, setValue] = useState({
    department: "",
    year: "",
  });
  const [search, setSearch] = useState(false);

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
    dispatch(getStudent(value));
  };
  const students = useSelector((state) => state.admin.students.result);

  useEffect(() => {
    if (students?.length !== 0) setLoading(false);
  }, [students]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3 mx-4 md:mx-8">
      <div className="space-y-5">
        <div className="flex text-gray-600 items-center space-x-2">
          <BoyIcon />
          <Typography variant="h6">Student Directory</Typography>
        </div>
        
        <Grid container spacing={3}>
          {/* Filter Section */}
          <Grid item xs={12} md={3}>
            <Paper elevation={3} className="p-4 rounded-xl">
              <Box className="mb-4 flex items-center">
                <FilterListIcon className="mr-2 text-red-500" />
                <Typography variant="h6">Filter Students</Typography>
              </Box>
              <Divider className="mb-4" />
              
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department"
                    value={value.department}
                    label="Department"
                    onChange={(e) => setValue({ ...value, department: e.target.value })}
                    required
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">Select Department</MenuItem>
                    {departments?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.department}>
                        {dp.department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="year-label">Year</InputLabel>
                  <Select
                    labelId="year-label"
                    id="year"
                    value={value.year}
                    label="Year"
                    onChange={(e) => setValue({ ...value, year: e.target.value })}
                    required
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">Select Year</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                  </Select>
                </FormControl>
                
                <button
                  type="submit"
                  className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
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
                  {search ? `${value.department} Department - Year ${value.year} Students` : 'Select a Department and Year'}
                </Typography>
                {search && !loading && students?.length > 0 && (
                  <Typography variant="body2" className="text-gray-500">
                    Found {students.length} students
                  </Typography>
                )}
              </Box>
              <Divider className="mb-4" />
              
              <div className={classes.loadingAndError}>
                {loading && (
                  <Spinner
                    message="Loading student data..."
                    height={50}
                    width={150}
                    color="#111111"
                    messageColor="blue"
                  />
                )}
                {(error.noStudentError || error.backendError) && (
                  <Typography color="error" variant="h6" className="font-medium">
                    {error.noStudentError || error.backendError}
                  </Typography>
                )}
              </div>
              
              {search && !loading && Object.keys(error).length === 0 && students?.length !== 0 && (
                <Grid container spacing={3}>
                  {students?.map((student, idx) => (
                    <Grid item xs={12} sm={6} lg={4} key={idx}>
                      <Card className="hover:shadow-lg transition-all duration-300" sx={{ height: '100%' }}>
                        <CardContent>
                          <Box className="flex items-center mb-3">
                            <Avatar 
                              sx={{ 
                                bgcolor: 'error.main',
                                width: 50,
                                height: 50,
                                marginRight: 2
                              }}
                            >
                              {student.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" component="div">
                                {student.name}
                              </Typography>
                              <Chip 
                                label={`Year ${value.year}`} 
                                size="small" 
                                color="error" 
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                          
                          <Divider className="my-2" />
                          
                          <Box className="mt-3 space-y-2">
                            <Box className="flex items-center">
                              <PersonIcon fontSize="small" className="mr-2 text-red-500" />
                              <Typography variant="body2">
                                Username: {student.username}
                              </Typography>
                            </Box>
                            
                            <Box className="flex items-center">
                              <EmailIcon fontSize="small" className="mr-2 text-red-500" />
                              <Typography variant="body2" noWrap>
                                {student.email}
                              </Typography>
                            </Box>
                            
                            <Box className="flex items-center">
                              <ClassIcon fontSize="small" className="mr-2 text-red-500" />
                              <Typography variant="body2">
                                Section: {student.section}
                              </Typography>
                            </Box>
                            
                            <Box className="flex items-center">
                              <GroupsIcon fontSize="small" className="mr-2 text-red-500" />
                              <Typography variant="body2">
                                Batch: {student.batch}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              {search && !loading && Object.keys(error).length === 0 && students?.length === 0 && (
                <Box className="text-center py-6">
                  <Typography variant="h6" color="textSecondary">
                    No students found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Try selecting different filters
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
