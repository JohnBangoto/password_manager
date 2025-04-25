/**
 * Validation utilities for the password manager
 */

/**
 * Validates master password requirements
 * @param {string} password - Master password to validate
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateMasterPassword = (password) => {
    if (!password || password.length < 8) {
      return {
        isValid: false,
        error: 'Master password must be at least 8 characters long'
      };
    }
  
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        error: 'Master password must contain at least one uppercase letter'
      };
    }
  
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        error: 'Master password must contain at least one lowercase letter'
      };
    }
  
    // Check for at least one number
    if (!/\d/.test(password)) {
      return {
        isValid: false,
        error: 'Master password must contain at least one number'
      };
    }
  
    // Check for at least one special character
    if (!/[^A-Za-z0-9]/.test(password)) {
      return {
        isValid: false,
        error: 'Master password must contain at least one special character'
      };
    }
  
    return {
      isValid: true,
      error: null
    };
  };
  
  /**
   * Validates password entry fields
   * @param {Object} passwordEntry - Password entry to validate
   * @returns {Object} - Validation result with isValid and errorFields
   */
  export const validatePasswordEntry = (passwordEntry) => {
    const errorFields = {};
  
    // Title validation
    if (!passwordEntry.title || passwordEntry.title.trim() === '') {
      errorFields.title = 'Title is required';
    }
  
    // URL validation (optional field, but if provided should be valid)
    if (passwordEntry.url && !isValidUrl(passwordEntry.url)) {
      errorFields.url = 'Please enter a valid URL';
    }
  
    // Username validation (optional)
    // No specific validation, can be empty
  
    // Password validation
    if (!passwordEntry.password || passwordEntry.password.trim() === '') {
      errorFields.password = 'Password is required';
    }
  
    return {
      isValid: Object.keys(errorFields).length === 0,
      errorFields
    };
  };
  
  /**
   * Checks if a string is a valid URL
   * @param {string} url - URL to validate
   * @returns {boolean} - Whether the URL is valid
   */
  export const isValidUrl = (url) => {
    try {
      // Use built-in URL constructor for validation
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  /**
   * Validates email format
   * @param {string} email - Email to validate
   * @returns {boolean} - Whether the email is valid
   */
  export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates hex color format (for tags/categories)
   * @param {string} color - Color code to validate
   * @returns {boolean} - Whether the color code is valid
   */
  export const isValidHexColor = (color) => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  };
  
  /**
   * Validates backup file format
   * @param {Object} data - Parsed backup data
   * @returns {boolean} - Whether the backup file format is valid
   */
  export const isValidBackupFile = (data) => {
    // Check if the backup has the required structure
    if (!data || typeof data !== 'object') return false;
    
    // Check for required keys
    if (!data.version || !data.encrypted || !data.salt) return false;
    
    // Validate version format (semantic versioning)
    if (!/^\d+\.\d+\.\d+$/.test(data.version)) return false;
    
    return true;
  };