import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Card from '../../components/common/Card';
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

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    present: 0,
    late: 0,
    absent: 0
  });
  const [recentLogs, setRecentLogs] = useState([]);

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Custodian Dashboard</h1>
      
      <DashboardGrid>
        <Card 
          title="Total Employees" 
          value={stats.totalEmployees} 
        />
        <Card 
          title="Present Today" 
          value={stats.present} 
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
    </div>
  );
};

export default Dashboard;