import { useContext } from 'react';
import PasswordContext from '../context/PasswordContext';

/**
 * Custom hook for password storage functionality
 * @returns {Object} Password storage methods and state
 */
const usePasswordStorage = () => {
  const context = useContext(PasswordContext);
  
  if (!context) {
    throw new Error('usePasswordStorage must be used within a PasswordProvider');
  }
  
  return context;
};

export default usePasswordStorage;