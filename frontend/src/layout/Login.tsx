import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios'; // 💡 만들어둔 axios 인스턴스
import { useAuth } from '../context/AuthContext'; // 💡 인증 컨텍스트
import doorVideo from '../image/door영상이미지.mp4';
import '../css/door.css';

export default function App() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth(); // ✅ 로그인 후 상태를 즉시 갱신하기 위함

  // 1. 입력값 상태 관리 (DB로 보낼 데이터)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 타이틀 애니메이션 (기존 유지)
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

  // 🚀 2. 실제 로그인 로직 (DB 연동)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 백엔드 로그인 API 호출 (주소는 백엔드 설계에 맞춤)
      const response = await apiClient.post('/api/auth/login', {
        email: email,
        password: password
      });

      if (response.status === 200) {
        // JWT 토큰 저장 (백엔드가 주는 구조에 따라 response.data.accessToken 등 확인)
        const token = response.data.accessToken || response.data.result.accessToken;
        if (token) {
          localStorage.setItem('accessToken', token);
        }

        // 중요: 토큰 저장 후 바로 유저 정보를 불러와 전역 상태(Header 등) 갱신
        await checkLoginStatus(); 

        alert("성공적으로 로그인되었습니다!");
        navigate('/main'); 
      }
    } catch (error: any) {
      console.error("로그인 에러:", error);
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleMembership = () => {
    navigate('/membership'); 
  };

  return (
    <div className="video-container">
      <video autoPlay muted loop playsInline className="back-video">
        <source src={doorVideo} type="video/mp4" />
        브라우저가 비디오 태그를 지원하지 않습니다.
      </video>

      <div className="content">
        <h1 id="target-title" ref={titleRef}>CHACARGE</h1>
      </div>

      <div className="login-box">
        <form className="login-product" onSubmit={handleLogin}>
          {/* 3. value와 onChange 연결 (하드코딩 방지) */}
          <input 
            type="email" 
            placeholder="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <input 
            type="password" 
            placeholder="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="click-login">
            login
          </button>
          <button type="button" className="membership" onClick={handleMembership}>
            membership
          </button>
        </form>
      </div>
    </div>
  );
}