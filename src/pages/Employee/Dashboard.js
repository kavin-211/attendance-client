import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import Modal from '../../components/common/Modal';
import Card from '../../components/common/Card';
import api from '../../config/api';

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CalendarContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  
  .react-calendar {
    width: 100%;
    border: none;
    font-family: inherit;
  }
  
  .react-calendar__tile {
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0.5rem;
  }
  
  .react-calendar__tile--active {
    background: #4f46e5;
    color: white;
  }
`;

const ShiftCount = styled.div`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  background-color: ${props => props.color || '#e2e8f0'};
  color: ${props => props.textColor || '#1e293b'};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  color: #64748b;
`;

const Value = styled.span`
  font-weight: 500;
  color: #1e293b;
`;

const Dashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [stats, setStats] = useState({
    present: 0,
    late: 0,
    absent: 0,
    totalHours: 0
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const { data } = await api.get('/attendance/history');
      setAttendance(data.data);
      calculateStats(data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch attendance history');
    }
  };

  const calculateStats = (data) => {
    const stats = data.reduce((acc, curr) => {
      if (curr.status === 'present' || curr.status === 'half-day') acc.present++;
      if (curr.status === 'late') acc.late++;
      if (curr.status === 'absent') acc.absent++;
      acc.totalHours += curr.workedHours || 0;
      return acc;
    }, { present: 0, late: 0, absent: 0, totalHours: 0 });
    
    setStats(stats);
  };

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const record = attendance.find(a => 
        new Date(a.date).toDateString() === date.toDateString()
      );

      if (record) {
        let color = '#e2e8f0';
        let text = '#1e293b';
        let label = '0';

        if (record.status === 'present') {
          color = '#dcfce7';
          text = '#166534';
          label = '1';
        } else if (record.status === 'half-day') {
          color = '#dbeafe';
          text = '#1e40af';
          label = '0.5';
        } else if (record.status === 'late') {
          color = '#fef3c7';
          text = '#92400e';
          label = '1';
        } else if (record.status === 'absent') {
          color = '#fee2e2';
          text = '#991b1b';
          label = '0';
        }

        return <ShiftCount color={color} textColor={text}>{label}</ShiftCount>;
      }
    }
    return null;
  };

  const handleDateClick = (date) => {
    const record = attendance.find(a => 
      new Date(a.date).toDateString() === date.toDateString()
    );

    if (record) {
      setSelectedRecord(record);
      setShowModal(true);
    } else {
      // Could show "No record" or "Absent" if past date
      if (date < new Date()) {
        setSelectedRecord({
          date: date.toISOString(),
          status: 'Absent',
          checkIn: null,
          checkOut: null,
          workedHours: 0,
          lossOfPay: 0
        });
        setShowModal(true);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

      <DashboardGrid>
        <Card title="Total Present" value={stats.present} />
        <Card title="Late Days" value={stats.late} />
        <Card title="Total Hours" value={`${stats.totalHours.toFixed(1)} hrs`} />
      </DashboardGrid>

      <CalendarContainer>
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate}
          tileContent={getTileContent}
          onClickDay={handleDateClick}
        />
      </CalendarContainer>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Attendance Details - ${selectedRecord ? new Date(selectedRecord.date).toLocaleDateString() : ''}`}
        width="400px"
      >
        {selectedRecord && (
          <div>
            <DetailRow>
              <Label>Status</Label>
              <Value>
                <span className={`badge badge-${
                  selectedRecord.status === 'present' ? 'success' : 
                  selectedRecord.status === 'late' ? 'warning' : 
                  selectedRecord.status === 'absent' ? 'danger' : 'secondary'
                }`}>
                  {selectedRecord.status}
                </span>
              </Value>
            </DetailRow>
            <DetailRow>
              <Label>Check In</Label>
              <Value>{selectedRecord.checkIn ? new Date(selectedRecord.checkIn).toLocaleTimeString() : '-'}</Value>
            </DetailRow>
            <DetailRow>
              <Label>Check Out</Label>
              <Value>{selectedRecord.checkOut ? new Date(selectedRecord.checkOut).toLocaleTimeString() : '-'}</Value>
            </DetailRow>
            <DetailRow>
              <Label>Worked Hours</Label>
              <Value>{selectedRecord.workedHours || 0} hrs</Value>
            </DetailRow>
            {(selectedRecord.status === 'late' || selectedRecord.status === 'half-day' || selectedRecord.status === 'absent') && (
              <DetailRow>
                <Label>Loss of Pay</Label>
                <Value style={{ color: '#ef4444' }}>₹ {selectedRecord.lossOfPay || 0}</Value>
              </DetailRow>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;