import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  hashMasterPassword, 
  verifyMasterPassword, 
  deriveKey,
  generateSalt
} from '../utils/crypto';
import {
  isAppInitialized,
  getMasterPasswordHash,
  getSalt,
  saveMasterPasswordHash,
  markAppInitialized,
  clearAllData
} from '../utils/storage';

// Create the authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [masterKey, setMasterKey] = useState(null);
  const [error, setError] = useState(null);

  // Check if app is initialized on mount
  useEffect(() => {
    const checkInitialized = () => {
      const initialized = isAppInitialized();
      setIsInitialized(initialized);
      setIsLoading(false);
    };
    
    checkInitialized();
  }, []);

  // Setup master password for first time
  const setupMasterPassword = useCallback((password) => {
    try {
      // Generate a salt for the master password
      const salt = generateSalt();
      
      // Hash the master password for verification
      const passwordHash = hashMasterPassword(password);
      
      // Save the master password hash and salt
      saveMasterPasswordHash(passwordHash, salt);
      
      // Derive the encryption key
      const key = deriveKey(password, salt);
      setMasterKey(key);
      
      // Mark as initialized and authenticated
      markAppInitialized();
      setIsInitialized(true);
      setIsAuthenticated(true);
      setError(null);
      
      return true;
    } catch (error) {
      console.error('Error setting up master password:', error);
      setError('Failed to set up master password');
      return false;
    }
  }, []);

  // Login with master password
  const login = useCallback((password) => {
    try {
      // Get stored password hash and salt
      const storedHash = getMasterPasswordHash();
      const salt = getSalt();
      
      if (!storedHash || !salt) {
        setError('Application not properly initialized');
        return false;
      }
      
      // Verify the master password
      const isValid = verifyMasterPassword(password, storedHash);
      
      if (!isValid) {
        setError('Invalid master password');
        return false;
      }
      
      // Derive the encryption key
      const key = deriveKey(password, salt);
      setMasterKey(key);
      
      // Update authentication state
      setIsAuthenticated(true);
      setError(null);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in');
      return false;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setMasterKey(null);
  }, []);

  // Reset application (clear all data)
  const resetApp = useCallback(() => {
    try {
      clearAllData();
      setIsAuthenticated(false);
      setIsInitialized(false);
      setMasterKey(null);
      return true;
    } catch (error) {
      console.error('Error resetting app:', error);
      setError('Failed to reset application');
      return false;
    }
  }, []);

  // Change master password
  const changeMasterPassword = useCallback((currentPassword, newPassword) => {
    try {
      // First verify the current password
      const storedHash = getMasterPasswordHash();
      const isValid = verifyMasterPassword(currentPassword, storedHash);
      
      if (!isValid) {
        setError('Current password is incorrect');
        return false;
      }
      
      // Generate a new salt
      const newSalt = generateSalt();
      
      // Hash the new master password
      const newPasswordHash = hashMasterPassword(newPassword);
      
      // Save the new master password hash and salt
      saveMasterPasswordHash(newPasswordHash, newSalt);
      
      // Derive the new encryption key
      const newKey = deriveKey(newPassword, newSalt);
      setMasterKey(newKey);
      
      setError(null);
      return true;
    } catch (error) {
      console.error('Error changing master password:', error);
      setError('Failed to change master password');
      return false;
    }
  }, []);

  // Context value
  const contextValue = {
    isAuthenticated,
    isInitialized,
    isLoading,
    masterKey,
    error,
    setupMasterPassword,
    login,
    logout,
    resetApp,
    changeMasterPassword,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;