import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios'; 
import { useAuth } from '../context/AuthContext'; 
import doorVideo from '../image/door영상이미지.mp4';
import '../css/door.css';

// ✅ 수정 포인트 1: 함수 이름을 반드시 'Door'로 설정 (App과 충돌 방지)
export default function Door() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth();

  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 애니메이션 로직
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const text = title.innerText;
    title.innerHTML = "";
    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.innerText = char === " " ? "\u00A0" : char;
      const randomX = Math.floor(Math.random() * 1000) - 500;
      const randomY = Math.floor(Math.random() * 1000) - 500;
      const randomRotate = Math.floor(Math.random() * 360);
      span.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
      title.appendChild(span);
    });
    const timer = setTimeout(() => {
      title.classList.add("active");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 로그인 처리 로직
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberId || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ 수정 포인트 2: 백엔드 DTO가 'email'을 요구한다면 키값을 email로 바꾸세요.
      // 현재는 일단 memberId로 보냅니다.
      const response = await apiClient.post('/api/auth/login', {
        memberId: memberId, 
        password: password
      });

      if (response.status === 200) {
        const token = response.data.accessToken || response.data.result?.token;
        
        if (token) {
          localStorage.setItem('accessToken', token);
          
          // ✅ 수정 포인트 3: 헤더에 즉시 토큰 주입 (로그인 직후 통신 오류 방지)
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          await checkLoginStatus(); // 전역 유저 상태 업데이트
          alert("로그인에 성공했습니다!");
          navigate('/main');
        } else {
          alert("응답에서 인증 토큰을 찾을 수 없습니다.");
        }
      }
    } catch (error: any) {
      console.error("로그인 실패 상세:", error.response || error);
      const errorMsg = error.response?.data?.message || "아이디 또는 비밀번호가 일치하지 않습니다.";
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMembership = () => {
    // ✅ 수정 포인트 4: 절대 경로 '/' 포함 확인
    navigate('/membership');
  };

  return (
    <div className="video-container">
      <video autoPlay muted loop playsInline className="back-video">
        <source src={doorVideo} type="video/mp4" />
      </video>

      <div className="content">
        <h1 id="target-title" ref={titleRef}>CHACARGE</h1>
      </div>

      <div className="login-box">
        <form className="login-product" onSubmit={handleLogin}>
          <input 
            name="id" 
            placeholder="아이디" 
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            disabled={isLoading}
            autoComplete="username"
          />
          <br />
          <input 
            type="password" 
            name="password" 
            placeholder="비밀번호" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button type="submit" className="click-login" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "login"}
          </button>
          <Link to="/main/membership">
            <button
              type="button"
              className="membership"
              onClick={handleMembership}
            >
              membership
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
