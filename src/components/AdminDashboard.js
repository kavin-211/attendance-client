import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AttendanceScreen from './AttendanceScreen';
import UserScreen from './UserScreen';
import DashboardHome from './DashboardHome';
import NetworkConfig from './NetworkConfig'; // NEW

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  // Redirect to home if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!isAuthenticated()) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="loading"></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <div className="container">
          <div className="navbar-content">
            <div className="nav-brand">Admin Dashboard</div>
            <div className="nav-links">
              <button
                className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                onClick={() => navigate('/admin/dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`nav-link ${location.pathname === '/admin/attendance' ? 'active' : ''}`}
                onClick={() => navigate('/admin/attendance')}
              >
                Attendance
              </button>
              <button
                className={`nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}
                onClick={() => navigate('/admin/users')}
              >
                Users
              </button>
              {/* NEW NETWORK CONFIG LINK */}
              <button
                className={`nav-link ${location.pathname === '/admin/network' ? 'active' : ''}`}
                onClick={() => navigate('/admin/network')}
              >
                Network Config
              </button>
            </div>
            <div className="nav-actions">
              <span style={{ marginRight: '1rem' }}>Welcome, {user.username}</span>
              <button className="btn btn-warning" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="admin-content">
        <div className="container">
          <Routes>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="attendance" element={<AttendanceScreen />} />
            <Route path="users" element={<UserScreen />} />
            <Route path="network" element={<NetworkConfig />} /> {/* NEW */}
            <Route path="/" element={<DashboardHome />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;