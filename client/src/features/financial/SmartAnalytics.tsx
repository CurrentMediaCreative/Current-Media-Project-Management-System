import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress, 
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsData } from '../types';

const SmartAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const analyticsData = await analyticsService.getAnalyticsData();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

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
        <Alert severity="info">No analytics data available</Alert>
      </Box>
    );
  }

  const renderBudgetVariance = (variance: number) => {
    const isPositive = variance >= 0;
    return (
      <Box display="flex" alignItems="center">
        {isPositive ? (
          <TrendingUpIcon color="error" />
        ) : (
          <TrendingDownIcon color="success" />
        )}
        <Typography 
          color={isPositive ? 'error.main' : 'success.main'}
          sx={{ ml: 1 }}
        >
          {Math.abs(variance).toFixed(2)}%
        </Typography>
      </Box>
    );
  };

  const renderPerformanceIndicator = (value: number, threshold: number) => (
    <Box display="flex" alignItems="center">
      {value >= threshold ? (
        <CheckCircleIcon color="success" />
      ) : (
        <WarningIcon color="warning" />
      )}
      <Typography sx={{ ml: 1 }}>{value.toFixed(1)}%</Typography>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Smart Analytics</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Estimate vs Actual</Typography>
            {data.projects.map((project, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">{project.project.title}</Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>Budget Variance:</Typography>
                  {renderBudgetVariance(project.budgetVariance.percentage)}
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Team Performance</Typography>
            {data.teamPerformance.map((metric, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">{metric.contractor.name}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>On-Time Delivery:</Typography>
                    {renderPerformanceIndicator(metric.onTimeDelivery, 80)}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Budget Adherence:</Typography>
                    {renderPerformanceIndicator(100 - Math.abs(metric.averageBudgetVariance), 85)}
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Profit Trends by Producer</Typography>
            {data.profitTrends.map((trend, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">{trend.producer}</Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>Profit Margin:</Typography>
                  <Typography>{trend.profitMargin.toFixed(1)}%</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>Projects:</Typography>
                  <Typography>{trend.projects}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Project Timeline Analysis</Typography>
            {data.projects.map((project, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">{project.project.title}</Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>Timeline Variance:</Typography>
                  <Typography>
                    {project.timeline.variance > 0 ? '+' : ''}
                    {project.timeline.variance} days
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recommendations</Typography>
            <List>
              {data.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {rec.impact === 'high' ? (
                      <WarningIcon color="error" />
                    ) : rec.impact === 'medium' ? (
                      <WarningIcon color="warning" />
                    ) : (
                      <WarningIcon color="info" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={rec.title}
                    secondary={rec.description}
                  />
                  <Chip 
                    label={rec.type} 
                    size="small"
                    color={rec.impact === 'high' ? 'error' : 'default'}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SmartAnalytics;
