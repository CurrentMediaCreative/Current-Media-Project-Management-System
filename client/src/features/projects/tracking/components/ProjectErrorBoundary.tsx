import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ProjectErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Project component error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="400px"
          p={3}
        >
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {this.state.error?.message || 'An unexpected error occurred while loading the project.'}
            </Typography>
          </Alert>
          
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={this.handleRetry}
          >
            Retry
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ProjectErrorBoundary;
