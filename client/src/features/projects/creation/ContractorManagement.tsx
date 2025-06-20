import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import { ContractorManagementProps, ContractorAssignment } from '../../../types';
import { emailService } from '../../../services/emailService';

const ContractorManagement: React.FC<ContractorManagementProps> = ({
  onComplete,
  initialData,
  errors,
  loading,
  onNext,
  onBack
}) => {
  const [assignments, setAssignments] = useState<ContractorAssignment[]>(
    initialData?.contractors?.map(contractor => ({
      contractor,
      status: 'pending',
      emailSent: false,
      role: contractor.role,
      baseRate: contractor.baseRate,
      chargeOutRate: contractor.chargeOutRate,
      isFixed: contractor.isFixed
    })) || []
  );
  const [sendingEmails, setSendingEmails] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSendAssignmentEmails = async () => {
    setSendingEmails(true);
    setEmailError(null);
    try {
      
      // Send emails to all contractors
      await Promise.all(
        assignments.map(async (assignment) => {
          await emailService.sendContractorAssignment({
            to: assignment.contractor.email,
            contractorName: assignment.contractor.name,
            projectTitle: initialData?.projectTitle || 'New Project',
            role: assignment.role,
            rate: assignment.isFixed ? assignment.baseRate : assignment.chargeOutRate,
            isFixed: assignment.isFixed
          });
        })
      );
      
      // Update assignments to mark emails as sent
      setAssignments(prev => 
        prev.map(assignment => ({
          ...assignment,
          emailSent: true
        }))
      );
      
      // Move to next step after emails are sent
      if (onNext) {
        onNext();
      }
    } catch (error) {
      setEmailError('Failed to send assignment emails. Please try again.');
      console.error('Email sending error:', error);
    } finally {
      setSendingEmails(false);
    }
  };

  const handleConfirmation = (index: number, confirmed: boolean) => {
    setAssignments(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status: confirmed ? 'confirmed' : 'declined',
        responseDate: new Date().toISOString()
      };
      return updated;
    });
  };

  const handleComplete = () => {
    onComplete(assignments);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'declined':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Contractor Management
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Team Assignments
        </Typography>
        
        {assignments.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No contractors have been assigned yet.
          </Alert>
        ) : (
          <List>
            {assignments.map((assignment, index) => (
              <React.Fragment key={`${assignment.contractor.name}-${assignment.contractor.email}`}>
                <ListItem>
                  <ListItemText
                    primary={assignment.contractor.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {assignment.role}
                        </Typography>
                        <br />
                        Rate: ${assignment.chargeOutRate}/hr
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={assignment.status}
                      color={getStatusColor(assignment.status)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {!assignment.emailSent ? (
                      <IconButton
                        edge="end"
                        disabled={sendingEmails}
                        onClick={() => handleConfirmation(index, true)}
                      >
                        <EmailIcon />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton
                          edge="end"
                          onClick={() => handleConfirmation(index, true)}
                          disabled={assignment.status !== 'pending'}
                          color="success"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleConfirmation(index, false)}
                          disabled={assignment.status !== 'pending'}
                          color="error"
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                {index < assignments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {emailError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {emailError}
          </Alert>
        )}

        {errors && Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {Object.values(errors).map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </Alert>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={loading || sendingEmails}
        >
          Back
        </Button>
        
        <Box>
          {!assignments.every(a => a.emailSent) && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendAssignmentEmails}
              disabled={loading || sendingEmails || assignments.length === 0}
              startIcon={sendingEmails ? <CircularProgress size={20} /> : <EmailIcon />}
              sx={{ mr: 2 }}
            >
              Send Assignment Emails
            </Button>
          )}
          
          <Button
            variant="contained"
            onClick={handleComplete}
            disabled={
              loading || 
              sendingEmails || 
              assignments.length === 0 || 
              !assignments.every(a => a.emailSent) ||
              assignments.some(a => a.status === 'pending')
            }
          >
            {loading ? <CircularProgress size={20} /> : 'Continue'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ContractorManagement;
