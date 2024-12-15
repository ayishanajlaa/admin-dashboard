import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const adminStatus = localStorage.getItem('admin');
    
    setIsAuthenticated(!!token);
    setIsAdmin(adminStatus === 'true');
  }, []);

  const login = (token, isAdmin) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('admin', isAdmin ? 'true' : 'false');
    setIsAuthenticated(true);
    setIsAdmin(isAdmin);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
