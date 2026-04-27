import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../api/axios'; 

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [isLoggingOut, setIsLoggingOut] = useState(false); // 📍 로그아웃 상태 추가

  // 1. 관리자 여부 판별
  const isAdmin = useMemo(() => {
    const role = user?.role?.toString().toUpperCase();
    return role === "ROLE_ADMIN" || role === "ADMIN";
  }, [user]);

  // 2. 로그인 함수
  const login = useCallback((userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  // 3. 로그인 상태 확인 함수 (수정됨)
  const checkLoginStatus = useCallback(async () => {
    // 📍 로그아웃 중이면 절대 서버에 다시 묻지 않음 (중요)
    if (isLoggingOut) return;

    setLoading(true);
    try {
      // 로컬 데이터 먼저 복구 (UI 끊김 방지)
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsLoggedIn(true);
      }

      // 서버 동기화
      const res = await apiClient.get('/me'); 
      if (res.data) {
        setUser(res.data); 
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (err) {
      // 로그아웃 중이 아닐 때만 상태 초기화
      if (!isLoggingOut) {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("user");
      }
    } finally {
      setLoading(false);
    }
  }, [isLoggingOut]);

  // 4. 로그아웃 함수
  const logout = async () => {
    if (isLoggingOut) return; // 중복 클릭 방지
    
    if (!window.confirm("로그아웃 하시겠습니까?")) return; // 사용자 확인

    setIsLoggingOut(true); // 📍 즉시 로그아웃 상태로 전환

    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error("서버 로그아웃 요청 실패:", err);
    } finally {
      // 📍 모든 흔적 박멸
      localStorage.clear();
      sessionStorage.clear();
      
      setUser(null);
      setIsLoggedIn(false);

      alert("성공적으로 로그아웃 되었습니다.");
      
      // 📍 메인으로 이동하며 페이지 완전히 새로고침 (상태 찌꺼기 제거)
      window.location.replace("/");
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, checkLoginStatus, login, logout, loading }}>
      {!loading ? children : (
        <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', fontWeight: 'bold' }}>
          사용자 정보를 확인 중입니다...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);