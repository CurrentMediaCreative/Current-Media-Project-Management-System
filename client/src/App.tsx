import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme';
import { AuthProvider, useAuth } from './features/auth/contexts/AuthContext';

// Layout & Features
import MainLayout from './components/layout/MainLayout';
import { LoginFlow } from './features/auth';
import { ProjectTracking } from './features/projects/tracking';
import { ProjectCreationFlow } from './features/projects/creation';
import { Dashboard } from './features/dashboard';

// Auth Guard Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/pms/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/pms/login" element={<LoginFlow />} />

      {/* Protected Routes */}
      <Route
        path="/pms/*"
        element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectTracking />} />
                <Route path="/projects/new" element={<ProjectCreationFlow />} />
              </Routes>
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
