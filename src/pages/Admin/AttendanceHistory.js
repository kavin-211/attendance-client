import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../config/api';

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
`;

const AttendanceHistory = ({ isCustodian }) => {
  const [history, setHistory] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  
  // For custodian manual entry
  const [manualEntry, setManualEntry] = useState({
    employeeId: '',
    date: '',
    checkInTime: '',
    checkOutTime: '',
    reason: 'Manual entry by Custodian'
  });

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  const fetchHistory = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);
      
      // We need a specific endpoint for filtered history for all employees
      // Reusing the report endpoint or history endpoint
      const { data } = await api.get(`/reports/daily?${params.toString()}`);
      setHistory(data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch history');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/attendance/manual', manualEntry);
      toast.success('Attendance added successfully');
      setShowAddModal(false);
      fetchHistory();
      setManualEntry({
        employeeId: '',
        date: '',
        checkInTime: '',
        checkOutTime: '',
        reason: 'Manual entry by Custodian'
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add attendance');
    }
  };

  const columns = [
    { header: 'Date', accessor: 'date', render: (row) => new Date(row.date).toLocaleDateString() },
    { header: 'Employee ID', accessor: 'employeeId.employeeId', render: (row) => row.employeeId?.employeeId },
    { header: 'Name', accessor: 'employeeId.name', render: (row) => row.employeeId?.name },
    { header: 'Check In', accessor: 'checkIn', render: (row) => new Date(row.checkIn).toLocaleTimeString() },
    { header: 'Check Out', accessor: 'checkOut', render: (row) => row.checkOut ? new Date(row.checkOut).toLocaleTimeString() : '-' },
    { header: 'Worked Hours', accessor: 'workedHours', render: (row) => `${row.workedHours} hrs` },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`badge badge-${
        row.status === 'present' ? 'success' : 
        row.status === 'late' ? 'warning' : 
        row.status === 'absent' ? 'danger' : 'secondary'
      }`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance History</h1>
        {isCustodian && (
          <Button onClick={() => setShowAddModal(true)}>Add Attendance</Button>
        )}
      </div>

      <Filters>
        <FilterGroup>
          <label>Start Date</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
        </FilterGroup>
        <FilterGroup>
          <label>End Date</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
        </FilterGroup>
        <FilterGroup>
          <label>Status</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
            <option value="half-day">Half Day</option>
          </select>
        </FilterGroup>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button onClick={() => setFilters({ startDate: '', endDate: '', status: '' })} variant="secondary">
            Clear Filters
          </Button>
        </div>
      </Filters>

      <Table columns={columns} data={history} title="Attendance History" />

      {isCustodian && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Past Attendance"
          width="500px"
        >
          <form onSubmit={handleManualSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label>Employee ID (Database ID)</label>
                <input 
                  value={manualEntry.employeeId} 
                  onChange={(e) => setManualEntry({...manualEntry, employeeId: e.target.value})} 
                  placeholder="Enter Employee MongoDB ID"
                  required 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Date</label>
                <input 
                  type="date" 
                  value={manualEntry.date} 
                  onChange={(e) => setManualEntry({...manualEntry, date: e.target.value})} 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label>Check In</label>
                  <input 
                    type="time" 
                    value={manualEntry.checkInTime} 
                    onChange={(e) => setManualEntry({...manualEntry, checkInTime: e.target.value})} 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Check Out</label>
                  <input 
                    type="time" 
                    value={manualEntry.checkOutTime} 
                    onChange={(e) => setManualEntry({...manualEntry, checkOutTime: e.target.value})} 
                  />
                </div>
              </div>
              <Button type="submit">Add Entry</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AttendanceHistory;