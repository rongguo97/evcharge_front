import React, { useLayoutEffect, useRef } from 'react';
import '../css/door.css' // 기존 CSS 파일을 이 이름으로 저장하세요.
// import doorvideo from '../image/door영상이미지.mp4'; // 비디오 파일을 이 경로에 저장하세요.
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const text = "CHACARGE";

  useLayoutEffect(() => {
    if (!titleRef.current) return;

    const titleElement = titleRef.current;
    titleElement.innerHTML = ''; // 기존 텍스트 비우기

    // 각 글자를 span으로 감싸서 추가
    [...text].forEach((char) => {
      const span = document.createElement('span');
      span.innerText = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block'; // 변형(transform) 적용을 위해 필요

      // 랜덤한 초기 위치 설정
      const randomX = Math.floor(Math.random() * 1000) - 500;
      const randomY = Math.floor(Math.random() * 1000) - 500;
      const randomRotate = Math.floor(Math.random() * 360);

      span.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
      span.style.transition = 'all 1s ease-out'; // 애니메이션 부드럽게
      
      titleElement.appendChild(span);
    });

    // 약간의 지연 후 애니메이션 시작
    const timer = setTimeout(() => {
      const spans = titleElement.querySelectorAll('span');
      spans.forEach((span) => {
        (span as HTMLElement).style.transform = 'translate(0, 0) rotate(0deg)';
        (span as HTMLElement).style.opacity = '1';
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="video-container">
      {/* 배경 비디오 */}
      <video autoPlay muted loop playsInline className="back-video">
        <source src="/doorvideo.mp4" type="video/mp4" />
        브라우저가 비디오 태그를 지원하지 않습니다.
      </video>

      {/* 애니메이션 타이틀 */}
      <div className="content">
        <h1 id="target-title" ref={titleRef}>
          {/* 자바스크립트에서 span을 동적으로 생성합니다 */}
        </h1>
      </div>

      {/* 로그인 박스 */}
      <div className="login-box">
        <form className="login-product" action="/main">
          <input name="id" placeholder="id" />
          <br />
          <input name="password" type="password" placeholder="password" />
          <button type="submit" className="click-login">login</button>
          <Link to="/main/membership">
          <button type="button" className="membership" onClick={() => navigate('/signup')}>
            회원가입
          </button>
          </Link>
        </form>
      </div>
      
    </div>
    
  );
};

export default Login;