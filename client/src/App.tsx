import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import { getRouteElements } from './utils/routeUtils';

const App = () => {
  const routes = getRouteElements();
  
  return (
    <Provider store={store}>
      <Router basename="/pms">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <MainLayout>
              <Routes>
                {routes.map((route) => (
                  <Route 
                    key={route.path} 
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
            </MainLayout>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
