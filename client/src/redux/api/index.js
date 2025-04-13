import axios from "axios";

// Determine the API base URL based on environment
let baseURL = process.env.REACT_APP_API_URL;
console.log("API Base URL:", baseURL); // Debug log

// Clean up the URL to ensure it doesn't have trailing slashes
if (baseURL && baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}

// If API URL is not set, use relative URLs in production or localhost in development
if (!baseURL) {
  baseURL = process.env.NODE_ENV === 'production' 
    ? '' // Empty for production since we'll use full paths
    : 'http://localhost:5001'; // Use localhost in development
}

// Create API instance with environment variable for server URL
const API = axios.create({ 
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // Important for CORS
});

// Debug requests
API.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    // Make sure we're sending the correct content type for all requests
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Request interceptor to add authorization header with JWT token
 * This runs before every API request
 */
API.interceptors.request.use((req) => {
  // Get user data from local storage
  const userString = localStorage.getItem("user");
  
  if (userString) {
    try {
      // Add token to request headers
      const userData = JSON.parse(userString);
      req.headers.Authorization = `Bearer ${userData.token}`;
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Remove invalid data
      localStorage.removeItem("user");
    }
  }
  return req;
});

/**
 * Response interceptor for handling common error scenarios
 * This runs after every API response
 */
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.message);
    
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    } else if (error.request) {
      console.error("Request was made but no response received");
      console.error("Request:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      if (error.response.data.message === "Authentication failed. Token expired.") {
        // Clear user data and redirect to login
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(new Error("Session expired. Please login again."));
      }
    }
    return Promise.reject(error);
  }
);

// Admin login - handle specially with full URL to avoid CORS issues
export const adminSignIn = (formData) => {
  console.log("Admin login attempt with:", formData.username);
  
  return axios({
    method: 'post',
    url: `${baseURL}/api/admin/login`,
    data: formData,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin
    },
    withCredentials: false
  })
  .then(response => {
    console.log("Login successful:", response.data);
    return response;
  })
  .catch(error => {
    console.error("Login error details:", error);
    
    // Log more detailed error information
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request made but no response received");
    } else {
      console.error("Error setting up request:", error.message);
    }
    
    // Try the proxy endpoint as a fallback
    console.log("Trying proxy endpoint as fallback");
    return axios({
      method: 'post',
      url: `${baseURL}/api/proxy/admin/login`,
      data: formData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      withCredentials: false
    });
  });
};

// Rest of the exports
export const adminUpdatePassword = (updatedPassword) =>
  API.post("/api/admin/updatepassword", updatedPassword);

export const getAllStudent = () => API.get("/api/admin/getallstudent");

export const getAllFaculty = () => API.get("/api/admin/getallfaculty");

export const getAllAdmin = () => API.get("/api/admin/getalladmin");

export const getAllDepartment = () => API.get("/api/admin/getalldepartment");
export const getAllSubject = () => API.get("/api/admin/getallsubject");

export const updateAdmin = (updatedAdmin) =>
  API.post("/api/admin/updateprofile", updatedAdmin);

export const addAdmin = (admin) => API.post("/api/admin/addadmin", admin);
export const createNotice = (notice) =>
  API.post("/api/admin/createnotice", notice);
export const deleteAdmin = (data) => API.post("/api/admin/deleteadmin", data);
export const deleteFaculty = (data) =>
  API.post("/api/admin/deletefaculty", data);
export const deleteStudent = (data) =>
  API.post("/api/admin/deletestudent", data);
export const deleteSubject = (data) =>
  API.post("/api/admin/deletesubject", data);
export const deleteDepartment = (data) =>
  API.post("/api/admin/deletedepartment", data);

export const getAdmin = (admin) => API.post("/api/admin/getadmin", admin);

export const addDepartment = (department) =>
  API.post("/api/admin/adddepartment", department);

export const addFaculty = (faculty) =>
  API.post("/api/admin/addfaculty", faculty);

export const getFaculty = (department) =>
  API.post("/api/admin/getfaculty", department);

export const addSubject = (subject) =>
  API.post("/api/admin/addsubject", subject);
export const getSubject = (subject) =>
  API.post("/api/admin/getsubject", subject);

export const addStudent = (student) =>
  API.post("/api/admin/addstudent", student);

export const getStudent = (student) =>
  API.post("/api/admin/getstudent", student);
export const getNotice = (notice) => API.post("/api/admin/getnotice", notice);

// Faculty

export const facultySignIn = (formData) =>
  API.post("/api/faculty/login", formData);

export const facultyUpdatePassword = (updatedPassword) =>
  API.post("/api/faculty/updatepassword", updatedPassword);

export const updateFaculty = (updatedFaculty) =>
  API.post("/api/faculty/updateprofile", updatedFaculty);

export const createTest = (test) => API.post("/api/faculty/createtest", test);
export const getTest = (test) => API.post("/api/faculty/gettest", test);
export const getMarksStudent = (student) =>
  API.post("/api/faculty/getstudent", student);
export const uploadMarks = (data) => API.post("/api/faculty/uploadmarks", data);
export const markAttendance = (data) =>
  API.post("/api/faculty/markattendance", data);

// Student

export const studentSignIn = (formData) =>
  API.post("/api/student/login", formData);

export const studentUpdatePassword = (updatedPassword) =>
  API.post("/api/student/updatepassword", updatedPassword);

export const updateStudent = (updatedStudent) =>
  API.post("/api/student/updateprofile", updatedStudent);

export const getTestResult = (testResult) =>
  API.post("/api/student/testresult", testResult);

export const getAttendance = (attendance) =>
  API.post("/api/student/attendance", attendance);

// Student registration endpoint
export const registerStudent = (studentData) =>
  API.post("/api/student/register", studentData);

// Debug and test endpoints
export const testAdminCredentials = (credentials) => {
  console.log("Testing admin credentials for:", credentials.username);
  return axios({
    method: 'post',
    url: `${baseURL}/api/debug`,
    data: credentials,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin
    }
  });
};

export const checkApiHealth = () => {
  return axios({
    method: 'get',
    url: `${baseURL}/api/debug`,
    headers: {
      'Accept': 'application/json',
      'Origin': window.location.origin
    }
  });
};
