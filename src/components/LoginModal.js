import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hardcoded admin credentials
  const ADMIN_CREDENTIALS = {
    username: 'kenrich',
    password: '1234'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Frontend validation
      if (formData.username === ADMIN_CREDENTIALS.username && 
          formData.password === ADMIN_CREDENTIALS.password) {
        
        // Create mock token and user data
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser = {
          username: formData.username,
          role: 'admin'
        };

        // Store in localStorage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>
          {error && (
            <div style={{ 
              color: '#e74c3c', 
              backgroundColor: '#fdf2f2',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '1rem',
              border: '1px solid #fbb'
            }}>
              {error}
            </div>
          )}
          <div className="form-actions">
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
          <div style={{ 
            marginTop: '1rem', 
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            fontSize: '12px',
            color: '#666'
          }}>
            <strong>Demo Credentials:</strong><br />
            Username: kenrich<br />
            Password: 1234
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;