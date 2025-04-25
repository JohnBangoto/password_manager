import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePasswords } from '../context/PasswordContext';
import './PasswordForm.css';

function EditPassword() {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    username: '',
    email: '',
    password: '',
    notes: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { id } = useParams();
  const { getPasswordById, updatePassword, deletePassword } = usePasswords();
  const navigate = useNavigate();

  useEffect(() => {
    const passwordData = getPasswordById(id);
    if (passwordData) {
      setFormData(passwordData);
      setIsLoading(false);
    } else {
      setError('Password not found');
      setIsLoading(false);
    }
  }, [id, getPasswordById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      // Basic validation
      if (!formData.title) {
        setError('Title is required');
        return;
      }
      
      if (!formData.password) {
        setError('Password is required');
        return;
      }

      updatePassword(id, formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update password: ' + err.message);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      deletePassword(id);
      navigate('/dashboard');
    }
  };

  const generatePassword = () => {
    // Navigate to password generator with return URL and current ID
    navigate(`/dashboard/generator?returnTo=edit&id=${id}`);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error === 'Password not found') {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>Password not found. It may have been deleted.</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="password-form-container">
      <h2>Edit Password</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Gmail, Facebook"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">URL</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
          />
        </div>

        <div className="form-group password-input-group">
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            <button 
              type="button" 
              className="generate-password"
              onClick={generatePassword}
            >
              Generate
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="delete-button" onClick={handleDelete}>
            Delete
          </button>
          <button type="button" className="cancel-button" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPassword;