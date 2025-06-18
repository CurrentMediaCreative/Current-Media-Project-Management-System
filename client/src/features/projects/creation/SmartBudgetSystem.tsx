import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { BudgetScenario, SmartBudgetSystemProps } from './types';

const validationSchema = Yup.object({
  profitTarget: Yup.number()
    .min(0, 'Profit target cannot be negative')
    .required('Profit target is required'),
  contingencyPercentage: Yup.number()
    .min(0, 'Contingency percentage cannot be negative')
    .max(100, 'Contingency percentage cannot exceed 100')
    .required('Contingency percentage is required')
});

const SmartBudgetSystem: React.FC<SmartBudgetSystemProps> = ({ 
  onComplete, 
  initialData,
  errors,
  loading,
  onBack
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedScenario, setSelectedScenario] = useState<BudgetScenario | null>(null);
  const [analyzedScope, setAnalyzedScope] = useState<string | null>(null);
  const [teamSuggestions, setTeamSuggestions] = useState<Array<{ role: string, reason: string }>>([]);
  const [scenarios] = useState<BudgetScenario[]>([
    {
      name: 'Basic Package',
      totalCost: initialData?.estimatedBudget ? initialData.estimatedBudget * 0.8 : 10000,
      profitMargin: 15,
      riskLevel: 'low',
      breakdown: [
        { category: 'Labor', amount: 6000, percentage: 60 },
        { category: 'Equipment', amount: 2000, percentage: 20 },
        { category: 'Software', amount: 1000, percentage: 10 },
        { category: 'Miscellaneous', amount: 1000, percentage: 10 }
      ]
    },
    {
      name: 'Standard Package',
      totalCost: initialData?.estimatedBudget || 15000,
      profitMargin: 20,
      riskLevel: 'medium',
      breakdown: [
        { category: 'Labor', amount: 9000, percentage: 60 },
        { category: 'Equipment', amount: 3000, percentage: 20 },
        { category: 'Software', amount: 1500, percentage: 10 },
        { category: 'Miscellaneous', amount: 1500, percentage: 10 }
      ]
    },
    {
      name: 'Premium Package',
      totalCost: initialData?.estimatedBudget ? initialData.estimatedBudget * 1.2 : 20000,
      profitMargin: 25,
      riskLevel: 'high',
      breakdown: [
        { category: 'Labor', amount: 12000, percentage: 60 },
        { category: 'Equipment', amount: 4000, percentage: 20 },
        { category: 'Software', amount: 2000, percentage: 10 },
        { category: 'Miscellaneous', amount: 2000, percentage: 10 }
      ]
    }
  ]);

  const steps = [
    { label: 'Analyze Scope', description: 'Analyzing project requirements and deliverables' },
    { label: 'AI Team Suggestions', description: 'Getting AI-powered team composition recommendations' },
    { label: 'Multiple Scenarios', description: 'Exploring different budget scenarios' },
    { label: 'Profit Margin Calculator', description: 'Calculating optimal profit margins' },
    { label: 'Confirm Team', description: 'Finalizing team composition' }
  ];

  const formik = useFormik({
    initialValues: {
      profitTarget: 20,
      contingencyPercentage: 10
    },
    validationSchema,
    onSubmit: (values) => {
      if (selectedScenario) {
        onComplete({
          selectedScenario,
          profitTarget: values.profitTarget,
          contingencyPercentage: values.contingencyPercentage
        });
      }
    }
  });

  const handleStepNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleStepBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // Simulated scope analysis
  useEffect(() => {
    if (activeStep === 0 && !analyzedScope && initialData?.timeframe) {
      const projectDuration = Math.ceil(
        (new Date(initialData.timeframe.endDate).getTime() - 
         new Date(initialData.timeframe.startDate).getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      
      setAnalyzedScope(
        `Based on the project timeframe of ${projectDuration} days and the provided requirements, ` +
        `this appears to be a ${projectDuration <= 30 ? 'small' : projectDuration <= 90 ? 'medium' : 'large'}-scale project ` +
        `that will require careful resource allocation and timeline management.`
      );
    }
  }, [activeStep, analyzedScope, initialData]);

  // Simulated AI team suggestions
  useEffect(() => {
    if (activeStep === 1 && teamSuggestions.length === 0) {
      setTeamSuggestions([
        { role: 'Senior Producer', reason: 'Project complexity requires experienced leadership' },
        { role: 'Lead Cinematographer', reason: 'High-quality visual content requirements' },
        { role: 'Sound Engineer', reason: 'Professional audio capture and processing needed' },
        { role: 'Editor', reason: 'Post-production expertise required' }
      ]);
    }
  }, [activeStep, teamSuggestions]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Scope Analysis</Typography>
            {analyzedScope ? (
              <Typography>{analyzedScope}</Typography>
            ) : (
              <Typography color="text.secondary">Analyzing project scope...</Typography>
            )}
          </Paper>
        );
      
      case 1:
        return (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>AI Team Suggestions</Typography>
            <Grid container spacing={2}>
              {teamSuggestions.map((suggestion, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" color="primary">{suggestion.role}</Typography>
                    <Typography variant="body2">{suggestion.reason}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        );
      
      case 2:
        return (
          <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Budget Scenarios</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Package</TableCell>
                      <TableCell align="right">Total Cost</TableCell>
                      <TableCell align="right">Profit Margin</TableCell>
                      <TableCell align="right">Risk Level</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scenarios.map((scenario) => (
                      <TableRow
                        key={scenario.name}
                        selected={selectedScenario?.name === scenario.name}
                        hover
                      >
                        <TableCell>{scenario.name}</TableCell>
                        <TableCell align="right">${scenario.totalCost.toLocaleString()}</TableCell>
                        <TableCell align="right">{scenario.profitMargin}%</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={scenario.riskLevel.toUpperCase()}
                            color={getRiskColor(scenario.riskLevel) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant={selectedScenario?.name === scenario.name ? "contained" : "outlined"}
                            size="small"
                            onClick={() => setSelectedScenario(scenario)}
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {selectedScenario && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Cost Breakdown</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedScenario.breakdown.map((item) => (
                        <TableRow key={item.category}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell align="right">${item.amount.toLocaleString()}</TableCell>
                          <TableCell align="right">{item.percentage}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Profit Settings</Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>Target Profit Margin (%)</Typography>
                  <Slider
                    name="profitTarget"
                    value={formik.values.profitTarget}
                    onChange={(_, value) => formik.setFieldValue('profitTarget', value)}
                    min={0}
                    max={50}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 25, label: '25%' },
                      { value: 50, label: '50%' }
                    ]}
                  />
                </Box>
                <Box>
                  <Typography gutterBottom>Contingency Percentage (%)</Typography>
                  <Slider
                    name="contingencyPercentage"
                    value={formik.values.contingencyPercentage}
                    onChange={(_, value) => formik.setFieldValue('contingencyPercentage', value)}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' }
                    ]}
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Summary</Typography>
                {selectedScenario ? (
                  <>
                    <Typography variant="body1">
                      Total Cost: ${selectedScenario.totalCost.toLocaleString()}
                    </Typography>
                    <Typography variant="body1">
                      Target Profit: ${(selectedScenario.totalCost * (formik.values.profitTarget / 100)).toLocaleString()}
                    </Typography>
                    <Typography variant="body1">
                      Contingency: ${(selectedScenario.totalCost * (formik.values.contingencyPercentage / 100)).toLocaleString()}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Final Price: ${(
                        selectedScenario.totalCost +
                        (selectedScenario.totalCost * (formik.values.profitTarget / 100)) +
                        (selectedScenario.totalCost * (formik.values.contingencyPercentage / 100))
                      ).toLocaleString()}
                    </Typography>
                  </>
                ) : (
                  <Typography color="text.secondary">
                    Select a budget scenario to see the summary
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Team Confirmation</Typography>
            <Grid container spacing={2}>
              {teamSuggestions.map((suggestion, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" color="primary">{suggestion.role}</Typography>
                    <Typography variant="body2" gutterBottom>{suggestion.reason}</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label="Confirmed" color="success" />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Typography variant="h5" gutterBottom>Smart Budget System</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent()}

      {errors && Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Please fix the following errors:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={activeStep === 0 ? onBack : handleStepBack}
          disabled={loading}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!selectedScenario || !formik.isValid || loading}
          >
            Complete
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleStepNext}
            disabled={
              (activeStep === 2 && !selectedScenario) || 
              (activeStep === 3 && !formik.isValid) ||
              loading
            }
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SmartBudgetSystem;
