import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../config/api';

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#4f46e5' : 'transparent'};
  color: ${props => props.active ? '#4f46e5' : '#64748b'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #4f46e5;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AttendanceControl = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [missedCheckouts, setMissedCheckouts] = useState([]);
  const [upcomingUpdates, setUpcomingUpdates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const [manualEntry, setManualEntry] = useState({
    employeeId: '',
    date: '',
    checkInTime: '',
    checkOutTime: '',
    reason: ''
  });

  const [updateEntry, setUpdateEntry] = useState({
    date: '',
    scheduleType: 'holiday',
    description: ''
  });

  useEffect(() => {
    if (activeTab === 'missed') {
      fetchMissedCheckouts();
    } else if (activeTab === 'updates') {
      fetchUpcomingUpdates();
    }
  }, [activeTab]);

  const fetchMissedCheckouts = async () => {
    try {
      const { data } = await api.get('/attendance/missed-checkouts');
      setMissedCheckouts(data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch missed checkouts');
    }
  };

  const fetchUpcomingUpdates = async () => {
    try {
      const { data } = await api.get('/shifts/schedule');
      setUpcomingUpdates(data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch updates');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/attendance/manual', manualEntry);
      toast.success('Attendance added successfully');
      setManualEntry({
        employeeId: '',
        date: '',
        checkInTime: '',
        checkOutTime: '',
        reason: ''
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add attendance');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/shifts/schedule', updateEntry);
      toast.success('Schedule added successfully');
      fetchUpcomingUpdates();
      setUpdateEntry({
        date: '',
        scheduleType: 'holiday',
        description: ''
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to add schedule');
    }
  };

  const handleEditMissed = (record) => {
    setSelectedRecord(record);
    setManualEntry({
      employeeId: record.employeeId._id,
      date: record.date.split('T')[0],
      checkInTime: new Date(record.checkIn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      checkOutTime: '',
      reason: ''
    });
    setShowModal(true);
  };

  const handleMissedSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/attendance/${selectedRecord._id}`, {
        checkOutTime: manualEntry.checkOutTime,
        reason: manualEntry.reason
      });
      toast.success('Record updated successfully');
      setShowModal(false);
      fetchMissedCheckouts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update record');
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await api.delete(`/shifts/schedule/${id}`);
      toast.success('Schedule removed');
      fetchUpcomingUpdates();
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove schedule');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Attendance Control Panel</h1>
      
      <Tabs>
        <Tab active={activeTab === 'manual'} onClick={() => setActiveTab('manual')}>
          Manual Entry
        </Tab>
        <Tab active={activeTab === 'missed'} onClick={() => setActiveTab('missed')}>
          Missed Check-outs
        </Tab>
        <Tab active={activeTab === 'updates'} onClick={() => setActiveTab('updates')}>
          Upcoming Updates
        </Tab>
      </Tabs>

      {activeTab === 'manual' && (
        <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">Add Manual Attendance</h2>
          <form onSubmit={handleManualSubmit}>
            <FormGrid>
              <FormGroup>
                <label>Employee ID (Database ID)</label>
                <input 
                  value={manualEntry.employeeId} 
                  onChange={(e) => setManualEntry({...manualEntry, employeeId: e.target.value})} 
                  placeholder="Enter Employee MongoDB ID"
                  required 
                />
              </FormGroup>
              <FormGroup>
                <label>Date</label>
                <input 
                  type="date" 
                  value={manualEntry.date} 
                  onChange={(e) => setManualEntry({...manualEntry, date: e.target.value})} 
                  required 
                />
              </FormGroup>
              <div className="grid grid-cols-2 gap-4">
                <FormGroup>
                  <label>Check In Time</label>
                  <input 
                    type="time" 
                    value={manualEntry.checkInTime} 
                    onChange={(e) => setManualEntry({...manualEntry, checkInTime: e.target.value})} 
                    required 
                  />
                </FormGroup>
                <FormGroup>
                  <label>Check Out Time</label>
                  <input 
                    type="time" 
                    value={manualEntry.checkOutTime} 
                    onChange={(e) => setManualEntry({...manualEntry, checkOutTime: e.target.value})} 
                  />
                </FormGroup>
              </div>
              <FormGroup>
                <label>Reason</label>
                <textarea 
                  value={manualEntry.reason} 
                  onChange={(e) => setManualEntry({...manualEntry, reason: e.target.value})} 
                  rows="3"
                  required 
                />
              </FormGroup>
              <Button type="submit">Add Entry</Button>
            </FormGrid>
          </form>
        </div>
      )}

      {activeTab === 'missed' && (
        <div>
          <Table 
            columns={[
              { header: 'Employee', accessor: 'employeeId.name', render: (row) => row.employeeId?.name },
              { header: 'Date', accessor: 'date', render: (row) => new Date(row.date).toLocaleDateString() },
              { header: 'Check In', accessor: 'checkIn', render: (row) => new Date(row.checkIn).toLocaleTimeString() },
              { header: 'Action', accessor: 'action', render: (row) => (
                <Button onClick={() => handleEditMissed(row)}>Fix Checkout</Button>
              )}
            ]}
            data={missedCheckouts}
          />
        </div>
      )}

      {activeTab === 'updates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Add Schedule</h2>
            <form onSubmit={handleUpdateSubmit}>
              <FormGrid>
                <FormGroup>
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={updateEntry.date} 
                    onChange={(e) => setUpdateEntry({...updateEntry, date: e.target.value})} 
                    required 
                  />
                </FormGroup>
                <FormGroup>
                  <label>Type</label>
                  <select 
                    value={updateEntry.scheduleType} 
                    onChange={(e) => setUpdateEntry({...updateEntry, scheduleType: e.target.value})}
                  >
                    <option value="holiday">Holiday</option>
                    <option value="wfh">Work From Home</option>
                    <option value="working-day">Working Day</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Description</label>
                  <input 
                    value={updateEntry.description} 
                    onChange={(e) => setUpdateEntry({...updateEntry, description: e.target.value})} 
                    placeholder="e.g. Diwali Holiday"
                  />
                </FormGroup>
                <Button type="submit">Add Schedule</Button>
              </FormGrid>
            </form>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Upcoming Schedule</h2>
            <Table 
              columns={[
                { header: 'Date', accessor: 'date', render: (row) => new Date(row.date).toLocaleDateString() },
                { header: 'Type', accessor: 'scheduleType', render: (row) => (
                  <span className={`badge badge-${row.scheduleType === 'holiday' ? 'danger' : 'info'}`}>
                    {row.scheduleType}
                  </span>
                )},
                { header: 'Description', accessor: 'description' },
                { header: 'Action', accessor: 'id', render: (row) => (
                  <Button variant="danger" onClick={() => handleDeleteSchedule(row._id)}>Delete</Button>
                )}
              ]}
              data={upcomingUpdates}
            />
          </div>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Fix Missed Checkout"
        width="500px"
      >
        <form onSubmit={handleMissedSubmit}>
          <FormGrid>
            <FormGroup>
              <label>Check Out Time</label>
              <input 
                type="time" 
                value={manualEntry.checkOutTime} 
                onChange={(e) => setManualEntry({...manualEntry, checkOutTime: e.target.value})} 
                required 
              />
            </FormGroup>
            <FormGroup>
              <label>Reason</label>
              <textarea 
                value={manualEntry.reason} 
                onChange={(e) => setManualEntry({...manualEntry, reason: e.target.value})} 
                rows="3"
                required 
              />
            </FormGroup>
            <Button type="submit">Update Record</Button>
          </FormGrid>
        </form>
      </Modal>
    </div>
  );
};

export default AttendanceControl;