/**
 * Storage utility for the password manager
 * Handles saving and retrieving encrypted data from localStorage
 */

// Key constants
const STORAGE_KEYS = {
    MASTER_PASSWORD_HASH: 'master_password_hash',
    SALT: 'master_password_salt',
    PASSWORDS: 'encrypted_passwords',
    USER_SETTINGS: 'encrypted_settings',
    INITIALIZED: 'app_initialized'
  };
  
  /**
   * Saves data to localStorage
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   */
  export const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      return false;
    }
  };
  
  /**
   * Retrieves data from localStorage
   * @param {string} key - Storage key
   * @param {boolean} parse - Whether to parse as JSON
   * @returns {any} - Retrieved data
   */
  export const getFromStorage = (key, parse = true) => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return parse ? JSON.parse(data) : data;
    } catch (error) {
      console.error('Error retrieving from storage:', error);
      return null;
    }
  };
  
  /**
   * Removes data from localStorage
   * @param {string} key - Storage key
   */
  export const removeFromStorage = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from storage:', error);
      return false;
    }
  };
  
  /**
   * Clears all application data from localStorage
   * Will completely reset the application state
   */
  export const clearAllData = () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  };
  
  /**
   * Checks if the app has been initialized (master password set)
   * @returns {boolean} - True if initialized
   */
  export const isAppInitialized = () => {
    return !!getFromStorage(STORAGE_KEYS.INITIALIZED, false);
  };
  
  /**
   * Marks the app as initialized after master password setup
   */
  export const markAppInitialized = () => {
    saveToStorage(STORAGE_KEYS.INITIALIZED, 'true');
  };
  
  /**
   * Saves the master password hash
   * @param {string} passwordHash - Hashed master password
   * @param {string} salt - Salt used for key derivation
   */
  export const saveMasterPasswordHash = (passwordHash, salt) => {
    saveToStorage(STORAGE_KEYS.MASTER_PASSWORD_HASH, passwordHash);
    saveToStorage(STORAGE_KEYS.SALT, salt);
    markAppInitialized();
  };
  
  /**
   * Gets the stored master password hash
   * @returns {string|null} - Stored password hash
   */
  export const getMasterPasswordHash = () => {
    return getFromStorage(STORAGE_KEYS.MASTER_PASSWORD_HASH, false);
  };
  
  /**
   * Gets the stored salt
   * @returns {string|null} - Stored salt
   */
  export const getSalt = () => {
    return getFromStorage(STORAGE_KEYS.SALT, false);
  };
  
  /**
   * Saves encrypted passwords
   * @param {string} encryptedData - Encrypted password data
   */
  export const savePasswords = (encryptedData) => {
    return saveToStorage(STORAGE_KEYS.PASSWORDS, encryptedData);
  };
  
  /**
   * Gets encrypted passwords
   * @returns {string|null} - Encrypted password data
   */
  export const getPasswords = () => {
    return getFromStorage(STORAGE_KEYS.PASSWORDS, false);
  };
  
  /**
   * Saves encrypted user settings
   * @param {string} encryptedSettings - Encrypted settings data
   */
  export const saveSettings = (encryptedSettings) => {
    return saveToStorage(STORAGE_KEYS.USER_SETTINGS, encryptedSettings);
  };
  
  /**
   * Gets encrypted user settings
   * @returns {string|null} - Encrypted settings data
   */
  export const getSettings = () => {
    return getFromStorage(STORAGE_KEYS.USER_SETTINGS, false);
  };
  
  export { STORAGE_KEYS };