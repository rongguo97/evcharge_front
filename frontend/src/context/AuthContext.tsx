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

  // 3. 로그인 상태 확인 함수
  const checkLoginStatus = useCallback(async () => {
    if (isLoggingOut) return;

    setLoading(true);
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsLoggedIn(true);
      }

      const res = await apiClient.get('/me'); 
      if (res.data) {
        setUser(res.data); 
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (err) {
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
    if (isLoggingOut) return; 
    if (!window.confirm("로그아웃 하시겠습니까?")) return; 

    setIsLoggingOut(true); 

    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error("서버 로그아웃 요청 실패:", err);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setIsLoggedIn(false);
      alert("성공적으로 로그아웃 되었습니다.");
      window.location.replace("/");
    }
  };

  // 📍 5. 회원 정보 수정 함수 (여기가 추가되었습니다!)
  const updateMember = useCallback(async (updatedData: any) => {
    try {
      // 서버의 @PutMapping("/member/update") 호출
      await apiClient.put('/member/update', updatedData);
      
      // DB 수정 후 서버에서 최신 정보를 다시 가져와 전역 user 상태 동기화
      await checkLoginStatus(); 
      
      return { success: true };
    } catch (err) {
      console.error("회원 정보 수정 실패:", err);
      return { success: false, error: err };
    }
  }, [checkLoginStatus]);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoggedIn, 
        isAdmin, 
        checkLoginStatus, 
        login, 
        logout, 
        updateMember, // 📍 value에도 반드시 등록되어야 함
        loading 
      }}
    >
      {!loading ? children : (
        <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', fontWeight: 'bold' }}>
          사용자 정보를 확인 중입니다...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);