import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios'; 

// 1. 컨텍스트 생성
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 

  // 1. 로그인 상태 확인 (기존 유지)
  const checkLoginStatus = async () => {
    try {
      // baseURL이 '.../api' 이므로 '/auth/me'로 요청하면 '.../api/auth/me'가 됩니다.
      const res = await apiClient.get('/auth/me'); 
      setUser(res.data);
      setIsLoggedIn(true);
      console.log("인증 성공: ", res.data);
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
      console.log("인증 실패 또는 로그인하지 않음");
    } finally {
      setLoading(false); // 성공하든 실패하든 로딩 완료
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

// 4. 간편하게 사용하기 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);