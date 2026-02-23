import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Checking for stored auth...');
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        console.log('AuthProvider: User loaded from storage', JSON.parse(storedUser));
      } catch (error) {
        console.error('AuthProvider: Error parsing stored user', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
    console.log('AuthProvider: Loading complete');
  }, []);

  const login = (userData, token) => {
    console.log('AuthProvider: Logging in user', userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    console.log('AuthProvider: Logging out');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = () => {
    const admin = user?.role === 'SUPER_ADMIN';
    console.log('AuthProvider: isAdmin check', { user, admin });
    return admin;
  };

  if (loading) {
    console.log('AuthProvider: Still loading...');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
