import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Link 제거
import doorVideo from '../image/door영상이미지.mp4';
import '../css/door.css';

export default function App() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate(); // 실제로 사용

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/main'); // 로그인 후 이동할 경로
  };

  const handleMembership = () => {
    navigate('/main/membership'); // 회원가입 경로
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
        <form className="login-product" onSubmit={handleLogin}> {/* action 제거 */}
          <input name="id" placeholder="id" />
          <br />
          <input name="password" placeholder="password" />
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