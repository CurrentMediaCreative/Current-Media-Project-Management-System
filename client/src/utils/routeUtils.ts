import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../features/auth/contexts/AuthContext';
import { Dashboard } from '../features/dashboard';
import { ProjectTracking, ProjectPage } from '../features/projects/tracking';
import { ProjectCreationFlow } from '../features/projects/creation';
import { LoginFlow } from '../features/auth';

export interface RouteConfig {
  path: string;
  element: React.ComponentType<any>;
  guard?: boolean;
  title?: string;
  breadcrumb?: string;
}

export interface RouteElement {
  path: string;
  element: JSX.Element;
}

// Base routes configuration
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: Dashboard,
    guard: true,
    title: 'Dashboard',
    breadcrumb: 'Dashboard'
  },
  {
    path: '/dashboard',
    element: Dashboard,
    guard: true,
    title: 'Dashboard',
    breadcrumb: 'Dashboard'
  },
  {
    path: '/projects',
    element: ProjectTracking,
    guard: true,
    title: 'Projects',
    breadcrumb: 'Projects'
  },
  {
    path: '/projects/new',
    element: ProjectCreationFlow,
    guard: true,
    title: 'New Project',
    breadcrumb: 'New Project'
  },
  {
    path: '/projects/:id',
    element: ProjectPage,
    guard: true,
    title: 'Project Details',
    breadcrumb: 'Project Details'
  }
];

// Public routes that don't require authentication
export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    element: LoginFlow,
    title: 'Login',
    breadcrumb: 'Login'
  }
];

// Helper to get route path with base prefix
export const getRoutePath = (path: string): string => path.startsWith('/pms') ? path : `/pms${path}`;

// Helper to get route by path
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  const normalizedPath = path.startsWith('/pms') ? path.slice(4) : path;
  return [...routes, ...publicRoutes].find(route => route.path === normalizedPath);
};

// Helper to get breadcrumb items for a route
export const getBreadcrumbItems = (path: string): Array<{ title: string; path: string }> => {
  const parts = path.split('/').filter(Boolean);
  const items: Array<{ title: string; path: string }> = [];
  let currentPath = '';

  // Always start with home
  items.push({
    title: 'Home',
    path: getRoutePath('/')
  });

  for (const part of parts) {
    if (part === 'pms') continue;
    currentPath += `/${part}`;
    const route = getRouteByPath(currentPath);
    if (route) {
      items.push({
        title: route.breadcrumb || route.title || part,
        path: getRoutePath(currentPath)
      });
    } else if (part.match(/^[0-9a-fA-F-]+$/)) {
      // Handle dynamic project IDs
      items.push({
        title: 'Project Details',
        path: getRoutePath(currentPath)
      });
    } else {
      // Handle project names
      items.push({
        title: decodeURIComponent(part),
        path: getRoutePath(currentPath)
      });
    }
  }

  return items;
};

interface ProtectedRouteProps {
  children: React.ReactElement;
}

// Protected route wrapper component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return React.createElement(Navigate, { to: getRoutePath('/login'), replace: true });
  }
  return children;
};

// Generate routes for React Router
export const getRouteElements = (): RouteElement[] => {
  const publicElements = publicRoutes.map(route => ({
    path: getRoutePath(route.path),
    element: React.createElement(route.element)
  }));

  const protectedElements = routes.map(route => ({
    path: getRoutePath(route.path),
    element: React.createElement(ProtectedRoute, {
      children: React.createElement(route.element)
    })
  }));

  return [...publicElements, ...protectedElements];
};
