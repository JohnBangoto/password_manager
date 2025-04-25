import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { encrypt, decrypt } from '../utils/crypto';
import { savePasswords, getPasswords } from '../utils/storage';
import { generateUUID } from '../utils/passwordUtils';
import AuthContext from './AuthContext';

// Create the password context
export const PasswordContext = createContext();

export const PasswordProvider = ({ children }) => {
  const { isAuthenticated, masterKey } = useContext(AuthContext);
  const [passwords, setPasswords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load passwords when authenticated
  useEffect(() => {
    const loadPasswords = async () => {
      if (isAuthenticated && masterKey) {
        try {
          setIsLoading(true);
          const encryptedData = getPasswords();
          
          if (encryptedData) {
            // Decrypt passwords with master key
            const decryptedData = decrypt(encryptedData, masterKey);
            setPasswords(decryptedData || []);
          } else {
            // No passwords stored yet
            setPasswords([]);
          }
          
          setError(null);
        } catch (error) {
          console.error('Error loading passwords:', error);
          setError('Failed to load passwords');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Not authenticated, clear passwords
        setPasswords([]);
        setIsLoading(false);
      }
    };
    
    loadPasswords();
  }, [isAuthenticated, masterKey]);

  // Save passwords to storage
  const savePasswordsToStorage = useCallback(async (updatedPasswords) => {
    try {
      if (!masterKey) {
        throw new Error('Master key not available');
      }
      
      // Encrypt passwords with master key
      const encryptedData = encrypt(updatedPasswords, masterKey);
      
      // Save to storage
      const saved = savePasswords(encryptedData);
      
      if (!saved) {
        throw new Error('Failed to save passwords');
      }
      
      setPasswords(updatedPasswords);
      setError(null);
      return true;
    } catch (error) {
      console.error('Error saving passwords:', error);
      setError('Failed to save passwords');
      return false;
    }
  }, [masterKey]);

  // Add a new password entry
  const addPassword = useCallback(async (passwordEntry) => {
    try {
      const newEntry = {
        id: generateUUID(),
        ...passwordEntry,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedPasswords = [...passwords, newEntry];
      const saved = await savePasswordsToStorage(updatedPasswords);
      return saved ? newEntry : null;
    } catch (error) {
      console.error('Error adding password:', error);
      setError('Failed to add password');
      return null;
    }
  }, [passwords, savePasswordsToStorage]);

  // Update an existing password entry
  const updatePassword = useCallback(async (id, updates) => {
    try {
      const passwordIndex = passwords.findIndex(p => p.id === id);
      
      if (passwordIndex === -1) {
        throw new Error('Password not found');
      }
      
      const updatedEntry = {
        ...passwords[passwordIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const updatedPasswords = [...passwords];
      updatedPasswords[passwordIndex] = updatedEntry;
      
      const saved = await savePasswordsToStorage(updatedPasswords);
      return saved ? updatedEntry : null;
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password');
      return null;
    }
  }, [passwords, savePasswordsToStorage]);

  // Delete a password entry
  const deletePassword = useCallback(async (id) => {
    try {
      const updatedPasswords = passwords.filter(p => p.id !== id);
      const saved = await savePasswordsToStorage(updatedPasswords);
      return saved;
    } catch (error) {
      console.error('Error deleting password:', error);
      setError('Failed to delete password');
      return false;
    }
  }, [passwords, savePasswordsToStorage]);

  // Get a password by ID
  const getPasswordById = useCallback((id) => {
    return passwords.find(p => p.id === id) || null;
  }, [passwords]);

  // Context value
  const contextValue = {
    passwords,
    isLoading,
    error,
    addPassword,
    updatePassword,
    deletePassword,
    getPasswordById,
    clearError: () => setError(null)
  };

  return (
    <PasswordContext.Provider value={contextValue}>
      {children}
    </PasswordContext.Provider>
  );
};

export default PasswordContext;