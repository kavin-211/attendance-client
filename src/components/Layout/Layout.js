import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  IoHomeOutline, 
  IoPeopleOutline, 
  IoCalendarOutline, 
  IoTimeOutline, 
  IoSettingsOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoDocumentTextOutline,
  IoNotificationsOutline
} from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../common/ConfirmDialog';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { path: '/admin', icon: <IoHomeOutline />, label: 'Dashboard' },
    { path: '/admin/employees', icon: <IoPeopleOutline />, label: 'Employee Management' },
    { path: '/admin/attendance-control', icon: <IoTimeOutline />, label: 'Attendance Control' },
    { path: '/admin/attendance-history', icon: <IoCalendarOutline />, label: 'Attendance History' },
    { path: '/admin/shift-settings', icon: <IoSettingsOutline />, label: 'Shift Settings' },
  ];

  const employeeLinks = [
    { path: '/employee', icon: <IoHomeOutline />, label: 'Home' },
    { path: '/employee/dashboard', icon: <IoCalendarOutline />, label: 'Dashboard' },
    { path: '/employee/updates', icon: <IoNotificationsOutline />, label: 'Updates' },
    { path: '/employee/rules', icon: <IoDocumentTextOutline />, label: 'Rules' },
    { path: '/employee/profile', icon: <IoPersonOutline />, label: 'Profile' },
  ];

  const custodianLinks = [
    { path: '/custodian', icon: <IoHomeOutline />, label: 'Dashboard' },
    { path: '/admin/employees', icon: <IoPeopleOutline />, label: 'Employee Management' },
    { path: '/admin/attendance-control', icon: <IoTimeOutline />, label: 'Attendance Control' },
    { path: '/custodian/attendance-history', icon: <IoCalendarOutline />, label: 'Attendance History' },
    { path: '/admin/shift-settings', icon: <IoSettingsOutline />, label: 'Shift Settings' },
  ];

  const links = user?.role === 'admin' ? adminLinks : 
                user?.role === 'custodian' ? custodianLinks : 
                employeeLinks;

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/logo192.png" alt="Logo" className="sidebar-logo" />
          <span className="sidebar-title">Wifi Attendance</span>
        </div>
        
        <nav className="sidebar-nav">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="nav-item w-full border-none bg-transparent cursor-pointer"
          >
            <span className="nav-icon"><IoLogOutOutline /></span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="flex items-center gap-4">
            {/* Mobile menu button could go here */}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="font-semibold text-sm">{user?.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.designation}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {user?.name?.charAt(0)}
            </div>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="md:hidden text-gray-500 text-xl"
            >
              <IoLogOutOutline />
            </button>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>

        {/* Mobile Navigation */}
        <nav className="mobile-nav">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`mobile-nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label.split(' ')[0]}</span>
            </Link>
          ))}
        </nav>
      </main>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        confirmText="Logout"
      />
    </div>
  );
};

export default Layout;