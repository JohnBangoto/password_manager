import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePasswords } from '../context/PasswordContext';
import './PasswordDetails.css';

function PasswordDetails({ password, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState({
    username: false,
    email: false, 
    password: false
  });
  
  const navigate = useNavigate();
  const { deletePassword } = usePasswords();

  if (!password) {
    return null;
  }

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(prev => ({ ...prev, [field]: true }));
        setTimeout(() => {
          setCopied(prev => ({ ...prev, [field]: false }));
        }, 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  const handleEdit = () => {
    navigate(`/dashboard/edit/${password.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      deletePassword(password.id);
      onClose();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="password-details">
      <div className="details-header">
        <h2>{password.title}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="details-content">
        {password.url && (
          <div className="detail-item">
            <span className="detail-label">URL:</span>
            <a 
              href={password.url.startsWith('http') ? password.url : `https://${password.url}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="detail-value url-value"
            >
              {password.url}
            </a>
          </div>
        )}
        
        {password.username && (
          <div className="detail-item">
            <span className="detail-label">Username:</span>
            <div className="detail-value-with-action">
              <span className="detail-value">{password.username}</span>
              <button 
                className="copy-button" 
                onClick={() => copyToClipboard(password.username, 'username')}
              >
                {copied.username ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
        
        {password.email && (
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <div className="detail-value-with-action">
              <span className="detail-value">{password.email}</span>
              <button 
                className="copy-button" 
                onClick={() => copyToClipboard(password.email, 'email')}
              >
                {copied.email ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
        
        <div className="detail-item">
          <span className="detail-label">Password:</span>
          <div className="detail-value-with-action">
            <span className="detail-value password-value">
              {showPassword ? password.password : '••••••••••••••••'}
            </span>
            <button 
              className="show-button" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            <button 
              className="copy-button" 
              onClick={() => copyToClipboard(password.password, 'password')}
            >
              {copied.password ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        {password.notes && (
          <div className="detail-item notes-item">
            <span className="detail-label">Notes:</span>
            <div className="detail-value notes-value">
              {password.notes}
            </div>
          </div>
        )}
        
        <div className="detail-item timestamps">
          <div>
            <span className="detail-label small">Created:</span>
            <span className="detail-value small">{formatDate(password.createdAt)}</span>
          </div>
          <div>
            <span className="detail-label small">Last Updated:</span>
            <span className="detail-value small">{formatDate(password.updatedAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="details-actions">
        <button className="edit-button" onClick={handleEdit}>
          Edit
        </button>
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default PasswordDetails;