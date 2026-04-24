import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios'; 
import { useAuth } from '../context/AuthContext'; 
import doorVideo from '../image/door영상이미지.mp4';
import '../css/door.css';

export default function Door() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  
  // 📍 login 함수를 Context에서 가져옵니다. (QuickMenu를 깨우는 스위치)
  const { login } = useAuth(); 

  const [memberId, setMemberId] = useState(''); 
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const text = title.innerText;
    title.innerHTML = "";
    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.innerText = char === " " ? "\u00A0" : char;
      title.appendChild(span);
    });
    setTimeout(() => title.classList.add("active"), 100);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !password) return alert("입력란을 채워주세요.");
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        email: memberId, 
        password: password
      });

      console.log("🔥 서버 응답 데이터:", response.data);

      let token = null;
      if (typeof response.data === 'object') {
        token = response.data.accessToken || response.data.token || response.data.result?.accessToken;
      } 
      
      if (!token) {
        token = response.headers['authorization'] || response.headers['Authorization'];
      }

      if (token) {
        const finalToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        localStorage.setItem('accessToken', finalToken);
        
        // 📍 [가장 중요] 전광판 불 켜기! 
        // 서버에서 준 유저 정보(response.data)를 Context에 즉시 주입합니다.
        // 이때 QuickMenu가 반응해서 화면에 나타납니다.
        login(response.data); 

        alert("로그인에 성공했습니다!");
        navigate('/main');
      } else {
        alert("인증 토큰을 찾을 수 없습니다.");
      }
    } catch (error: any) {
      console.error("로그인 실패:", error.response?.data || error);
      alert(error.response?.data?.message || "로그인 정보가 일치하지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="video-container">
      <video autoPlay muted loop playsInline className="back-video">
        <source src={doorVideo} type="video/mp4" />
      </video>
      <div className="content"><h1 ref={titleRef}>CHACARGE</h1></div>
      <div className="login-box">
        <form className="login-product" onSubmit={handleLogin}>
          <input placeholder="이메일" value={memberId} onChange={(e) => setMemberId(e.target.value)} disabled={isLoading} />
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
          <button type="submit" className="click-login" disabled={isLoading}>{isLoading ? "..." : "login"}</button>
          <button type="button" className="membership" onClick={() => navigate('/membership')}>membership</button>
        </form>
      </div>
    </div>
  );
}