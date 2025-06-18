import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import LoginForm from './LoginForm';
import { User } from '../../shared/types';
import { useNavigate } from 'react-router-dom';

interface LoginFlowProps {
  onLogin?: (user: User) => void;
  redirectTo?: string;
}

const LoginFlow: React.FC<LoginFlowProps> = ({ onLogin, redirectTo = '/' }) => {
  const navigate = useNavigate();

  const handleLogin = async (user: User) => {
    try {
      if (onLogin) {
        onLogin(user);
      } else {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 4 }}>
        <LoginForm onSubmit={handleLogin} />
      </Paper>
    </Box>
  );
};

export default LoginFlow;
