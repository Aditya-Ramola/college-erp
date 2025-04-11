import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Button, 
  Paper, 
  Typography, 
  TextField, 
  Grid, 
  Avatar, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Box,
  IconButton,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileBase from 'react-file-base64';
import { toast } from 'react-toastify';
import { registerStudent } from '../../redux/actions/studentActions';
import SchoolIcon from '@mui/icons-material/School';
import axios from 'axios';

/**
 * Component for new user registration
 * Handles student registration with validation
 */
const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const isMobile = useMediaQuery('(max-width:768px)');
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    dob: '',
    department: '',
    year: '',
    section: '',
    avatar: ''
  });
  
  // Form error state
  const [errors, setErrors] = useState({});
  
  // Hardcoded departments data
  const MOCK_DEPARTMENTS = [
    { _id: '1', department: 'Computer Science', departmentCode: 'CS' },
    { _id: '2', department: 'Electronics', departmentCode: 'EC' },
    { _id: '3', department: 'Mechanical', departmentCode: 'ME' },
    { _id: '4', department: 'Civil', departmentCode: 'CE' },
    { _id: '5', department: 'Electrical', departmentCode: 'EE' },
    { _id: '6', department: 'Information Technology', departmentCode: 'IT' }
  ];
  
  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        console.log("Attempting to fetch departments...");
        
        // Try the public departments endpoint
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/admin/public/departments`
          );
          
          console.log("API Response:", response);
          
          if (response.data) {
            if (Array.isArray(response.data)) {
              console.log("Departments array:", response.data);
              setDepartments(response.data);
            } else if (response.data.result && Array.isArray(response.data.result)) {
              // Handle case where departments are in a 'result' property
              console.log("Departments in result:", response.data.result);
              setDepartments(response.data.result);
            } else {
              console.error("Unexpected data format:", response.data);
              // Still set the mock departments
              setDepartments(MOCK_DEPARTMENTS);
              toast.info("Using sample departments for registration");
            }
          } else {
            console.error("No data received from API");
            // Still set the mock departments
            setDepartments(MOCK_DEPARTMENTS);
            toast.info("Using sample departments for registration");
          }
        } catch (apiError) {
          console.error("API error:", apiError);
          
          // Fallback to hardcoded departments for testing
          console.log("Using mock departments");
          setDepartments(MOCK_DEPARTMENTS);
          toast.info("Using sample departments for registration");
        }
      } catch (error) {
        console.error("General error fetching departments:", error);
        setDepartments(MOCK_DEPARTMENTS);
        toast.info("Using sample departments for registration");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
  }, []);
  
  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear error when field is modified
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Contact number
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }
    
    // Date of birth
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }
    
    // Department
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    // Year
    if (!formData.year) {
      newErrors.year = 'Year is required';
    }
    
    // Section
    if (!formData.section) {
      newErrors.section = 'Section is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate current step
  const validateStep = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      // Personal details validation
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.contactNumber) {
        newErrors.contactNumber = 'Contact number is required';
      } else if (!/^\d{10}$/.test(formData.contactNumber)) {
        newErrors.contactNumber = 'Contact number must be 10 digits';
      }
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
    } else if (activeStep === 1) {
      // Academic details validation
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.year) newErrors.year = 'Year is required';
      if (!formData.section) newErrors.section = 'Section is required';
    } else if (activeStep === 2) {
      // Password validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle step navigation
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert year to number
      const formDataWithNumberYear = {
        ...formData,
        year: parseInt(formData.year, 10)
      };
      
      // Create a new student registration request
      const result = await dispatch(registerStudent(formDataWithNumberYear));
      
      if (result.success) {
        toast.success('Registration successful! Please wait for admin approval.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response && error.response.data) {
        // Set field errors from response
        if (error.response.data.emailError) {
          setErrors(prev => ({ ...prev, email: error.response.data.emailError }));
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Registration failed. Please check your information and try again.');
        }
      } else {
        toast.error('Registration failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };
  
  // Get step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="email"
                  variant="outlined"
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="contactNumber"
                  variant="outlined"
                  required
                  fullWidth
                  label="Contact Number"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="dob"
                  variant="outlined"
                  required
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  error={!!errors.dob}
                  helperText={errors.dob}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </motion.div>
        );
        
      case 1:
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.department} required>
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    label="Department"
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept.department}>
                        {dept.department}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.year} required>
                  <InputLabel id="year-label">Year</InputLabel>
                  <Select
                    labelId="year-label"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    label="Year"
                  >
                    <MenuItem value="1">1st Year</MenuItem>
                    <MenuItem value="2">2nd Year</MenuItem>
                    <MenuItem value="3">3rd Year</MenuItem>
                    <MenuItem value="4">4th Year</MenuItem>
                  </Select>
                  {errors.year && <FormHelperText>{errors.year}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.section} required>
                  <InputLabel id="section-label">Section</InputLabel>
                  <Select
                    labelId="section-label"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    label="Section"
                  >
                    <MenuItem value="A">Section A</MenuItem>
                    <MenuItem value="B">Section B</MenuItem>
                    <MenuItem value="C">Section C</MenuItem>
                    <MenuItem value="D">Section D</MenuItem>
                  </Select>
                  {errors.section && <FormHelperText>{errors.section}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <div className="flex flex-col">
                  <Typography variant="subtitle2" gutterBottom>
                    Profile Picture (Optional)
                  </Typography>
                  <div className="flex items-center space-x-4">
                    {formData.avatar && (
                      <Avatar 
                        src={formData.avatar} 
                        alt="Preview" 
                        sx={{ width: 64, height: 64 }}
                      />
                    )}
                    <FileBase
                      type="file"
                      multiple={false}
                      onDone={({base64}) => setFormData({...formData, avatar: base64})}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  variant="outlined"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="confirmPassword"
                  variant="outlined"
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box className="bg-yellow-50 p-4 rounded-md">
                  <Typography variant="body2" color="text.secondary">
                    <strong>Note:</strong> Your registration will be reviewed by an administrator before approval.
                    You will be notified via email once your account is activated.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        );
        
      default:
        return 'Unknown step';
    }
  };
  
  // Steps for the stepper
  const steps = ['Personal Information', 'Academic Details', 'Security'];
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-700 px-4 py-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center blur-sm opacity-20"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/50 to-pink-700/50" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-4xl"
      >
        <Paper 
          elevation={10} 
          className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-lg"
        >
          {/* Header */}
          <Box className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <SchoolIcon className="text-white mr-3" fontSize="large" />
              <Typography variant="h5" className="text-white font-bold">
                Student Registration
              </Typography>
            </div>
            <IconButton 
              onClick={() => navigate('/login')} 
              color="inherit"
              className="text-white"
              size="small"
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>
          
          {/* Stepper */}
          <Box className="px-6 pt-6 pb-2">
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel={!isMobile}
              orientation={isMobile ? 'vertical' : 'horizontal'}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          
          {/* Form */}
          <Box className="px-6 py-6">
            <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
              {getStepContent(activeStep)}
              
              <Box className="mt-8 flex justify-between">
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    className="bg-gradient-to-r from-red-600 to-pink-600"
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    className="bg-gradient-to-r from-red-600 to-pink-600"
                  >
                    Next
                  </Button>
                )}
              </Box>
            </form>
          </Box>
          
          {/* Footer */}
          <Box className="px-6 py-4 bg-white/5 border-t border-white/10 flex justify-center">
            <Typography 
              component={Link} 
              to="/login/studentlogin"
              className="text-white hover:underline"
            >
              Already have an account? Sign in
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </div>
  );
};

export default SignUp; 