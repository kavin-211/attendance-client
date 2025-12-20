import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import api from '../../config/api';

const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EventCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.type === 'holiday' ? '#ef4444' : '#3b82f6'};
`;

const EventDate = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
`;

const EventTitle = styled.div`
  font-weight: 600;
  color: #1e293b;
`;

const EventType = styled.span`
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  background-color: ${props => props.type === 'holiday' ? '#fee2e2' : '#dbeafe'};
  color: ${props => props.type === 'holiday' ? '#991b1b' : '#1e40af'};
  margin-left: 0.5rem;
`;

const Marker = styled.div`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 600;
  color: ${props => props.type === 'holiday' ? '#ef4444' : '#3b82f6'};
`;

const UpcomingUpdates = () => {
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const { data } = await api.get('/shifts/schedule');
      setSchedule(data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch schedule');
    }
  };

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const event = schedule.find(s => 
        new Date(s.date).toDateString() === date.toDateString()
      );

      if (event) {
        if (event.scheduleType === 'holiday') {
          return <Marker type="holiday">H</Marker>;
        } else if (event.scheduleType === 'wfh') {
          return <Marker type="wfh">WFH</Marker>;
        } else {
          return <Marker type="working">W</Marker>;
        }
      }
    }
    return null;
  };

  const upcomingEvents = schedule
    .filter(s => new Date(s.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Upcoming Updates</h1>
      
      <Container>
        <CalendarContainer>
          <Calendar 
            onChange={setSelectedDate} 
            value={selectedDate}
            tileContent={getTileContent}
          />
        </CalendarContainer>

        <EventList>
          <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <EventCard key={event._id} type={event.scheduleType}>
                <EventDate>
                  {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  <EventType type={event.scheduleType}>
                    {event.scheduleType === 'wfh' ? 'WFH' : 'Holiday'}
                  </EventType>
                </EventDate>
                <EventTitle>{event.description}</EventTitle>
              </EventCard>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">No upcoming events</div>
          )}
        </EventList>
      </Container>
    </div>
  );
};

export default UpcomingUpdates;