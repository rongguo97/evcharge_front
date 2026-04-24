import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios'; 

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 

  // [추가] 로그인 성공 시 호출할 함수
  const login = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const checkLoginStatus = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // 📍 주의: 백엔드 API 주소 확인 (/me 인지 /api/me 인지)
      const res = await apiClient.get('/me'); 
      setUser(res.data);
      setIsLoggedIn(true);
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error("로그아웃 오류:", err);
    } finally {
      localStorage.removeItem('accessToken'); // 토큰 삭제 필수
      setUser(null);
      setIsLoggedIn(false);
      alert("로그아웃 되었습니다.");
      window.location.href = "/"; 
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    // 📍 value에 'login' 함수를 추가로 넘겨줍니다.
    <AuthContext.Provider value={{ user, isLoggedIn, checkLoginStatus, login, logout, loading }}>
      {!loading ? children : (
        <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', fontWeight: 'bold' }}>
          잠시만 기다려주세요...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);