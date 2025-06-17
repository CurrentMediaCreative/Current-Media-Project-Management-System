import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme';
import { AuthProvider, useAuth } from './features/auth/contexts/AuthContext';

// Layout & Pages
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { ProjectTracking as ProjectTrackingPage } from './features/projects/tracking';
import { ProjectCreationFlow as ProjectCreationPage } from './features/projects/creation';

// Auth Guard Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/projects" element={<ProjectTrackingPage />} />
                <Route path="/projects/new" element={<ProjectCreationPage />} />
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
