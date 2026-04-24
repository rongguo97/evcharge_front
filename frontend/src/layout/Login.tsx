import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios'; 
import { useAuth } from '../context/AuthContext'; 
import doorVideo from '../image/door영상이미지.mp4';
import '../css/door.css';

const Login: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 타이틀 애니메이션 (기존 유지)
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

  // 🚀 수정된 로그인 로직
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. [보안] 빈 값 및 공백 체크 (이게 없으면 빈 값으로 통과될 수 있음)
    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 정확히 입력해주세요.");
      return;
    }

    try {
      // 2. 서버에 로그인 요청
      const response = await apiClient.post('/auth/login', {
        email: email,
        password: password
      });

      // 3. 성공 처리 (상태 코드 200 확인)
      if (response.status === 200) {
        // ★ 매우 중요: 세션/쿠키 정보를 바탕으로 유저 정보를 즉시 동기화
        await checkLoginStatus(); 
        
        alert("로그인에 성공하였습니다!");
        navigate('/main'); // 성공 시에만 메인으로 이동
      }
    } catch (error: any) {
      // 4. 실패 처리 (아이디/비번 틀림, 서버 에러 등)
      console.error("Login Error:", error);
      if (error.response?.status === 401) {
        alert("이메일 또는 비밀번호가 일치하지 않습니다.");
      } else {
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
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
            type="email" //  일반 text보다 email 타입이 브라우저 검증에 유리
            name="email" 
            placeholder="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // HTML5 유효성 검사 추가
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