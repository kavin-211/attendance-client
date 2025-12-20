import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { IoFingerPrint, IoLogOutOutline } from 'react-icons/io5';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import api from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  gap: 2rem;
`;

const StatusCard = styled.div`
  background-color: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const TimeDisplay = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  font-variant-numeric: tabular-nums;
`;

const DateDisplay = styled.div`
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 2rem;
`;

const CheckButton = styled.button`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: none;
  background: ${props => props.checkedIn ? 
    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
    'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 25px -5px ${props => props.checkedIn ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'};
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 20px 25px -5px ${props => props.checkedIn ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)'};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    font-size: 2.5rem;
  }
`;

const StatusText = styled.div`
  margin-top: 2rem;
  font-size: 1.125rem;
  font-weight: 500;
  color: ${props => props.checkedIn ? '#10b981' : '#64748b'};
`;

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchTodayStatus();
    return () => clearInterval(timer);
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const { data } = await api.get('/attendance/today');
      if (data.data) {
        setIsCheckedIn(!data.data.checkOut);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleCheckAction = async () => {
    try {
      if (isCheckedIn) {
        await api.post('/attendance/check-out');
        toast.success('Checked out successfully');
        setIsCheckedIn(false);
      } else {
        await api.post('/attendance/check-in');
        toast.success('Checked in successfully');
        setIsCheckedIn(true);
      }
      fetchTodayStatus();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Action failed';
      toast.error(message);
      
      if (error.response?.data?.isWifiError) {
        toast.warning('Please ensure you are connected to the office WiFi.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <StatusCard>
        <TimeDisplay>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </TimeDisplay>
        <DateDisplay>
          {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </DateDisplay>

        <CheckButton 
          checkedIn={isCheckedIn}
          onClick={() => setShowConfirm(true)}
        >
          <IoFingerPrint />
          {isCheckedIn ? 'Check Out' : 'Check In'}
        </CheckButton>

        <StatusText checkedIn={isCheckedIn}>
          {isCheckedIn ? 'You are currently checked in' : 'You are currently checked out'}
        </StatusText>
      </StatusCard>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleCheckAction}
        title={isCheckedIn ? 'Confirm Check Out' : 'Confirm Check In'}
        message={`Are you sure you want to ${isCheckedIn ? 'check out' : 'check in'} now?`}
        confirmText={isCheckedIn ? 'Check Out' : 'Check In'}
        type={isCheckedIn ? 'danger' : 'success'}
      />
    </Container>
  );
};

export default Home;