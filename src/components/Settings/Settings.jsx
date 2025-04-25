import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

function Settings() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [exportFormat, setExportFormat] = useState('json');
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [isExportVisible, setIsExportVisible] = useState(false);
  const [isDataManagementVisible, setIsDataManagementVisible] = useState(false);

  const { changePassword, logout } = useAuth();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeMasterPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate input
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      setSuccessMessage('Master password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to change master password');
    }
  };

  const handleExportData = () => {
    try {
      // The actual export functionality would need to decrypt and format data
      // This is a placeholder to show the concept
      
      const data = localStorage.getItem('passwordVault');
      if (!data) {
        setError('No data available to export');
        return;
      }
      
      // In a real implementation, you would decrypt the data here
      // and format according to the selected export format
      
      // Create a download link for the file
      const element = document.createElement('a');
      const file = new Blob([data], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `password-manager-export.${exportFormat}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      setSuccessMessage('Data exported successfully');
    } catch (err) {
      setError('Failed to export data: ' + err.message);
    }
  };

  const handleDeleteAllData = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete all your password data? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      try {
        // Remove all data from localStorage
        localStorage.removeItem('passwordVault');
        localStorage.removeItem('masterPasswordHash');
        
        setSuccessMessage('All data deleted successfully. You will be logged out in 3 seconds.');
        
        // Log the user out after a delay
        setTimeout(() => {
          logout();
        }, 3000);
      } catch (err) {
        setError('Failed to delete data: ' + err.message);
      }
    }
  };

  const toggleSection = (section) => {
    switch(section) {
      case 'password':
        setIsChangePasswordVisible(!isChangePasswordVisible);
        break;
      case 'export':
        setIsExportVisible(!isExportVisible);
        break;
      case 'data':
        setIsDataManagementVisible(!isDataManagementVisible);
        break;
      default:
        break;
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="settings-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('password')}
        >
          <h3>Change Master Password</h3>
          <span className="toggle-icon">{isChangePasswordVisible ? '▼' : '►'}</span>
        </div>
        
        {isChangePasswordVisible && (
          <form onSubmit={handleChangeMasterPassword} className="password-change-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Master Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Master Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="password-requirements">
              <p>Your master password should be:</p>
              <ul>
                <li>At least 8 characters long</li>
                <li>Include a mix of letters, numbers, and symbols</li>
                <li>Something you can remember but others cannot guess</li>
              </ul>
            </div>
            
            <button type="submit" className="change-password-button">
              Update Master Password
            </button>
          </form>
        )}
      </div>
      
      <div className="settings-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('export')}
        >
          <h3>Export Data</h3>
          <span className="toggle-icon">{isExportVisible ? '▼' : '►'}</span>
        </div>
        
        {isExportVisible && (
          <div className="export-section">
            <p className="warning-text">
              Warning: Exported data will contain your passwords in plaintext format.
              Keep the exported file secure and delete it when no longer needed.
            </p>
            
            <div className="form-group">
              <label htmlFor="exportFormat">Export Format</label>
              <select
                id="exportFormat"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="txt">TXT</option>
              </select>
            </div>
            
            <button onClick={handleExportData} className="export-button">
              Export All Passwords
            </button>
          </div>
        )}
      </div>
      
      <div className="settings-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('data')}
        >
          <h3>Data Management</h3>
          <span className="toggle-icon">{isDataManagementVisible ? '▼' : '►'}</span>
        </div>
        
        {isDataManagementVisible && (
          <div className="data-management-section">
            <div className="danger-zone">
              <h4>Danger Zone</h4>
              <p className="warning-text">
                The following actions are irreversible. Please proceed with caution.
              </p>
              
              <button 
                onClick={handleDeleteAllData} 
                className="delete-all-button"
              >
                Delete All Data and Reset
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="settings-section about-section">
        <h3>About</h3>
        <div className="about-content">
          <p>Password Manager v1.0</p>
          <p>A secure, local-only password manager that encrypts your data.</p>
          <p>Your passwords never leave your device and are encrypted with your master password.</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;