
import { createContext, useContext, useState } from 'react';
import {
  getCurrentUser,
  getToken,
  loginUser,
  logoutUser,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getToken() ? getCurrentUser() : null);

  async function login(credentials) {
    const data = await loginUser(credentials);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
