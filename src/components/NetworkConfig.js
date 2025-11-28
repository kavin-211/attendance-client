import React, { useState, useEffect } from 'react';

const NetworkConfig = () => {
  const [adminIPs, setAdminIPs] = useState([]);
  const [newIP, setNewIP] = useState('');
  const [currentIP, setCurrentIP] = useState('');
  const [networkName, setNetworkName] = useState('Office WiFi');

  useEffect(() => {
    loadAdminIPs();
    detectCurrentIP();
  }, []);

  const detectCurrentIP = async () => {
    try {
      // Try multiple methods to get IP
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setCurrentIP(data.ip);
    } catch (error) {
      // Fallback to local IP detection
      try {
        const localResponse = await fetch('/api/client-ip');
        const localData = await localResponse.json();
        setCurrentIP(localData.ip || 'Cannot detect');
      } catch (e) {
        setCurrentIP('Cannot detect IP');
      }
    }
  };

  const loadAdminIPs = () => {
    const savedConfig = JSON.parse(localStorage.getItem('adminNetworkConfig') || '{}');
    setAdminIPs(savedConfig.adminIPs || []);
    setNetworkName(savedConfig.networkName || 'Office WiFi');
  };

  const saveAdminIPs = (updatedIPs) => {
    const config = {
      adminIPs: updatedIPs,
      networkName: networkName,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('adminNetworkConfig', JSON.stringify(config));
    setAdminIPs(updatedIPs);
  };

  const addAdminIP = () => {
    if (!newIP.trim()) {
      alert('Please enter an IP address');
      return;
    }

    if (!isValidIP(newIP)) {
      alert('Please enter a valid IP address (e.g., 192.168.1.100)');
      return;
    }

    if (adminIPs.includes(newIP)) {
      alert('This IP address is already in the list');
      return;
    }

    const updatedIPs = [...adminIPs, newIP];
    saveAdminIPs(updatedIPs);
    setNewIP('');
    alert(`IP ${newIP} added successfully!`);
  };

  const removeAdminIP = (ipToRemove) => {
    if (!window.confirm(`Remove IP ${ipToRemove} from admin list?`)) {
      return;
    }

    const updatedIPs = adminIPs.filter(ip => ip !== ipToRemove);
    saveAdminIPs(updatedIPs);
    alert(`IP ${ipToRemove} removed successfully!`);
  };

  const useCurrentIP = () => {
    if (currentIP && currentIP !== 'Cannot detect IP') {
      setNewIP(currentIP);
    } else {
      alert('Could not detect current IP address');
    }
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

  const getNetworkRange = (ip) => {
    if (!ip || !isValidIP(ip)) return 'Invalid IP';
    const parts = ip.split('.').slice(0, 3);
    return `${parts.join('.')}.0/24`;
  };

  const clearAllIPs = () => {
    if (!window.confirm('Remove all admin IP addresses?')) {
      return;
    }
    saveAdminIPs([]);
    alert('All admin IPs cleared!');
  };

  return (
    <div className="admin-content">
      <div className="screen-header">
        <h1>🌐 Network Configuration</h1>
        <p>Manage admin IP addresses for WiFi access control</p>
      </div>

      <div className="network-config-container">
        {/* Current IP Detection */}
        <div className="ip-card">
          <h3>📡 Current Device IP</h3>
          <div className="current-ip-display">
            <span className="ip-address">{currentIP}</span>
            <button 
              className="btn btn-success btn-small"
              onClick={useCurrentIP}
              disabled={currentIP === 'Cannot detect IP'}
            >
              Use This IP
            </button>
          </div>
          <small>This is your device's current IP address</small>
        </div>

        {/* Network Name */}
        <div className="ip-card">
          <h3>🏢 Network Name</h3>
          <div className="form-group">
            <input
              type="text"
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
              placeholder="Enter network name"
              className="network-name-input"
            />
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              const config = JSON.parse(localStorage.getItem('adminNetworkConfig') || '{}');
              config.networkName = networkName;
              localStorage.setItem('adminNetworkConfig', JSON.stringify(config));
              alert('Network name updated!');
            }}
          >
            Save Network Name
          </button>
        </div>

        {/* Add New IP */}
        <div className="ip-card">
          <h3>➕ Add Admin IP</h3>
          <div className="add-ip-form">
            <div className="form-group">
              <input
                type="text"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                placeholder="e.g., 192.168.1.100"
                className="ip-input"
              />
            </div>
            <div className="ip-actions">
              <button className="btn btn-primary" onClick={addAdminIP}>
                Add IP
              </button>
              <button className="btn btn-warning" onClick={() => setNewIP('')}>
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Admin IP List */}
        <div className="ip-card">
          <div className="ip-list-header">
            <h3>👥 Admin IP List ({adminIPs.length})</h3>
            {adminIPs.length > 0 && (
              <button className="btn btn-danger btn-small" onClick={clearAllIPs}>
                Clear All
              </button>
            )}
          </div>

          {adminIPs.length === 0 ? (
            <div className="no-ips">
              <p>No admin IP addresses configured</p>
              <small>Users from any IP will be able to access the system</small>
            </div>
          ) : (
            <div className="ip-list">
              {adminIPs.map((ip, index) => (
                <div key={index} className="ip-list-item">
                  <div className="ip-info">
                    <span className="ip-address">{ip}</span>
                    <span className="network-range">{getNetworkRange(ip)}</span>
                  </div>
                  <div className="ip-item-actions">
                    <button 
                      className="btn btn-danger btn-small"
                      onClick={() => removeAdminIP(ip)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Network Status */}
        <div className="ip-card">
          <h3>🔒 Access Rules</h3>
          <div className="access-rules">
            <p><strong>Current Policy:</strong></p>
            {adminIPs.length === 0 ? (
              <div className="policy-open">
                <span className="status-badge status-active">OPEN ACCESS</span>
                <p>All IP addresses are allowed</p>
              </div>
            ) : (
              <div className="policy-restricted">
                <span className="status-badge status-completed">RESTRICTED ACCESS</span>
                <p>Only devices from these networks can access:</p>
                <ul>
                  {Array.from(new Set(adminIPs.map(ip => getNetworkRange(ip)))).map((range, idx) => (
                    <li key={idx}>{range}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkConfig;