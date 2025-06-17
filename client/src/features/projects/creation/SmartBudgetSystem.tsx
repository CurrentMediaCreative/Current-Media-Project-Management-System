import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface BudgetScenario {
  name: string;
  totalCost: number;
  profitMargin: number;
  riskLevel: 'low' | 'medium' | 'high';
  breakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

interface SmartBudgetSystemProps {
  onComplete: (data: {
    selectedScenario: BudgetScenario;
    profitTarget: number;
    contingencyPercentage: number;
  }) => void;
  initialData?: {
    estimatedBudget?: number;
    timeframe?: { startDate: string; endDate: string };
  };
}

const validationSchema = Yup.object({
  profitTarget: Yup.number()
    .min(0, 'Profit target cannot be negative')
    .required('Profit target is required'),
  contingencyPercentage: Yup.number()
    .min(0, 'Contingency percentage cannot be negative')
    .max(100, 'Contingency percentage cannot exceed 100')
    .required('Contingency percentage is required')
});

const SmartBudgetSystem: React.FC<SmartBudgetSystemProps> = ({ onComplete, initialData }) => {
  const [selectedScenario, setSelectedScenario] = useState<BudgetScenario | null>(null);
  const [scenarios, setScenarios] = useState<BudgetScenario[]>([
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

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Typography variant="h5" gutterBottom>Smart Budget System</Typography>
      
      <Grid container spacing={3}>
        {/* Budget Scenarios */}
        <Grid item xs={12}>
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
        </Grid>

        {/* Cost Breakdown */}
        {selectedScenario && (
          <Grid item xs={12}>
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
          </Grid>
        )}

        {/* Profit Settings */}
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

        {/* Summary */}
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

        {/* Submit Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={!selectedScenario || !formik.isValid}
            >
              Save & Continue
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SmartBudgetSystem;
