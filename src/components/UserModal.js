import React, { useState, useEffect } from 'react';

const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    empId: '',
    name: '',
    ipAddress: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        empId: user.empId,
        name: user.name,
        ipAddress: user.ipAddress
      });
    } else {
      setFormData({
        empId: '',
        name: '',
        ipAddress: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.empId.trim()) {
      newErrors.empId = 'Employee ID is required';
    } else if (!/^[A-Za-z0-9]{3,10}$/.test(formData.empId)) {
      newErrors.empId = 'Employee ID must be 3-10 alphanumeric characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = 'IP Address is required';
    } else if (!isValidIP(formData.ipAddress)) {
      newErrors.ipAddress = 'Please enter a valid IP address (e.g., 192.168.1.100)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidIP = (ip) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;

    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255 && part === num.toString();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Prepare user data
      const userData = {
        empId: formData.empId.trim(),
        name: formData.name.trim(),
        ipAddress: formData.ipAddress.trim()
      };

      // Call parent save function
      onSave(userData);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{user ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee ID:</label>
            <input
              type="text"
              name="empId"
              value={formData.empId}
              onChange={handleChange}
              placeholder="Enter Employee ID (e.g., EMP001)"
              disabled={!!user} // Disable editing empId for existing users
            />
            {errors.empId && (
              <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                {errors.empId}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
            {errors.name && (
              <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>IP Address:</label>
            <input
              type="text"
              name="ipAddress"
              value={formData.ipAddress}
              onChange={handleChange}
              placeholder="e.g., 192.168.1.100"
            />
            {errors.ipAddress && (
              <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                {errors.ipAddress}
              </span>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading" style={{ marginRight: '8px' }}></span>
                  Saving...
                </>
              ) : (
                user ? 'Update User' : 'Add User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;