import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, Typography, Container, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, CircularProgress, useMediaQuery, useTheme
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminLayout from '../layouts/AdminLayout';
import { toast } from 'react-toastify';
import axios from 'axios';

// Memoized welcome message input component to prevent re-renders
const MessageInput = React.memo(({ value, onChange, placeholder }) => {
  // Debounce the input change to prevent excessive re-renders
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    onChange(newValue);
  }, [onChange]);

  return (
    <TextField
      autoFocus
      margin="dense"
      label="Message (Optional)"
      fullWidth
      variant="outlined"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
});

/**
 * Component to manage student registration requests
 * Admin can view, approve, or reject student registrations
 */
const PendingRegistrations = () => {
  const dispatch = useDispatch();
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [action, setAction] = useState('');
  const [message, setMessage] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Fetch pending registrations on component mount
  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        if (!token) {
          toast.error("You need to be logged in");
          return;
        }
        
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/admin/pendingstudents`,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        setPendingStudents(data);
      } catch (error) {
        console.error("Error fetching pending registrations:", error);
        toast.error("Could not load pending registrations");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingRegistrations();
  }, []);
  
  // Handle opening dialog for approval/rejection
  const handleOpenDialog = (student, actionType) => {
    setCurrentStudent(student);
    setAction(actionType);
    setDialogOpen(true);
  };
  
  // Handle closing dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentStudent(null);
    setAction('');
    setMessage('');
  };
  
  // Memoized message handler to prevent re-renders
  const handleMessageChange = useCallback((newMessage) => {
    setMessage(newMessage);
  }, []);
  
  // Update student registration status
  const handleUpdateStatus = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      if (!token) {
        toast.error("You need to be logged in");
        return;
      }
      
      const status = action === 'approve' ? 'active' : 'inactive';
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/admin/updatestudentregistration`,
        {
          studentId: currentStudent._id,
          status,
          message: message
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        // Remove the student from the pending list
        setPendingStudents(pendingStudents.filter(student => 
          student._id !== currentStudent._id
        ));
        
        toast.success(`Student registration ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      }
    } catch (error) {
      console.error("Error updating registration status:", error);
      toast.error("Failed to update registration status");
    } finally {
      handleCloseDialog();
    }
  };

  // Format creation date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <AdminLayout>
      <div className="w-full">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
          Pending Student Registrations
        </Typography>
        
        <Paper elevation={3} style={{ padding: '20px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
              <CircularProgress />
            </div>
          ) : pendingStudents.length === 0 ? (
            <Typography variant="h6" align="center" style={{ padding: '30px' }}>
              No pending registrations found
            </Typography>
          ) : (
            <TableContainer className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    {!isMobile && <TableCell><strong>Email</strong></TableCell>}
                    <TableCell><strong>Username</strong></TableCell>
                    {!isMobile && <TableCell><strong>Department</strong></TableCell>}
                    {!isMobile && <TableCell><strong>Year</strong></TableCell>}
                    {!isMobile && <TableCell><strong>Section</strong></TableCell>}
                    {!isMobile && <TableCell><strong>Registered On</strong></TableCell>}
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingStudents.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>{student.name}</TableCell>
                      {!isMobile && <TableCell>{student.email}</TableCell>}
                      <TableCell>{student.username}</TableCell>
                      {!isMobile && <TableCell>{student.department}</TableCell>}
                      {!isMobile && <TableCell>{student.year}</TableCell>}
                      {!isMobile && <TableCell>{student.section}</TableCell>}
                      {!isMobile && <TableCell>{formatDate(student.createdAt)}</TableCell>}
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={!isMobile && <AssignmentTurnedInIcon />}
                          onClick={() => handleOpenDialog(student, 'approve')}
                          style={{ marginRight: '8px' }}
                        >
                          {isMobile ? 'A' : 'Approve'}
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={!isMobile && <CancelIcon />}
                          onClick={() => handleOpenDialog(student, 'reject')}
                        >
                          {isMobile ? 'R' : 'Reject'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
        
        {/* Approval/Rejection Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog}
          fullScreen={isMobile}
        >
          <DialogTitle>
            {action === 'approve' 
              ? 'Approve Student Registration' 
              : 'Reject Student Registration'
            }
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {action === 'approve'
                ? `Are you sure you want to approve the registration for ${currentStudent?.name}?`
                : `Are you sure you want to reject the registration for ${currentStudent?.name}?`
              }
            </DialogContentText>
            
            {/* Using memoized component to prevent re-renders */}
            <MessageInput
              value={message}
              onChange={handleMessageChange}
              placeholder={action === 'approve' 
                ? "Any welcome message or instructions" 
                : "Reason for rejection"
              }
            />

            {isMobile && (
              <div className="mt-4">
                <Typography variant="subtitle2">Student Details:</Typography>
                {currentStudent && (
                  <div className="mt-2 space-y-1">
                    <p><strong>Email:</strong> {currentStudent.email}</p>
                    <p><strong>Department:</strong> {currentStudent.department}</p>
                    <p><strong>Year:</strong> {currentStudent.year}</p>
                    <p><strong>Section:</strong> {currentStudent.section}</p>
                    <p><strong>Registered On:</strong> {formatDate(currentStudent.createdAt)}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStatus} 
              color={action === 'approve' ? 'success' : 'error'}
              variant="contained"
            >
              {action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default PendingRegistrations; 