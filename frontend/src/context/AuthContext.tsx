import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../api/axios'; 

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 

  // 1. 관리자 여부 판별 (더 강력한 체크)
  const isAdmin = useMemo(() => {
    const role = user?.role?.toString().toUpperCase();
    return role === "ROLE_ADMIN" || role === "ADMIN";
  }, [user]);

  // 2. 로그인 성공 시 호출 (LocalStorage에 저장하여 새로고침 대비)
  const login = useCallback((userData: any) => {
    console.log("로그인 시도 데이터:", userData);
    setUser(userData);
    setIsLoggedIn(true);
    // 민감한 정보 제외하고 저장하는 것이 좋으나, 현재는 전체 저장으로 해결
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  // 3. 로그인 상태 확인 함수 (새로고침 시 실행)
  const checkLoginStatus = async () => {
    setLoading(true);
    try {
      // 로컬 스토리지에 정보가 있다면 먼저 복구 (UI 끊김 방지)
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsLoggedIn(true);
      }

      // 서버에서 최신 정보 가져와 동기화
      const res = await apiClient.get('/me'); 
      if (res.data) {
        console.log("서버 인증 데이터 확인:", res.data); // 여기서 role이 있는지 꼭 확인!
        setUser(res.data); 
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(res.data)); // 최신 정보 갱신
      }
    } catch (err) {
      console.error("인증 실패: 로그인이 만료되었거나 정보가 없습니다.");
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // 4. 로그아웃 함수
  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      console.error("로그아웃 서버 통신 오류:", err);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("user"); // 저장소 비우기 필수
      alert("로그아웃 되었습니다.");
      window.location.href = "/"; 
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