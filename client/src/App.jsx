import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "react-query";

// Layout components
import Layout from "./components/Layout/Layout";

// Page components
import Dashboard from "./pages/Dashboard";
import ProjectsList from "./pages/ProjectsList";
import ProjectDetail from "./pages/ProjectDetail";
import NewProject from "./pages/NewProject";
import NewDocument from "./pages/NewDocument";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Context
import { AuthProvider } from "./context/AuthContext";

// Services
import { checkAuthStatus } from "./services/authService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await checkAuthStatus();
        setIsAuthenticated(isLoggedIn);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;
    return children;
  };

  return (
    <AuthProvider value={{ isAuthenticated, setIsAuthenticated }}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/new" element={<NewProject />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route
            path="projects/:projectId/documents/new"
            element={<NewDocument />}
          />
          <Route path="documents/new" element={<NewDocument />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
