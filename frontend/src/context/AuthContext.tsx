import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios'; 

// 1. 컨텍스트 생성
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 

  // 2. 로그인 상태 확인 함수
  const checkLoginStatus = async () => {
    try {
      // 백엔드 주소에 맞춰 '/auth/me' 호출
      const res = await apiClient.get('/auth/me'); 
      setUser(res.data);
      setIsLoggedIn(true);
      console.log("인증 성공: ", res.data);
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
      console.log("인증 실패 또는 로그인하지 않음");
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  // 3. 로그아웃 함수
  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error("로그아웃 요청 중 오류 발생:", err);
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
    // 📍 모든 상태(user, loading 등)와 함수(logout 등)를 하나의 value에 넣습니다.
    <AuthContext.Provider value={{ user, isLoggedIn, setIsLoggedIn, checkLoginStatus, logout, loading }}>
      {/* 로딩 중일 때는 아무것도 안 보여주거나 로딩 스피너를 넣을 수 있습니다. */}
      {!loading ? children : <div style={{textAlign:'center', marginTop:'50px'}}>인증 정보 확인 중...</div>}
    </AuthContext.Provider>
  );
};

// 4. 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("useAuth must be used within an AuthProvider");
  }
  return context;
};