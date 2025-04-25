import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePasswords } from '../context/PasswordContext';
import PasswordItem from './PasswordItem';
import PasswordDetails from './PasswordDetails';
import './PasswordList.css';

function PasswordList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [sortOption, setSortOption] = useState('updatedAt'); // Default sort by last updated
  const [sortDirection, setSortDirection] = useState('desc'); // Default sort direction

  const { passwords } = usePasswords();
  const navigate = useNavigate();

  // Filter and sort passwords when dependencies change
  useEffect(() => {
    let results = [...passwords];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(password => 
        password.title.toLowerCase().includes(term) ||
        (password.username && password.username.toLowerCase().includes(term)) ||
        (password.email && password.email.toLowerCase().includes(term)) ||
        (password.url && password.url.toLowerCase().includes(term)) ||
        (password.notes && password.notes.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    results.sort((a, b) => {
      let valueA, valueB;
      
      // Handle different sort fields
      switch (sortOption) {
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt);
          valueB = new Date(b.createdAt);
          break;
        case 'updatedAt':
        default:
          valueA = new Date(a.updatedAt);
          valueB = new Date(b.updatedAt);
          break;
      }
      
      // Apply sort direction
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredPasswords(results);
  }, [passwords, searchTerm, sortOption, sortDirection]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handlePasswordClick = (password) => {
    setSelectedPassword(password);
  };

  const closeDetails = () => {
    setSelectedPassword(null);
  };

  const addNewPassword = () => {
    navigate('/dashboard/add');
  };

  return (
    <div className="password-list-container">
      <div className="password-list-header">
        <h2>Your Passwords</h2>
        <button className="add-password-button" onClick={addNewPassword}>
          Add New Password
        </button>
      </div>
      
      <div className="password-list-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="sort-container">
          <select 
            value={sortOption} 
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="title">Sort by Title</option>
            <option value="updatedAt">Sort by Last Updated</option>
            <option value="createdAt">Sort by Date Created</option>
          </select>
          
          <button 
            className="sort-direction-button" 
            onClick={toggleSortDirection}
            title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      
      <div className="password-list">
        {filteredPasswords.length > 0 ? (
          filteredPasswords.map(password => (
            <PasswordItem
              key={password.id}
              password={password}
              onClick={handlePasswordClick}
            />
          ))
        ) : (
          <div className="no-passwords">
            {searchTerm ? (
              <p>No passwords match your search.</p>
            ) : (
              <div>
                <p>You haven't added any passwords yet.</p>
                <button className="add-first-password" onClick={addNewPassword}>
                  Add Your First Password
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {selectedPassword && (
        <div className="password-details-overlay">
          <div className="password-details-backdrop" onClick={closeDetails}></div>
          <PasswordDetails password={selectedPassword} onClose={closeDetails} />
        </div>
      )}
    </div>
  );
}

export default PasswordList;