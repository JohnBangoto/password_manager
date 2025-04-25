/**
 * Utility functions for password management
 */

/**
 * Generates a random password
 * @param {number} length - Password length
 * @param {boolean} includeUppercase - Include uppercase letters
 * @param {boolean} includeLowercase - Include lowercase letters
 * @param {boolean} includeNumbers - Include numbers
 * @param {boolean} includeSymbols - Include special symbols
 * @returns {string} - Generated password
 */
export const generatePassword = (
    length = 16,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true
  ) => {
    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
    // Create character pool based on options
    let charPool = '';
    if (includeUppercase) charPool += uppercaseChars;
    if (includeLowercase) charPool += lowercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;
  
    // Default to lowercase if nothing selected
    if (!charPool) charPool = lowercaseChars;
  
    // Generate password
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      password += charPool[randomIndex];
    }
  
    // Ensure at least one character from each selected set
    const ensureInclusion = [];
    if (includeUppercase) ensureInclusion.push(getRandomChar(uppercaseChars));
    if (includeLowercase) ensureInclusion.push(getRandomChar(lowercaseChars));
    if (includeNumbers) ensureInclusion.push(getRandomChar(numberChars));
    if (includeSymbols) ensureInclusion.push(getRandomChar(symbolChars));
  
    // Replace random positions with these characters
    ensureInclusion.forEach(char => {
      const pos = Math.floor(Math.random() * password.length);
      password = password.substring(0, pos) + char + password.substring(pos + 1);
    });
  
    return password;
  };
  
  /**
   * Gets a random character from a string
   * @param {string} charSet - Character set
   * @returns {string} - Random character
   */
  const getRandomChar = (charSet) => {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet[randomIndex];
  };
  
  /**
   * Calculates password strength score (0-100)
   * @param {string} password - Password to evaluate
   * @returns {number} - Strength score (0-100)
   */
  export const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let score = 0;
    const length = password.length;
    
    // Length score (max: 30)
    score += Math.min(30, length * 2);
    
    // Character variety score (max: 40)
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    
    score += hasLower ? 10 : 0;
    score += hasUpper ? 10 : 0;
    score += hasNumber ? 10 : 0;
    score += hasSymbol ? 10 : 0;
    
    // Complexity score (max: 30)
    const uniqueChars = new Set(password).size;
    const uniqueRatio = uniqueChars / length;
    score += Math.min(30, Math.floor(uniqueRatio * 30));
    
    // Penalties
    // Sequential characters
    const sequentialPenalty = countSequentialChars(password) * 2;
    score -= Math.min(20, sequentialPenalty);
    
    // Repeated characters
    const repeatedPenalty = countRepeatedChars(password) * 2;
    score -= Math.min(20, repeatedPenalty);
    
    return Math.max(0, Math.min(100, Math.floor(score)));
  };
  
  /**
   * Counts sequential characters in password
   * @param {string} password - Password to analyze
   * @returns {number} - Count of sequential characters
   */
  const countSequentialChars = (password) => {
    let count = 0;
    const passwordLower = password.toLowerCase();
    
    for (let i = 0; i < passwordLower.length - 2; i++) {
      // Check for alphabetical sequence
      if (
        isNaN(passwordLower[i]) &&
        isNaN(passwordLower[i+1]) &&
        isNaN(passwordLower[i+2])
      ) {
        if (
          passwordLower.charCodeAt(i+1) === passwordLower.charCodeAt(i) + 1 &&
          passwordLower.charCodeAt(i+2) === passwordLower.charCodeAt(i) + 2
        ) {
          count++;
        }
      }
      
      // Check for numerical sequence
      if (
        !isNaN(passwordLower[i]) &&
        !isNaN(passwordLower[i+1]) &&
        !isNaN(passwordLower[i+2])
      ) {
        if (
          parseInt(passwordLower[i+1]) === parseInt(passwordLower[i]) + 1 &&
          parseInt(passwordLower[i+2]) === parseInt(passwordLower[i]) + 2
        ) {
          count++;
        }
      }
    }
    
    return count;
  };
  
  /**
   * Counts repeated characters in password
   * @param {string} password - Password to analyze
   * @returns {number} - Count of repeated characters
   */
  const countRepeatedChars = (password) => {
    let count = 0;
    
    for (let i = 0; i < password.length - 2; i++) {
      if (
        password[i] === password[i+1] &&
        password[i] === password[i+2]
      ) {
        count++;
      }
    }
    
    return count;
  };
  
  /**
   * Classifies password strength
   * @param {number} score - Strength score (0-100)
   * @returns {Object} - Strength classification with text and color
   */
  export const getPasswordStrengthLabel = (score) => {
    if (score < 20) {
      return { text: 'Very Weak', color: 'red' };
    } else if (score < 40) {
      return { text: 'Weak', color: 'orange' };
    } else if (score < 60) {
      return { text: 'Medium', color: 'yellow' };
    } else if (score < 80) {
      return { text: 'Strong', color: 'light-green' };
    } else {
      return { text: 'Very Strong', color: 'green' };
    }
  };
  
  /**
   * Check if a password has been exposed in data breaches
   * 
   * Note: This requires an API call to a service like "Have I Been Pwned"
   * For local-only implementation, this function will return a placeholder
   * 
   * @param {string} password - Password to check
   * @returns {Promise<boolean>} - Whether the password was found in breaches
   */
  export const checkPasswordBreaches = async (password) => {
    // In a full implementation, this would call an API
    // For a local-only application, we'll return false
    return Promise.resolve(false);
  };
  
  /**
   * Generate a UUID for password entries
   * @returns {string} - Generated UUID
   */
  export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };