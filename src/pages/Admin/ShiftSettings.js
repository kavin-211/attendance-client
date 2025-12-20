import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import api from '../../config/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Section = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ShiftSettings = () => {
  const [settings, setSettings] = useState({
    startTime: '09:00',
    endTime: '18:00',
    lateThreshold: 15,
    earlyCheckoutThreshold: 60,
    amountPerHour: 100
  });

  const [rules, setRules] = useState('');

  useEffect(() => {
    fetchSettings();
    fetchRules();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/shifts/settings');
      if (data.data.shift) {
        setSettings({
          startTime: data.data.shift.startTime,
          endTime: data.data.shift.endTime,
          lateThreshold: data.data.shift.lateThreshold,
          earlyCheckoutThreshold: data.data.shift.earlyCheckoutThreshold,
          amountPerHour: data.data.lop?.amountPerHour || 100
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch settings');
    }
  };

  const fetchRules = async () => {
    try {
      const { data } = await api.get('/shifts/rules');
      if (data.data) {
        setRules(data.data.content);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/shifts/settings', settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update settings');
    }
  };

  const handleRulesSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/shifts/rules', { content: rules });
      toast.success('Rules updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update rules');
    }
  };

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-6">Shift Settings</h1>

      <Section>
        <SectionTitle>Work Hours Configuration</SectionTitle>
        <form onSubmit={handleSettingsSubmit}>
          <FormGrid>
            <FormGroup>
              <label>Full Day Start Time</label>
              <input 
                type="time" 
                value={settings.startTime} 
                onChange={(e) => setSettings({...settings, startTime: e.target.value})} 
                required 
              />
            </FormGroup>
            <FormGroup>
              <label>Full Day End Time</label>
              <input 
                type="time" 
                value={settings.endTime} 
                onChange={(e) => setSettings({...settings, endTime: e.target.value})} 
                required 
              />
            </FormGroup>
            <FormGroup>
              <label>Late Threshold (minutes)</label>
              <input 
                type="number" 
                value={settings.lateThreshold} 
                onChange={(e) => setSettings({...settings, lateThreshold: e.target.value})} 
                required 
              />
            </FormGroup>
            <FormGroup>
              <label>Loss of Pay (Amount per Hour)</label>
              <input 
                type="number" 
                value={settings.amountPerHour} 
                onChange={(e) => setSettings({...settings, amountPerHour: e.target.value})} 
                required 
              />
            </FormGroup>
          </FormGrid>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </Section>

      <Section>
        <SectionTitle>Rules & Regulations</SectionTitle>
        <form onSubmit={handleRulesSubmit}>
          <FormGroup>
            <label>Company Rules</label>
            <textarea 
              value={rules} 
              onChange={(e) => setRules(e.target.value)} 
              rows="10"
              placeholder="Enter company rules, shift timings, and policies here..."
              required 
            />
          </FormGroup>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit">Update Rules</Button>
          </div>
        </form>
      </Section>
    </Container>
  );
};

export default ShiftSettings;