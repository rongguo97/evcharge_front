import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import apiClient from '../api/axios'; 

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 

  // 📍 [2번 로직] 관리자 여부 판별 (user가 바뀔 때마다 자동으로 계산됨)
  const isAdmin = useMemo(() => {
    return user?.role?.toUpperCase() === "ROLE_ADMIN";
  }, [user]);

  // 로그인 성공 시 호출할 함수
  const login = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // 로그인 상태 확인 함수
  const checkLoginStatus = async () => {
    try {
      // 📍 백엔드 컨트롤러 경로 /api/me 에 맞춤
      const res = await apiClient.get('/api/me'); 
      
      // 서버 응답 구조에 따라 데이터 추출 (res.data가 바로 MemberDto일 경우)
      if (res.data) {
        setUser(res.data); 
        setIsLoggedIn(true);
        console.log("인증 성공: ", res.data);
      }
    } catch (err) {
      console.error("인증 실패 또는 로그인하지 않음");
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      // 📍 백엔드 경로 /api/auth/logout 에 맞춤
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      console.error("로그아웃 오류:", err);
    } finally {
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
    // 📍 value에 isAdmin을 추가했습니다.
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, checkLoginStatus, login, logout, loading }}>
      {!loading ? children : (
        <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', fontWeight: 'bold' }}>
          잠시만 기다려주세요...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);