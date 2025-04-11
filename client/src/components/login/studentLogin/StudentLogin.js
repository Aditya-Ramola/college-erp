import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment, 
  Paper, 
  Typography, 
  Box,
  Alert 
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SchoolIcon from "@mui/icons-material/School";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import { studentSignIn } from "../../../redux/actions/studentActions";
import { Helmet } from "react-helmet";
import { setupPageReloadListener } from "../../../utils/navigation";

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state);
  const [error, setError] = useState({});

  useEffect(() => {
    if (store.errors) {
      setError(store.errors);
    }
  }, [store.errors]);

  // Fix for blank page on back button
  useEffect(() => {
    // Use the utility function to handle page reload on back/forward navigation
    const cleanup = setupPageReloadListener();
    return cleanup;
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(
      studentSignIn({ 
        username: formData.username, 
        password: formData.password 
      }, navigate)
    );
  };

  // Reset form when errors occur
  useEffect(() => {
    if (store.errors) {
      setLoading(false);
    }
  }, [store.errors]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500">
      <Helmet>
        <title>SGRRU-ERP | Student Login</title>
      </Helmet>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center blur-sm opacity-20"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/50 to-pink-700/50" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <Paper 
          elevation={10} 
          className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-lg"
        >
          {/* Header */}
          <Box className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <SchoolIcon className="text-white mr-3" fontSize="large" />
              <div>
                <Typography variant="h5" className="text-white font-bold">
                  Student Login
                </Typography>
                <Typography variant="caption" className="text-white/80">
                  SGRRU-ERP System
                </Typography>
              </div>
            </div>
            <IconButton 
              onClick={() => navigate('/login', { replace: true })} 
              color="inherit"
              className="text-white"
              size="small"
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>

          {/* Login Form */}
          <motion.form 
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="px-6 py-8 space-y-6"
          >
            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                required
                label="Username"
                name="username"
                variant="outlined"
                value={formData.username}
                onChange={handleChange}
                className="backdrop-blur-md bg-white/20"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon className="text-gray-600" />
                    </InputAdornment>
                  ),
                }}
              />
              {error.usernameError && (
                <Typography color="error" variant="caption" className="mt-1">
                  {error.usernameError}
                </Typography>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                required
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                className="backdrop-blur-md bg-white/20"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon className="text-gray-600" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error.passwordError && (
                <Typography color="error" variant="caption" className="mt-1">
                  {error.passwordError}
                </Typography>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="!mt-8">
              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                disabled={loading}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium py-3 rounded-md hover:shadow-lg"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="flex justify-center mt-4"
            >
              <Typography 
                component={Link} 
                to="/signup" 
                className="text-white hover:underline text-center"
              >
                New student? Register here
              </Typography>
            </motion.div>
          </motion.form>
        </Paper>
      </motion.div>
    </div>
  );
};

export default StudentLogin;
