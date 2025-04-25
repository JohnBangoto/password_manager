import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Components
import Login from '../components/Auth/Login';
import SetupMasterPassword from '../components/Auth/SetupMasterPassword';
import Dashboard from '../components/Dashboard/Dashboard';
import PasswordList from '../components/PasswordList/PasswordList';
import PasswordDetails from '../components/PasswordList/PasswordDetails';
import AddPassword from '../components/PasswordForm/AddPassword';
import EditPassword from '../components/PasswordForm/EditPassword';
import PasswordGenerator from '../components/PasswordGenerator/PasswordGenerator';
import Settings from '../components/Settings/Settings';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Initial setup route component
const InitialSetupRoute = ({ children }) => {
  const { isInitialized } = useAuth();
  
  if (isInitialized) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Authentication route component
const AuthRoute = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  
  if (!isInitialized) {
    return <Navigate to="/setup" replace />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Authentication routes */}
        <Route 
          path="/setup" 
          element={
            <InitialSetupRoute>
              <SetupMasterPassword />
            </InitialSetupRoute>
          } 
        />
        
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/passwords" 
          element={
            <ProtectedRoute>
              <PasswordList />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/passwords/:id" 
          element={
            <ProtectedRoute>
              <PasswordDetails />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/add-password" 
          element={
            <ProtectedRoute>
              <AddPassword />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/edit-password/:id" 
          element={
            <ProtectedRoute>
              <EditPassword />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/generator" 
          element={
            <ProtectedRoute>
              <PasswordGenerator />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;