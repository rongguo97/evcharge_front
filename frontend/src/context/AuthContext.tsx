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

  // 3. 앱이 처음 켜질 때 실행
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setIsLoggedIn, checkLoginStatus, loading }}>
      {/* 로딩 중일 때는 하위 컴포넌트(지도 등)를 렌더링하지 않음 */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 4. 간편하게 사용하기 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);