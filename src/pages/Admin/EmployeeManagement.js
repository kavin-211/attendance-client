import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IoAdd, IoPencil, IoTrash, IoEye } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import api from '../../config/api';

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    department: '',
    password: '',
    ipAddresses: '',
    profilePhoto: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch employees');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        ipAddresses: formData.ipAddresses.split(',').map(ip => ip.trim())
      };

      if (isEditing) {
        await api.put(`/employees/${selectedEmployee._id}`, payload);
        toast.success('Employee updated successfully');
      } else {
        await api.post('/employees', payload);
        toast.success('Employee added successfully');
      }
      
      setShowModal(false);
      fetchEmployees();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/employees/${selectedEmployee._id}`);
      toast.success('Employee deleted successfully');
      setShowDeleteConfirm(false);
      fetchEmployees();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete employee');
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      mobile: employee.mobile,
      designation: employee.designation,
      department: employee.department,
      password: '', // Don't show password
      ipAddresses: employee.ipAddresses.join(', '),
      profilePhoto: employee.profilePhoto || ''
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewAttendance = async (employee) => {
    setSelectedEmployee(employee);
    try {
      const { data } = await api.get(`/employees/${employee._id}/attendance`);
      setEmployeeAttendance(data.data);
      setShowAttendanceModal(true);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch attendance');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      designation: '',
      department: '',
      password: '',
      ipAddresses: '',
      profilePhoto: ''
    });
    setIsEditing(false);
    setSelectedEmployee(null);
  };

  const columns = [
    { header: 'ID', accessor: 'employeeId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Department', accessor: 'department' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`badge badge-${row.status === 'active' ? 'success' : 'danger'}`}>
        {row.status}
      </span>
    )},
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => handleEdit(row)}>
          <IoPencil />
        </Button>
        <Button variant="danger" onClick={() => {
          setSelectedEmployee(row);
          setShowDeleteConfirm(true);
        }}>
          <IoTrash />
        </Button>
        <Button variant="info" onClick={() => handleViewAttendance(row)}>
          <IoEye />
        </Button>
      </div>
    )}
  ];

  const attendanceColumns = [
    { header: 'Date', accessor: 'date', render: (row) => new Date(row.date).toLocaleDateString() },
    { header: 'Check In', accessor: 'checkIn', render: (row) => new Date(row.checkIn).toLocaleTimeString() },
    { header: 'Check Out', accessor: 'checkOut', render: (row) => row.checkOut ? new Date(row.checkOut).toLocaleTimeString() : '-' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`badge badge-${
        row.status === 'present' ? 'success' : 
        row.status === 'late' ? 'warning' : 'danger'
      }`}>
        {row.status}
      </span>
    )},
    { header: 'Duration', accessor: 'workedHours', render: (row) => `${row.workedHours} hrs` }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <Button onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          <IoAdd /> Add Employee
        </Button>
      </div>

      <Table columns={columns} data={employees} title="Employees" />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? 'Edit Employee' : 'Add Employee'}
        width="600px"
      >
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <label>Name</label>
              <input name="name" value={formData.name} onChange={handleInputChange} required />
            </FormGroup>
            <FormGroup>
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </FormGroup>
            <FormGroup>
              <label>Mobile</label>
              <input name="mobile" value={formData.mobile} onChange={handleInputChange} required />
            </FormGroup>
            <FormGroup>
              <label>Designation</label>
              <select name="designation" value={formData.designation} onChange={handleInputChange} required>
                <option value="">Select Designation</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Manager">Manager</option>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
                <option value="Intern">Intern</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Department</label>
              <select name="department" value={formData.department} onChange={handleInputChange} required>
                <option value="">Select Department</option>
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Password {isEditing && '(Leave blank to keep current)'}</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                required={!isEditing} 
              />
            </FormGroup>
            <FormGroup style={{ gridColumn: 'span 2' }}>
              <label>IP Addresses (comma separated)</label>
              <input 
                name="ipAddresses" 
                value={formData.ipAddresses} 
                onChange={handleInputChange} 
                placeholder="192.168.1.1, 192.168.1.2"
              />
            </FormGroup>
            <FormGroup style={{ gridColumn: 'span 2' }}>
              <label>Profile Photo URL</label>
              <input name="profilePhoto" value={formData.profilePhoto} onChange={handleInputChange} />
            </FormGroup>
          </FormGrid>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">{isEditing ? 'Update' : 'Add'} Employee</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee?.name}? This action cannot be undone.`}
      />

      {/* Attendance History Modal */}
      <Modal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        title={`Attendance History - ${selectedEmployee?.name}`}
        width="800px"
      >
        <Table columns={attendanceColumns} data={employeeAttendance} />
      </Modal>
    </div>
  );
};

export default EmployeeManagement;