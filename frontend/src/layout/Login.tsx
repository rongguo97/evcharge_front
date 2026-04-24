import { useEffect, useRef, useState } from 'react'; // useState 추가
import { useNavigate } from 'react-router-dom';
import doorVideo from '../image/door영상이미지.mp4';
import '../css/door.css';
import apiClient from '../api/axios'; // 1. apiClient 임포트
import { useAuth } from '../context/AuthContext'; // 2. useAuth 임포트
export default function App() {

  
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth(); // 3. 로그인 상태 갱신 함수 가져오기

  // 입력값 관리를 위한 상태
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");

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

  // 4. 실제 로그인 처리 로직
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 백엔드 MemberController의 @PostMapping("/auth/login") 호출
      const response = await apiClient.post('/auth/login', {
        email: memberId, // 사용자가 입력한 값(memberId 상태)을 'email'이라는 이름표로 전송
        password: password
      });

      if (response.status === 200) {
        alert("로그인 성공!");
        // 5. Context의 유저 정보를 최신화 (이걸 해야 헤더에 이름이 뜹니다)
        await checkLoginStatus(); 
        navigate('/main'); // 메인 페이지로 이동
      }
    } catch (error: any) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  const handleMembership = () => {
    navigate('/main/membership');
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
          {/* value와 onChange 연결 */}
          <input 
            name="id" 
            placeholder="id" 
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
          <br />
          <input 
            type="password"
            name="password" 
            placeholder="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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