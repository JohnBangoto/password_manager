import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePasswords } from '../context/PasswordContext';
import './PasswordGenerator.css';

function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  });
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { updatePassword } = usePasswords();

  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  const returnTo = queryParams.get('returnTo');
  const id = queryParams.get('id');

  // Generate password when component mounts or config changes
  useEffect(() => {
    generatePassword();
  }, [config]);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setStrength(0);
      return;
    }

    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character variety check
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Normalize score to a 0-100 scale
    setStrength(Math.min(100, Math.floor(score / 7 * 100)));
  }, [password]);

  const generatePassword = () => {
    const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = config;
    let charset = '';
    
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()-_=+[]{}|;:,.<>?';
    
    // Ensure at least one character set is selected
    if (!charset) {
      setPassword('');
      return;
    }
    
    let newPassword = '';
    const charsetLength = charset.length;
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charsetLength);
      newPassword += charset[randomIndex];
    }
    
    setPassword(newPassword);
    setCopied(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value, 10)
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  const usePassword = () => {
    if (returnTo === 'add') {
      // Return to add password form with the generated password
      navigate('/dashboard/add', { state: { generatedPassword: password } });
    } else if (returnTo === 'edit' && id) {
      // Update the password and return to edit form
      updatePassword(id, { password });
      navigate(`/dashboard/edit/${id}`);
    } else {
      // Just copy to clipboard if no specific return action
      copyToClipboard();
    }
  };

  const getStrengthLabel = () => {
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength < 25) return '#ff4d4d'; // Red
    if (strength < 50) return '#ffaa00'; // Orange
    if (strength < 75) return '#ffdd00'; // Yellow
    return '#00cc44'; // Green
  };

  return (
    <div className="password-generator-container">
      <h2>Password Generator</h2>
      
      <div className="generated-password-container">
        <div className="generated-password">
          {password || 'Generate a password'}
        </div>
        <div className="password-actions">
          <button 
            className="refresh-button" 
            onClick={generatePassword}
            title="Generate new password"
          >
            Refresh
          </button>
          <button 
            className="copy-button" 
            onClick={copyToClipboard}
            disabled={!password}
            title="Copy to clipboard"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      
      {password && (
        <div className="password-strength">
          <div className="strength-label">
            Strength: <span style={{ color: getStrengthColor() }}>{getStrengthLabel()}</span>
          </div>
          <div className="strength-meter">
            <div 
              className="strength-meter-bar" 
              style={{ 
                width: `${strength}%`,
                backgroundColor: getStrengthColor()
              }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="password-options">
        <h3>Options</h3>
        
        <div className="form-group">
          <label htmlFor="length">Length: {config.length}</label>
          <input
            type="range"
            id="length"
            name="length"
            min="8"
            max="32"
            value={config.length}
            onChange={handleInputChange}
          />
          <span className="range-value">{config.length}</span>
        </div>
        
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="includeUppercase"
              name="includeUppercase"
              checked={config.includeUppercase}
              onChange={handleInputChange}
            />
            <label htmlFor="includeUppercase">Include Uppercase (A-Z)</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="includeLowercase"
              name="includeLowercase"
              checked={config.includeLowercase}
              onChange={handleInputChange}
            />
            <label htmlFor="includeLowercase">Include Lowercase (a-z)</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="includeNumbers"
              name="includeNumbers"
              checked={config.includeNumbers}
              onChange={handleInputChange}
            />
            <label htmlFor="includeNumbers">Include Numbers (0-9)</label>
          </div>
          
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="includeSymbols"
              name="includeSymbols"
              checked={config.includeSymbols}
              onChange={handleInputChange}
            />
            <label htmlFor="includeSymbols">Include Symbols (!@#$%^&*)</label>
          </div>
        </div>
      </div>
      
      <div className="generator-actions">
        {returnTo && (
          <button className="use-password-button" onClick={usePassword}>
            Use This Password
          </button>
        )}
        {!returnTo && (
          <button 
            className="back-button" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

export default PasswordGenerator;