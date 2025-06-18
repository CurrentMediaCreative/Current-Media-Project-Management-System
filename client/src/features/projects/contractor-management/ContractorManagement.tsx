import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Contractor } from '../../../shared/types';
import { ContractorAssignment, Budget } from '../creation/types';

interface ContractorManagementProps {
  onComplete: (assignments: ContractorAssignment[]) => void;
  initialData?: {
    contractors?: Contractor[];
    budget?: Budget;
  };
}

const emailTemplates = [
  {
    id: 'initial_request',
    name: 'Initial Request',
    subject: 'Project Assignment Request',
    template: `Hi {name},

We have a new project that matches your expertise. Here are the details:

Project: {projectTitle}
Role: {role}
Rate: ${'{rate}'}/hour
Start Date: {startDate}
Duration: {duration}

Please confirm your availability and interest.

Best regards,
{senderName}`
  },
  {
    id: 'follow_up',
    name: 'Follow-up',
    subject: 'Following up: Project Assignment',
    template: `Hi {name},

Just following up on the project assignment request sent earlier.
Please let us know if you're available.

Best regards,
{senderName}`
  }
];

const ContractorManagement: React.FC<ContractorManagementProps> = ({ onComplete, initialData }) => {
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
  const [selectedContractor, setSelectedContractor] = useState<ContractorAssignment | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const emailFormik = useFormik({
    initialValues: {
      templateId: 'initial_request',
      subject: '',
      message: '',
      rate: ''
    },
    validationSchema: Yup.object({
      templateId: Yup.string().required('Template is required'),
      subject: Yup.string().required('Subject is required'),
      message: Yup.string().required('Message is required'),
      rate: Yup.number().min(0, 'Rate cannot be negative').required('Rate is required')
    }),
    onSubmit: () => {
      if (selectedContractor) {
        const updatedAssignments = assignments.map(assignment =>
          assignment.contractor.email === selectedContractor.contractor.email
            ? {
                contractor: assignment.contractor,
                status: assignment.status,
                emailSent: true,
                responseDate: assignment.responseDate,
                role: assignment.role,
                baseRate: assignment.baseRate,
                chargeOutRate: assignment.chargeOutRate,
                isFixed: assignment.isFixed
              }
            : assignment
        );
        setAssignments(updatedAssignments);
        setEmailDialogOpen(false);
        emailFormik.resetForm();
      }
    }
  });

  const handleTemplateChange = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template && selectedContractor) {
      emailFormik.setValues({
        templateId,
        subject: template.subject,
        message: template.template
          .replace('{name}', selectedContractor.contractor.name)
          .replace('{rate}', selectedContractor.contractor.baseRate.toString()),
        rate: selectedContractor.contractor.baseRate.toString()
      });
    }
  };

  const handleStatusChange = (contractor: Contractor, newStatus: 'confirmed' | 'declined') => {
    const updatedAssignments = assignments.map(assignment =>
      assignment.contractor.email === contractor.email
        ? {
            contractor: assignment.contractor,
            status: newStatus,
            emailSent: assignment.emailSent,
            responseDate: new Date().toISOString(),
            role: assignment.role,
            baseRate: assignment.baseRate,
            chargeOutRate: assignment.chargeOutRate,
            isFixed: assignment.isFixed
          }
        : assignment
    );
    setAssignments(updatedAssignments);
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
      <Typography variant="h5" gutterBottom>Contractor Management</Typography>
      
      <Grid container spacing={3}>
        {/* Team Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Team Overview</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Base Rate</TableCell>
                    <TableCell align="center">Email Status</TableCell>
                    <TableCell align="center">Assignment Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.contractor.email}>
                      <TableCell>{assignment.contractor.name}</TableCell>
                      <TableCell>{assignment.contractor.role}</TableCell>
                      <TableCell align="right">${assignment.contractor.baseRate}/hr</TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={assignment.emailSent ? 'Sent' : 'Not Sent'}
                          color={assignment.emailSent ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={assignment.status.toUpperCase()}
                          color={getStatusColor(assignment.status)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => {
                            setSelectedContractor(assignment);
                            setEmailDialogOpen(true);
                            handleTemplateChange('initial_request');
                          }}
                          disabled={assignment.status !== 'pending'}
                        >
                          <EmailIcon />
                        </IconButton>
                        <IconButton
                          color="success"
                          onClick={() => handleStatusChange(assignment.contractor, 'confirmed')}
                          disabled={assignment.status !== 'pending'}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleStatusChange(assignment.contractor, 'declined')}
                          disabled={assignment.status !== 'pending'}
                        >
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Assignment Summary</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Total Team Members</Typography>
                <Typography variant="h6">{assignments.length}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Confirmed</Typography>
                <Typography variant="h6">
                  {assignments.filter(a => a.status === 'confirmed').length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Pending Response</Typography>
                <Typography variant="h6">
                  {assignments.filter(a => a.status === 'pending').length}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onComplete(assignments)}
              disabled={assignments.some(a => a.status === 'pending')}
            >
              Complete Team Assignment
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Email Dialog */}
      <Dialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Send Assignment Email</DialogTitle>
        <form onSubmit={emailFormik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  name="templateId"
                  label="Email Template"
                  value={emailFormik.values.templateId}
                  onChange={(e) => {
                    handleTemplateChange(e.target.value);
                  }}
                >
                  {emailTemplates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="subject"
                  label="Subject"
                  value={emailFormik.values.subject}
                  onChange={emailFormik.handleChange}
                  error={emailFormik.touched.subject && Boolean(emailFormik.errors.subject)}
                  helperText={emailFormik.touched.subject && emailFormik.errors.subject}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  name="message"
                  label="Message"
                  value={emailFormik.values.message}
                  onChange={emailFormik.handleChange}
                  error={emailFormik.touched.message && Boolean(emailFormik.errors.message)}
                  helperText={emailFormik.touched.message && emailFormik.errors.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="rate"
                  label="Hourly Rate"
                  type="number"
                  value={emailFormik.values.rate}
                  onChange={emailFormik.handleChange}
                  error={emailFormik.touched.rate && Boolean(emailFormik.errors.rate)}
                  helperText={emailFormik.touched.rate && emailFormik.errors.rate}
                  InputProps={{
                    startAdornment: '$',
                    endAdornment: '/hr'
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Send Email
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ContractorManagement;
