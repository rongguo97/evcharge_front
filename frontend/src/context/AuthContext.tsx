import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 앱이 켜질 때 혹은 새로고침 시 로그인 상태 확인
  const checkLoginStatus = async () => {
    try {
      const res = await apiClient.get('/api/auth/me');
      setUser(res.data);
      setIsLoggedIn(true);
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setIsLoggedIn, checkLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);