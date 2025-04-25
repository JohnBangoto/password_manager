import CryptoJS from 'crypto-js';

/**
 * Encrypts data using AES encryption with the master password
 * @param {any} data - Data to encrypt (will be stringified)
 * @param {string} masterPassword - Master password used as encryption key
 * @returns {string} - Encrypted string
 */
export const encrypt = (data, masterPassword) => {
  try {
    const dataString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(dataString, masterPassword).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypts data using AES encryption with the master password
 * @param {string} encryptedData - Encrypted string to decrypt
 * @param {string} masterPassword - Master password used as decryption key
 * @returns {any} - Decrypted data (parsed from JSON)
 */
export const decrypt = (encryptedData, masterPassword) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, masterPassword);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      throw new Error('Invalid master password');
    }
    
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data. Verify your master password.');
  }
};

/**
 * Securely hashes the master password for verification purposes
 * @param {string} masterPassword - The password to hash
 * @returns {string} - Password hash
 */
export const hashMasterPassword = (masterPassword) => {
  return CryptoJS.SHA256(masterPassword).toString();
};

/**
 * Verifies if the provided master password is correct
 * @param {string} inputPassword - Password to verify
 * @param {string} storedHash - Stored hash to compare against
 * @returns {boolean} - True if password matches
 */
export const verifyMasterPassword = (inputPassword, storedHash) => {
  const inputHash = hashMasterPassword(inputPassword);
  return inputHash === storedHash;
};

/**
 * Derives a key from the master password using PBKDF2
 * @param {string} masterPassword - Master password
 * @param {string} salt - Salt for key derivation
 * @returns {string} - Derived key
 */
export const deriveKey = (masterPassword, salt) => {
  return CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256 / 32,
    iterations: 10000
  }).toString();
};

/**
 * Generates a random salt
 * @returns {string} - Random salt
 */
export const generateSalt = () => {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
};