import {
  SET_ERRORS,
  UPDATE_PASSWORD,
  TEST_RESULT,
  STUDENT_LOGIN,
  ATTENDANCE,
  UPDATE_STUDENT,
  GET_SUBJECT,
  REGISTER_STUDENT
} from "../actionTypes";
import * as api from "../api";
import { navigateWithoutLoop } from "../../utils/navigation";

export const studentSignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.studentSignIn(formData);
    dispatch({ type: STUDENT_LOGIN, data });
    if (data.result.passwordUpdated) {
      navigateWithoutLoop(navigate, "/student/home");
    } else {
      navigateWithoutLoop(navigate, "/student/password");
    }
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const studentUpdatePassword =
  (formData, navigate) => async (dispatch) => {
    try {
      const { data } = await api.studentUpdatePassword(formData);
      dispatch({ type: UPDATE_PASSWORD, payload: true });
      alert("Password Updated");
      navigateWithoutLoop(navigate, "/student/home");
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const updateStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateStudent(formData);
    dispatch({ type: UPDATE_STUDENT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getSubject = (department, year) => async (dispatch) => {
  try {
    const formData = {
      department,
      year,
    };
    const { data } = await api.getSubject(formData);
    dispatch({ type: GET_SUBJECT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getTestResult =
  (department, year, section) => async (dispatch) => {
    try {
      const formData = {
        department,
        year,
        section,
      };
      const { data } = await api.getTestResult(formData);
      dispatch({ type: TEST_RESULT, payload: data });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const getAttendance =
  (department, year, section) => async (dispatch) => {
    try {
      const formData = {
        department,
        year,
        section,
      };
      const { data } = await api.getAttendance(formData);
      dispatch({ type: ATTENDANCE, payload: data });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

/**
 * Register a new student in the system
 * @param {Object} studentData - Student registration data
 * @returns {Promise} - Resolves with registration result
 */
export const registerStudent = (studentData) => async (dispatch) => {
  try {
    // Clear any previous errors
    dispatch({ type: SET_ERRORS, payload: {} });
    
    // Register the student
    const { data } = await api.registerStudent(studentData);
    
    dispatch({ type: REGISTER_STUDENT, payload: data });
    return { success: true, data };
  } catch (error) {
    console.error("Registration error:", error);
    
    // Format the error response properly
    const errorPayload = error.response ? error.response.data : 
      { message: "Registration failed. Please try again later." };
      
    dispatch({ type: SET_ERRORS, payload: errorPayload });
    throw error;
  }
};
