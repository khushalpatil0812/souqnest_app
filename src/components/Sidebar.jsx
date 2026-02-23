import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiPackage, FiGrid, 
  FiMessageSquare, FiLogOut, FiBriefcase 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FiHome size={20} />, path: '/admin/dashboard' },
    { name: 'Suppliers', icon: <FiUsers size={20} />, path: '/admin/suppliers' },
    { name: 'Products', icon: <FiPackage size={20} />, path: '/admin/products' },
    { name: 'Categories', icon: <FiGrid size={20} />, path: '/admin/categories' },
    { name: 'Industries', icon: <FiBriefcase size={20} />, path: '/admin/industries' },
    { name: 'RFQs', icon: <FiMessageSquare size={20} />, path: '/admin/rfqs' },
  ];

  return (
    <aside 
      className={`bg-white border-r border-neutral-200 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden shadow-sm`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900">SouqNest</h1>
              <p className="text-xs text-neutral-500 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-primary-600' : 'text-neutral-500 group-hover:text-primary-600'}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
          >
            <span className="text-red-500 group-hover:text-red-600">
              <FiLogOut size={20} />
            </span>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
