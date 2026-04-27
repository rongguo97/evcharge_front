import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import doorVideo from '../image/door영상이미지.mp4';
import '../css/door.css';
import apiClient from '../api/axios'; 
import { useAuth } from '../context/AuthContext'; 

// 컴포넌트 이름을 App 대신 Door로 설정하여 App.tsx와의 혼동을 방지합니다.
export default function Door() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth();

  // 1. 상태 관리 단일화 (중복 선언 삭제)
  const [memberId, setMemberId] = useState(""); // 화면상의 id 입력값
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // 2. 로그인 처리 로직 최적화
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      /**
       * 💡 백엔드 전송 규격:
       * 회원가입 시 'email' 필드를 사용했으므로, 로그인 시에도 'email'로 보냅니다.
       * 만약 403 에러가 계속된다면 주소를 '/auth/login'으로 수정해보세요.
       */
      const response = await apiClient.post('/auth/login', {
        email: memberId, 
        password: password
      });

      if (response.status === 200) {
        // 토큰 저장 (백엔드 응답 구조에 따라 response.data.accessToken 등으로 수정)
        const token = response.data.accessToken || response.data.token;
        if (token) {
          localStorage.setItem('accessToken', token);
        }

        alert("로그인 성공!");
        await checkLoginStatus(); // Header 등에 유저 정보 반영
        navigate('/main'); 
      }
    } catch (error: any) {
      console.error("로그인 실패 상세:", error.response?.data || error);
      alert(error.response?.data?.message || "아이디 또는 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMembership = () => {
    // router.tsx 설정에 따라 '/membership' 또는 '/main/membership'으로 이동
    navigate('/membership'); 
  };

  return (
    <div className="video-container">
      <video autoPlay muted loop playsInline className="back-video">
        <source src={doorVideo} type="video/mp4" />
        브라우저가 비디오 태그를 지원하지 않습니다.
      </video>

      <div className="content">
        <h1 id="target-title" ref={titleRef}>
          CHACARGE
        </h1>
      </div>

      <div className="login-box">
        <form className="login-product" onSubmit={handleLogin}>
          <input 
            type="text"
            name="id" 
            placeholder="ID (Email)" 
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
          />
          <br />
          <input 
            type="password"
            name="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="click-login" disabled={isLoading}>
            {isLoading ? "Loading..." : "login"}
          </button>
          
          <button type="button" className="membership" onClick={handleMembership}>
            membership 
          </button>
        </form>
      </div>
    </div>
  );
}