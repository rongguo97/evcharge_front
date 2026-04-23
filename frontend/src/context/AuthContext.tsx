import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 1. 로그인 상태 확인 (기존 유지)
  const checkLoginStatus = async () => {
    try {
      const res = await apiClient.get('/me');
      setUser(res.data);
      setIsLoggedIn(true);
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // 2. 로그아웃 함수 추가
  const logout = async () => {
    try {
      // 백엔드의 /api/auth/logout 호출 (쿠키 만료 처리)
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error("로그아웃 요청 중 오류 발생:", err);
    } finally {
      // 서버 응답과 상관없이 프론트엔드 상태는 무조건 초기화
      setUser(null);
      setIsLoggedIn(false);
      alert("로그아웃 되었습니다.");
      // 메인으로 리다이렉트 (안전하게 상태 전체 초기화)
      window.location.href = "/"; 
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    // value에 logout을 꼭 포함시켜야 Header에서 쓸 수 있습니다.
    <AuthContext.Provider value={{ user, isLoggedIn, setIsLoggedIn, checkLoginStatus, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);