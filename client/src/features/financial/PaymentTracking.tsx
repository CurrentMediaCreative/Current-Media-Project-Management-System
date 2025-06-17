import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Tabs, 
  Tab, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { InvoiceStatus } from '../../../../../shared/src/types';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsData } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const PaymentTracking: React.FC = () => {
  const [value, setValue] = useState(0);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const analyticsData = await analyticsService.getAnalyticsData();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payment data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'active':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box>
        <Alert severity="info">No payment data available</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Payment Tracking</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Client Payments" />
          <Tab label="Contractor Payments" />
          <Tab label="Profit Analysis" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Project</TableCell>
                      <TableCell>Invoice Amount</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.projects.map((project) => (
                      <TableRow key={project.project.id}>
                        <TableCell>{project.project.title}</TableCell>
                        <TableCell>${project.budgetVariance.actual.toFixed(2)}</TableCell>
                        <TableCell>
                          {new Date(project.project.timeframe.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={project.project.status}
                            color={getStatusColor(project.project.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Contractor</TableCell>
                      <TableCell>Rate</TableCell>
                      <TableCell>Projects</TableCell>
                      <TableCell>Total Due</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.teamPerformance.map((metric) => (
                      <TableRow key={metric.contractor.email}>
                        <TableCell>{metric.contractor.name}</TableCell>
                        <TableCell>${metric.contractor.chargeOutRate}/hr</TableCell>
                        <TableCell>{metric.projectsCompleted}</TableCell>
                        <TableCell>
                          ${(metric.projectsCompleted * metric.contractor.chargeOutRate * 8).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">
                            Process Payment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Grid container spacing={3}>
          {data.profitTrends.map((trend, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>{trend.producer}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                    <Typography variant="h6">
                      ${trend.totalRevenue.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Cost
                    </Typography>
                    <Typography variant="h6">
                      ${trend.totalCost.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Profit Margin
                    </Typography>
                    <Typography variant="h6" color={
                      trend.profitMargin >= 20 ? 'success.main' : 'error.main'
                    }>
                      {trend.profitMargin.toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Projects
                    </Typography>
                    <Typography variant="h6">
                      {trend.projects}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default PaymentTracking;
