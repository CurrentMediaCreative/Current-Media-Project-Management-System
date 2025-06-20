import React from 'react';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ProjectFormData } from '../../../types';

interface InitialProjectInfoProps {
  onSave: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Project title is required')
    .min(3, 'Title must be at least 3 characters'),
  client: Yup.string()
    .required('Client name is required'),
  timeframe: Yup.object({
    startDate: Yup.string()
      .required('Start date is required'),
    endDate: Yup.string()
      .required('End date is required')
  }),
  budget: Yup.object({
    estimated: Yup.number()
      .required('Estimated budget is required')
      .min(0, 'Budget cannot be negative'),
    actual: Yup.number()
      .min(0, 'Budget cannot be negative'),
    profitTarget: Yup.number()
      .required('Profit target is required')
      .min(0, 'Profit target cannot be negative'),
    contingencyPercentage: Yup.number()
      .required('Contingency percentage is required')
      .min(0, 'Contingency percentage cannot be negative')
  })
});

const InitialProjectInfo: React.FC<InitialProjectInfoProps> = ({ onSave, initialData }) => {
  const formik = useFormik({
    initialValues: {
      title: initialData?.title || '',
      client: initialData?.client || '',
      timeframe: {
        startDate: initialData?.timeframe?.startDate || '',
        endDate: initialData?.timeframe?.endDate || ''
      },
      budget: {
        estimated: initialData?.budget?.estimated || 0,
        actual: initialData?.budget?.actual || 0,
        profitTarget: initialData?.budget?.profitTarget || 20,
        contingencyPercentage: initialData?.budget?.contingencyPercentage || 10
      },
      contractors: initialData?.contractors || []
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    }
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Typography variant="h5" gutterBottom>Initial Project Information</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Project Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="client"
              name="client"
              label="Client Name"
              value={formik.values.client}
              onChange={formik.handleChange}
              error={formik.touched.client && Boolean(formik.errors.client)}
              helperText={formik.touched.client && formik.errors.client}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="timeframe.startDate"
              name="timeframe.startDate"
              label="Start Date"
              type="date"
              value={formik.values.timeframe.startDate}
              onChange={formik.handleChange}
              error={formik.touched.timeframe?.startDate && Boolean(formik.errors.timeframe?.startDate)}
              helperText={formik.touched.timeframe?.startDate && formik.errors.timeframe?.startDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="timeframe.endDate"
              name="timeframe.endDate"
              label="End Date"
              type="date"
              value={formik.values.timeframe.endDate}
              onChange={formik.handleChange}
              error={formik.touched.timeframe?.endDate && Boolean(formik.errors.timeframe?.endDate)}
              helperText={formik.touched.timeframe?.endDate && formik.errors.timeframe?.endDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="budget.estimated"
              name="budget.estimated"
              label="Estimated Budget"
              type="number"
              value={formik.values.budget.estimated}
              onChange={formik.handleChange}
              error={formik.touched.budget?.estimated && Boolean(formik.errors.budget?.estimated)}
              helperText={formik.touched.budget?.estimated && formik.errors.budget?.estimated}
              InputProps={{ startAdornment: '$' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="budget.actual"
              name="budget.actual"
              label="Actual Budget (if known)"
              type="number"
              value={formik.values.budget.actual}
              onChange={formik.handleChange}
              error={formik.touched.budget?.actual && Boolean(formik.errors.budget?.actual)}
              helperText={formik.touched.budget?.actual && formik.errors.budget?.actual}
              InputProps={{ startAdornment: '$' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="budget.profitTarget"
              name="budget.profitTarget"
              label="Profit Target (%)"
              type="number"
              value={formik.values.budget.profitTarget}
              onChange={formik.handleChange}
              error={formik.touched.budget?.profitTarget && Boolean(formik.errors.budget?.profitTarget)}
              helperText={formik.touched.budget?.profitTarget && formik.errors.budget?.profitTarget}
              InputProps={{ endAdornment: '%' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="budget.contingencyPercentage"
              name="budget.contingencyPercentage"
              label="Contingency Percentage"
              type="number"
              value={formik.values.budget.contingencyPercentage}
              onChange={formik.handleChange}
              error={formik.touched.budget?.contingencyPercentage && Boolean(formik.errors.budget?.contingencyPercentage)}
              helperText={formik.touched.budget?.contingencyPercentage && formik.errors.budget?.contingencyPercentage}
              InputProps={{ endAdornment: '%' }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={!formik.isValid || !formik.dirty}
              >
                Save & Continue
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default InitialProjectInfo;
