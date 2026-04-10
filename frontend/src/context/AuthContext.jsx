import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const login = (tokenVal, roleVal, userData) => {
    setToken(tokenVal);
    setRole(roleVal);
    setUser(userData);
    localStorage.setItem('token', tokenVal);
    localStorage.setItem('role', roleVal);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token;
  const isMainAdmin = role === 'MAIN_ADMIN';
  const isLocalAdmin = role === 'LOCAL_ADMIN';

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout, isAuthenticated, isMainAdmin, isLocalAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
