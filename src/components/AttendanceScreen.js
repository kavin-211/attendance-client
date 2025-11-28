import React, { useState, useEffect } from 'react';

const AttendanceScreen = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filters, setFilters] = useState({
    month: '',
    year: ''
  });
  const [loading, setLoading] = useState(false);

  // Mock attendance data
  const mockAttendance = [
    {
      _id: '1',
      empId: 'EMP001',
      name: 'John Doe',
      date: new Date('2024-01-15'),
      checkInTime: new Date('2024-01-15T09:00:00'),
      checkOutTime: new Date('2024-01-15T17:00:00'),
      totalDuration: 480
    },
    {
      _id: '2',
      empId: 'EMP002',
      name: 'Jane Smith',
      date: new Date('2024-01-15'),
      checkInTime: new Date('2024-01-15T08:30:00'),
      checkOutTime: new Date('2024-01-15T17:30:00'),
      totalDuration: 540
    },
    {
      _id: '3',
      empId: 'EMP001',
      name: 'John Doe',
      date: new Date('2024-01-16'),
      checkInTime: new Date('2024-01-16T09:15:00'),
      checkOutTime: null,
      totalDuration: null
    }
  ];

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    filterAttendance();
  }, [attendance, filters]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get attendance from localStorage or use mock data
      const storedAttendance = localStorage.getItem('attendance');
      if (storedAttendance) {
        const parsedAttendance = JSON.parse(storedAttendance).map(item => ({
          ...item,
          date: new Date(item.date),
          checkInTime: new Date(item.checkInTime),
          checkOutTime: item.checkOutTime ? new Date(item.checkOutTime) : null
        }));
        setAttendance(parsedAttendance);
      } else {
        setAttendance(mockAttendance);
        localStorage.setItem('attendance', JSON.stringify(mockAttendance));
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      alert('Error fetching attendance data');
    } finally {
      setLoading(false);
    }
  };

  const filterAttendance = () => {
    let filtered = [...attendance];

    if (filters.month && filters.year) {
      filtered = filtered.filter(record => {
        const date = new Date(record.date);
        return date.getMonth() + 1 === parseInt(filters.month) && 
               date.getFullYear() === parseInt(filters.year);
      });
    }

    setFilteredAttendance(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleExportCSV = async () => {
    try {
      // Simulate export functionality
      alert('CSV export functionality would be implemented here with backend connection');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV');
    }
  };

  const handleExportExcel = async () => {
    try {
      // Simulate export functionality
      alert('Excel export functionality would be implemented here with backend connection');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Error exporting Excel');
    }
  };

  const clearFilters = () => {
    setFilters({ month: '', year: '' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN');
  };

  const formatTime = (date) => {
    if (!date) return '-';
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || '';
  };

  return (
    <div>
      <div className="screen-header">
        <h1>Attendance Report</h1>
        <div className="export-buttons">
          <button className="btn btn-success" onClick={handleExportExcel}>
            Export Excel
          </button>
          <button className="btn btn-primary" onClick={handleExportCSV}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <div className="filter-item">
            <label>Month</label>
            <select 
              name="month" 
              value={filters.month} 
              onChange={handleFilterChange}
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Year</label>
            <select 
              name="year" 
              value={filters.year} 
              onChange={handleFilterChange}
            >
              <option value="">All Years</option>
              <option value={getCurrentYear() - 1}>{getCurrentYear() - 1}</option>
              <option value={getCurrentYear()}>{getCurrentYear()}</option>
              <option value={getCurrentYear() + 1}>{getCurrentYear() + 1}</option>
            </select>
          </div>
          <div className="filter-item">
            <button className="btn btn-warning" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading" style={{ margin: '0 auto' }}></div>
          <p>Loading attendance data...</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Check-in Time</th>
                <th>Check-out Time</th>
                <th>Duration (mins)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record, index) => (
                  <tr key={record._id || index}>
                    <td>{record.empId}</td>
                    <td>{record.name}</td>
                    <td>{formatDate(record.date)}</td>
                    <td>{formatTime(record.checkInTime)}</td>
                    <td>{formatTime(record.checkOutTime)}</td>
                    <td>{record.totalDuration || '-'}</td>
                    <td>
                      <span 
                        className={`status-badge ${record.checkOutTime ? 'status-completed' : 'status-active'}`}
                      >
                        {record.checkOutTime ? 'Completed' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No attendance records found
                    {filters.month && filters.year && ` for ${getMonthName(filters.month)} ${filters.year}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '1rem', color: '#666', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <p><strong>Total Records:</strong> {filteredAttendance.length}</p>
        {filters.month && filters.year && (
          <p><strong>Filtered by:</strong> {getMonthName(filters.month)} {filters.year}</p>
        )}
        <p><small>Note: Export functionality requires backend connection</small></p>
      </div>
    </div>
  );
};

export default AttendanceScreen;