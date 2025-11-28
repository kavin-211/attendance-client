import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const navigate = useNavigate();

  // Get network configuration
  const networkConfig = JSON.parse(localStorage.getItem('adminNetworkConfig') || '{}');
  const adminIPs = networkConfig.adminIPs || [];
  const networkName = networkConfig.networkName || 'Not configured';

  return (
    <div>
      <div className="screen-header">
        <h1>Admin Dashboard</h1>
      </div>
      
      {/* Network Status Card */}
      <div className="ip-card" style={{ marginBottom: '2rem' }}>
        <h3>🌐 Network Status</h3>
        <div className="network-status-info">
          <p><strong>Network Name:</strong> {networkName}</p>
          <p><strong>Admin IPs Configured:</strong> {adminIPs.length}</p>
          <p><strong>Access Policy:</strong> {
            adminIPs.length === 0 ? 
            'Open Access (All IPs allowed)' : 
            `Restricted to ${adminIPs.length} network(s)`
          }</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/admin/network')}
        >
          Configure Network
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div 
          className="card" 
          style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '10px', 
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          onClick={() => navigate('/admin/attendance')}
        >
          <h3 style={{ color: '#3498db', marginBottom: '1rem' }}>📊 Attendance Management</h3>
          <p>View and manage employee attendance records, generate reports, and export data.</p>
        </div>

        <div 
          className="card" 
          style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '10px', 
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          onClick={() => navigate('/admin/users')}
        >
          <h3 style={{ color: '#e74c3c', marginBottom: '1rem' }}>👥 User Management</h3>
          <p>Add, edit, and manage authorized users and their IP addresses.</p>
        </div>

        <div 
          className="card" 
          style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '10px', 
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          onClick={() => navigate('/admin/network')}
        >
          <h3 style={{ color: '#27ae60', marginBottom: '1rem' }}>🌐 Network Configuration</h3>
          <p>Manage admin IP addresses and configure WiFi access restrictions.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;