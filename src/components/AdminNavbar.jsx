import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="bg-white border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Toggle Sidebar"
        >
          <FiMenu size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-primary-text">SouqNest Admin</h2>
          <p className="text-xs text-secondary-text">Management Dashboard</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-semibold text-sm text-primary-text">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-secondary-text">{user?.email || 'admin@souqnest.com'}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
          title="Logout"
        >
          <FiLogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
