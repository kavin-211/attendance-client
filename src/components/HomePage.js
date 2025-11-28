import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginModal from './LoginModal';

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [clientIp, setClientIp] = useState('');
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [networkError, setNetworkError] = useState('');

  useEffect(() => {
    getClientIp();
  }, []);

  // const getClientIp = async () => {
  //   try {
  //     const response = await axios.get('/api/client-ip');
  //     setClientIp(response.data.ip);
  //     checkIpAuthorization(response.data.ip);
  //   } catch (error) {
  //     console.error('Error getting IP:', error);
  //   }
  // };

  const checkIpAuthorization = async (ip) => {
    try {
      const response = await axios.post('/api/check-auth', { ip });
      if (response.data.authorized) {
        setUser(response.data.user);
        fetchTodayAttendance(response.data.user.empId);
      }
    } catch (error) {
      console.error('Error checking authorization:', error);
    }
  };

  const fetchTodayAttendance = async (empId) => {
    try {
      const response = await axios.get(`/api/today-attendance/${empId}`);
      setTodayAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!user || !clientIp) return;

    setIsChecking(true);
    try {
      await axios.post('/api/check-in', {
        empId: user.empId,
        name: user.name,
        ip: clientIp
      });
      fetchTodayAttendance(user.empId);
    } catch (error) {
      alert(error.response?.data?.message || 'Error checking in');
    } finally {
      setIsChecking(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user || !clientIp) return;

    setIsChecking(true);
    try {
      await axios.post('/api/check-out', {
        empId: user.empId,
        ip: clientIp
      });
      fetchTodayAttendance(user.empId);
    } catch (error) {
      alert(error.response?.data?.message || 'Error checking out');
    } finally {
      setIsChecking(false);
    }
  };

  const getLastCheckIn = () => {
    return todayAttendance.find(record => !record.checkOutTime);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };


  // Add these functions to HomePage.js

const checkNetworkAuthorization = async (clientIP) => {
  try {
    // Get admin network configuration
    const networkConfig = JSON.parse(localStorage.getItem('adminNetworkConfig') || '{}');
    const adminIPs = networkConfig.adminIPs || [];

    // If no admin IPs configured, allow all access
    if (adminIPs.length === 0) {
      return { authorized: true, reason: 'No restrictions configured' };
    }

    // Check if client IP matches any admin network
    const clientNetwork = clientIP.split('.').slice(0, 3).join('.');
    
    for (let adminIP of adminIPs) {
      const adminNetwork = adminIP.split('.').slice(0, 3).join('.');
      if (clientNetwork === adminNetwork) {
        return { 
          authorized: true, 
          reason: `Same network as admin IP: ${adminIP}` 
        };
      }
    }

    // If no match found
    const allowedNetworks = Array.from(new Set(adminIPs.map(ip => 
      ip.split('.').slice(0, 3).join('.') + '.x'
    )));

    return { 
      authorized: false, 
      reason: `Device not on authorized network. Allowed: ${allowedNetworks.join(', ')}` 
    };

  } catch (error) {
    console.error('Network check error:', error);
    return { authorized: false, reason: 'Network validation error' };
  }
};

// Update the useEffect in HomePage.js
useEffect(() => {
  getClientIp();
}, []);

  const getClientIp = async () => {
    try {
      // Get client IP
      let clientIP = '';
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        clientIP = data.ip;
      } catch (e) {
        // Fallback to local IP detection
        const localResponse = await axios.get('/api/client-ip');
        clientIP = localResponse.data.ip;
      }

      setClientIp(clientIP);

      // Check network authorization
      const networkAuth = await checkNetworkAuthorization(clientIP);
      
      if (networkAuth.authorized) {
        // Proceed with user IP authorization
        checkIpAuthorization(clientIP);
      } else {
        setNetworkError(networkAuth.reason);
        setUser(null);
      }

    } catch (error) {
      console.error('Error getting IP:', error);
      setNetworkError('Unable to verify network access');
    }
  };

  return (
    <div className="home-page">
      <header className="header">
        <div className="container">
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className="logo"
            onDoubleClick={() => setShowLogin(true)}
          />
        </div>
      </header>

      <main className="main-content">
        <div className="welcome-section">
          <h1>Welcome to WiFi Attendance System</h1>
          <p>Secure attendance tracking through authorized WiFi network</p>
        </div>

        {user ? (
          <div className="attendance-section">
            <div className="user-info">
              <h3>Welcome, {user.name}</h3>
              <p>Employee ID: {user.empId}</p>
              <p>IP Address: {clientIp}</p>
            </div>

            {!getLastCheckIn() ? (
              <button 
                className="btn btn-success attendance-btn"
                onClick={handleCheckIn}
                disabled={isChecking}
              >
                {isChecking ? 'Processing...' : 'Check In'}
              </button>
            ) : (
              <button 
                className="btn btn-danger attendance-btn"
                onClick={handleCheckOut}
                disabled={isChecking}
              >
                {isChecking ? 'Processing...' : 'Check Out'}
              </button>
            )}

            {todayAttendance.length > 0 && (
              <div className="attendance-history">
                <h3>Today's Attendance</h3>
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAttendance.map((record, index) => (
                      <tr key={index}>
                        <td>{formatTime(record.checkInTime)}</td>
                        <td>{record.checkOutTime ? formatTime(record.checkOutTime) : 'Active'}</td>
                        <td>{record.totalDuration ? `${record.totalDuration} mins` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="attendance-section">
            <div className="user-info">
              <h3>Access Denied</h3>
              <p>{networkError || 'Your device is not authorized to use this system.'}</p>
              <p>Please contact administrator.</p>
            </div>
          </div>
        )}
      </main>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
};

export default HomePage;