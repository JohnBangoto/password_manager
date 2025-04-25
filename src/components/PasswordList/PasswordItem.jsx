import React from 'react';
import './PasswordItem.css';

function PasswordItem({ password, onClick }) {
  // Function to get domain from URL
  const getDomain = (url) => {
    if (!url) return null;
    
    try {
      // Add protocol if missing
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (error) {
      return url; // Return original URL if parsing fails
    }
  };
  
  // Get first letter for avatar
  const getInitial = () => {
    return password.title.charAt(0).toUpperCase();
  };
  
  // Get background color based on title (for the avatar)
  const getAvatarColor = () => {
    const colors = [
      '#4285F4', '#34A853', '#FBBC05', '#EA4335', // Google colors
      '#1877F2', '#E1306C', '#2867B2', '#1DA1F2', // Social media colors
      '#7289DA', '#FF9900', '#6441A4', '#DB4437'  // More colors
    ];
    
    // Use simple hash function to get consistent color
    let hash = 0;
    for (let i = 0; i < password.title.length; i++) {
      hash = password.title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Format date to show only relevant info
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // If same day, show time
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If same year, show month and day
    if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="password-item" onClick={() => onClick(password)}>
      <div 
        className="password-avatar" 
        style={{ backgroundColor: getAvatarColor() }}
      >
        {getInitial()}
      </div>
      
      <div className="password-info">
        <div className="password-title">{password.title}</div>
        <div className="password-details">
          {password.username && (
            <span className="password-username">{password.username}</span>
          )}
          {password.username && password.email && " • "}
          {password.email && (
            <span className="password-email">{password.email}</span>
          )}
        </div>
      </div>
      
      <div className="password-meta">
        {password.url && (
          <div className="password-domain">{getDomain(password.url)}</div>
        )}
        <div className="password-date">{formatDate(password.updatedAt)}</div>
      </div>
    </div>
  );
}

export default PasswordItem;