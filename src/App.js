import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Layout Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import EmployeeManagement from './pages/Admin/EmployeeManagement';
import AttendanceControl from './pages/Admin/AttendanceControl';
import AttendanceHistory from './pages/Admin/AttendanceHistory';
import ShiftSettings from './pages/Admin/ShiftSettings';

// Employee Pages
import EmployeeDashboard from './pages/Employee/Dashboard';
import EmployeeHome from './pages/Employee/Home';
import UpcomingUpdates from './pages/Employee/UpcomingUpdates';
import Rules from './pages/Employee/Rules';
import Profile from './pages/Employee/Profile';

// Custodian Pages (uses admin components with additional features)
import CustodianDashboard from './pages/Custodian/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/employees" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <EmployeeManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/attendance-control" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AttendanceControl />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/attendance-history" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AttendanceHistory />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/shift-settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <ShiftSettings />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Employee Routes */}
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <Layout>
                <EmployeeHome />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/employee/dashboard" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <Layout>
                <EmployeeDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/employee/updates" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <Layout>
                <UpcomingUpdates />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/employee/rules" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <Layout>
                <Rules />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/employee/profile" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Custodian Routes */}
          <Route path="/custodian" element={
            <ProtectedRoute allowedRoles={['custodian']}>
              <Layout>
                <CustodianDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/custodian/attendance-history" element={
            <ProtectedRoute allowedRoles={['custodian']}>
              <Layout>
                <AttendanceHistory isCustodian={true} />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;