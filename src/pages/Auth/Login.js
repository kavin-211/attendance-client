import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import { checkWifiConnection } from '../../utils/ipDetection';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  padding: 1rem;
`;

const LoginCard = styled.div`
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
  margin-bottom: 2rem;
  font-size: 1.5rem;
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

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check wifi connection first (client side check)
      // Note: Real validation happens on backend
      const isWifi = await checkWifiConnection();
      // We don't block here strictly because browser API is limited, 
      // but we can warn or rely on backend error
      
      const user = await login(employeeId, password);
      
      toast.success(`Welcome back, ${user.name}!`);
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'custodian') {
        navigate('/custodian');
      } else {
        navigate('/employee');
      }
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      
      if (error.response?.data?.isWifiError) {
        // Show specific wifi error dialog or message
        toast.warning('Please connect to the Admin WiFi network to access the system.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <div className="text-center mb-6">
          <img src="/logo192.png" alt="Logo" style={{ width: '64px', height: '64px' }} />
        </div>
        <Title>Wifi Attendance System</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Employee ID / User ID</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter your ID"
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </FormGroup>
          
          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="text-center mt-4">
            <Link to="/forgot-password" style={{ color: '#4f46e5', textDecoration: 'none', fontSize: '0.9rem' }}>
              Forgot Password?
            </Link>
          </div>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;