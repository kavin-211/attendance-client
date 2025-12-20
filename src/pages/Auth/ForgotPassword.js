import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import api from '../../config/api';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  padding: 1rem;
`;

const Card = styled.div`
  background-color: white;
  padding: 2.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const Description = styled.p`
  text-align: center;
  color: #64748b;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ForgotPassword = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { employeeId });
      setSubmitted(true);
      toast.success('Password sent to your registered email');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Failed to process request';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container>
        <Card>
          <div className="text-center mb-6">
            <div style={{ fontSize: '3rem', color: '#10b981' }}>✓</div>
          </div>
          <Title>Email Sent</Title>
          <Description>
            We have sent your current password to the email address associated with ID: <strong>{employeeId}</strong>
          </Description>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button fullWidth>Back to Login</Button>
          </Link>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>Forgot Password</Title>
        <Description>
          Enter your Employee ID to receive your current password via email.
        </Description>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Employee ID</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter your ID"
              required
            />
          </FormGroup>
          
          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Sending...' : 'Submit'}
          </Button>

          <div className="text-center mt-4">
            <Link to="/login" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>
              Back to Login
            </Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default ForgotPassword;