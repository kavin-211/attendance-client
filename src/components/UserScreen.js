import React, { useState, useEffect } from 'react';
import UserModal from './UserModal';

const UserScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Mock data for initial users
  const initialUsers = [
    { _id: '1', empId: 'EMP001', name: 'John Doe', ipAddress: '192.168.1.100' },
    { _id: '2', empId: 'EMP002', name: 'Jane Smith', ipAddress: '192.168.1.101' },
    { _id: '3', empId: 'EMP003', name: 'Mike Johnson', ipAddress: '192.168.1.102' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get users from localStorage or use initial data
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers(initialUsers);
        localStorage.setItem('users', JSON.stringify(initialUsers));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users data');
    } finally {
      setLoading(false);
    }
  };

  const saveUsersToStorage = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const updatedUsers = users.filter(user => user._id !== userId);
      saveUsersToStorage(updatedUsers);
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleUserSaved = (newUser) => {
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user._id === editingUser._id ? newUser : user
      );
      saveUsersToStorage(updatedUsers);
    } else {
      // Add new user
      const updatedUsers = [...users, { ...newUser, _id: Date.now().toString() }];
      saveUsersToStorage(updatedUsers);
    }
    handleModalClose();
  };

  return (
    <div>
      <div className="screen-header">
        <h1>User Management</h1>
        <button className="btn btn-primary" onClick={handleAddUser}>
          Add User
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading" style={{ margin: '0 auto' }}></div>
          <p>Loading users data...</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>IP Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.empId}</td>
                    <td>{user.name}</td>
                    <td>{user.ipAddress}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-warning action-btn"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger action-btn"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                    No users found. Click "Add User" to create the first user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <UserModal
          user={editingUser}
          onClose={handleModalClose}
          onSave={handleUserSaved}
        />
      )}
    </div>
  );
};

export default UserScreen;