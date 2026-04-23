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
      // 백엔드의 /auth/logout 호출
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error("로그아웃 요청 중 오류 발생:", err);
    } finally {
      // 상태 초기화 및 리다이렉트
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
    // 📍 value에 logout과 loading을 모두 포함시켜야 다른 컴포넌트에서 에러가 안 납니다.
    <AuthContext.Provider value={{ user, isLoggedIn, setIsLoggedIn, checkLoginStatus, logout, loading }}>
      {/* 📍 로딩 중일 때는 앱 콘텐츠(children) 대신 메시지를 보여줘서 오류를 방지합니다. */}
      {!loading ? children : (
        <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px', color: '#666' }}>
          인증 정보 확인 중...
        </div>
      )}
    </AuthContext.Provider>
  );
};

// 4. 간편하게 사용하기 위한 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("useAuth must be used within an AuthProvider");
  }
  return context;
};