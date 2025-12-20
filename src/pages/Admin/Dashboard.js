import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import api from '../../config/api';
import { toast } from 'react-toastify';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const QuickLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuickLink = styled.button`
  background-color: white;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  color: #4f46e5;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const ChartContainer = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    present: 0,
    late: 0,
    absent: 0
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'total', 'present', 'absent', 'late'
  const [modalData, setModalData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/recent-logs')
      ]);
      
      setStats(statsRes.data.data);
      setRecentLogs(logsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const handleCardClick = async (type) => {
    setModalType(type);
    setShowModal(true);
    
    try {
      // Fetch specific data based on type
      let res;
      if (type === 'total') {
        res = await api.get('/employees');
      } else {
        // For present, late, absent - we can use the daily report endpoint with filters
        // Or fetch all daily attendance and filter client side for now
        res = await api.get('/reports/daily');
      }
      
      let data = res.data.data;
      
      // Filter if needed
      if (type === 'present') {
        data = data.filter(d => d.status === 'present' || d.status === 'half-day');
      } else if (type === 'late') {
        data = data.filter(d => d.status === 'late');
      } else if (type === 'absent') {
        // Absent logic is tricky as it's usually "not present"
        // For this demo, we might need a specific endpoint or logic
        // Assuming the report endpoint handles it or we show who hasn't checked in
        // Ideally, the backend should provide a list of absentees
        // For now, let's just show the attendance records that are marked absent if any
        data = data.filter(d => d.status === 'absent');
      }
      
      setModalData(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load details');
    }
  };

  const pieData = {
    labels: ['Present', 'Late', 'Absent'],
    datasets: [
      {
        data: [stats.present, stats.late, stats.absent],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  const columns = [
    { header: 'Employee', accessor: 'employeeId.name', render: (row) => row.employeeId?.name || row.name }, // Handle both user and attendance objects
    { header: 'ID', accessor: 'employeeId.employeeId', render: (row) => row.employeeId?.employeeId || row.employeeId },
    { header: 'Designation', accessor: 'employeeId.designation', render: (row) => row.employeeId?.designation || row.designation },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`badge badge-${
        row.status === 'present' ? 'success' : 
        row.status === 'late' ? 'warning' : 
        row.status === 'absent' ? 'danger' : 'secondary'
      }`}>
        {row.status || 'Active'}
      </span>
    )},
  ];

  // Add time columns for attendance records
  if (modalType !== 'total') {
    columns.push(
      { header: 'Check In', accessor: 'checkIn', render: (row) => row.checkIn ? new Date(row.checkIn).toLocaleTimeString() : '-' },
      { header: 'Check Out', accessor: 'checkOut', render: (row) => row.checkOut ? new Date(row.checkOut).toLocaleTimeString() : '-' }
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <QuickLinks>
        <QuickLink onClick={() => navigate('/admin/attendance-history')}>Attendance Report</QuickLink>
        <QuickLink onClick={() => navigate('/admin/recent-logs')}>Recent Logs</QuickLink>
      </QuickLinks>

      <DashboardGrid>
        <Card 
          title="Total Employees" 
          value={stats.totalEmployees} 
          footer="View All"
          onClick={() => handleCardClick('total')}
        />
        <Card 
          title="Present Today" 
          value={stats.present} 
          footer="View Details"
          onClick={() => handleCardClick('present')}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Present Today</h3>
              <div className="text-3xl font-bold text-gray-900">{stats.present}</div>
            </div>
            <div style={{ width: '60px', height: '60px' }}>
              <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </Card>
        <Card 
          title="Late Comers" 
          value={stats.late} 
          footer="View Details"
          onClick={() => handleCardClick('late')}
        >
           <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Late Comers</h3>
              <div className="text-3xl font-bold text-gray-900">{stats.late}</div>
            </div>
            <div style={{ width: '60px', height: '60px' }}>
              <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </Card>
        <Card 
          title="Absent" 
          value={stats.absent} 
          footer="View Details"
          onClick={() => handleCardClick('absent')}
        >
           <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Absent</h3>
              <div className="text-3xl font-bold text-gray-900">{stats.absent}</div>
            </div>
            <div style={{ width: '60px', height: '60px' }}>
              <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </Card>
      </DashboardGrid>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <Table 
          columns={[
            { header: 'Employee', accessor: 'employeeId.name', render: (row) => row.employeeId?.name },
            { header: 'Action', accessor: 'status', render: (row) => (
              <span>
                {row.checkOut ? 'Checked Out' : 'Checked In'}
              </span>
            )},
            { header: 'Time', accessor: 'updatedAt', render: (row) => new Date(row.updatedAt).toLocaleTimeString() },
            { header: 'Status', accessor: 'status', render: (row) => (
              <span className={`badge badge-${
                row.status === 'present' ? 'success' : 
                row.status === 'late' ? 'warning' : 'danger'
              }`}>
                {row.status}
              </span>
            )}
          ]}
          data={recentLogs}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalType?.charAt(0).toUpperCase() + modalType?.slice(1)} Details`}
        width="800px"
      >
        <Table 
          columns={columns}
          data={modalData}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;