import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios'; // axios 설정 파일
import { useAuth } from '../context/AuthContext'; // 1. useAuth 추가
import doorVideo from '../image/door영상이미지.mp4';
import '../css/door.css';

const Login: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth(); // 2. Context에서 함수 가져오기

  // 입력값 관리를 위한 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 타이틀 애니메이션 로직 (기존 유지)
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const text = title.innerText;
    title.innerHTML = '';
    [...text].forEach((char) => {
      const span = document.createElement('span');
      span.innerText = char === ' ' ? '\u00A0' : char;
      const randomX = Math.floor(Math.random() * 1000) - 500;
      const randomY = Math.floor(Math.random() * 1000) - 500;
      const randomRotate = Math.floor(Math.random() * 360);
      span.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
      title.appendChild(span);
    });
    const timer = setTimeout(() => {
      title.classList.add('active');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 3. 수정된 로그인 요청 로직
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // 백엔드 /api/auth/login에 데이터 전송
      const response = await apiClient.post('/auth/login', {
        email: email,
        password: password
      });

      if (response.status === 200) {
        // ★ 핵심: 로그인이 성공했으니 서버에 "나 누구야?"라고 다시 물어서 
        // AuthProvider의 isLoggedIn 상태를 true로 동기화합니다.
        await checkLoginStatus(); 
        
        alert("로그인 성공! 반갑습니다.");
        navigate('/main'); // 상태가 업데이트된 후 안전하게 이동
      }
    } catch (error: any) {
      console.error("로그인 에러:", error);
      alert("이메일 또는 비밀번호가 틀렸습니다.");
    }
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
            name="email" 
            placeholder="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <input 
            type="password" 
            name="password" 
            placeholder="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="click-login">login</button>
          
          <button 
            type="button" 
            className="membership" 
            onClick={() => navigate('/main/membership')}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;