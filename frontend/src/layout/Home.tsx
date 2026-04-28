import React, { useEffect } from 'react';
import StationList from '../pages/StationList'; 
import carVideo from '../image/main영상이미지.mp4';
import heroImg from '../image/충전소.png';
import Footer from '../layout/Footer';
import { useAuth } from '../context/AuthContext'; // 유저 상태 연동
import '../css/main.css';
import Header from '../layout/Header';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { isLoggedIn, user } = useAuth(); //  유저 정보 가져오기

  useEffect(() => {
    // 페이지 진입 시 스크롤 최상단 이동 및 데이터 Prefetch 등이 필요할 때 사용
    console.log("메인 페이지 로드됨. 로그인 상태:", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <div className="home-container">
  <Header />
      {/* 1. 상단: 동영상 섹션 (동적 텍스트 적용) */}
      <section className="hero">
        <div className="video-background">
          <video autoPlay muted loop playsInline className="bg-video">
            <source src={carVideo} type="video/mp4" />
          </video>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            {/* 💡 하드코딩 대신 로그인 유저 이름 반영 가능 */}
            {isLoggedIn ? `${user?.memberName}님을 위한 스마트한 충전` : "친환경 이동을 더 똑똑하게"}
          </h1>
          <p className="hero-sub">Save time, Reserve your charge</p>
        </div>
      </section>


      {/* 2. 중간: 지도 및 충전소 섹션 */}
      {/* 💡 StationList 내부에서 이미 apiClient를 통해 DB 데이터를 가져오고 있어야 함 */}
      <section
        className="map-section"
        style={{
          width: "100%",
          height: "90vh",
          backgroundColor: "#f8f9fa",
          padding: "0",
        }}
      >
        <br />
        <StationList />
      </section>

      {/* 3. 메인 배너 섹션: 사이드바 링크 및 레이아웃 유지 */}
      <main className="hero-section">
        {/* 배경 이미지 */}
        <img src={heroImg} alt="배경" className="hero-bg" />

        <nav className="sidebar">
          <ul>
            {/* 💡 하드코딩된 #none 대신 실제 라우터 주소 연동 */}
           <li><Link to="/main/reservation">충전소예약</Link></li>
            <li><Link to="/main/brand">서비스개요</Link></li>
            <li><Link to="/main/app">APP서비스</Link></li>
            <li><Link to="/main/customer-center">서비스센터</Link></li>
          </ul>
        </nav>
        
        <div className="main-content">
          <h1>READY TO CHARGE</h1>
          {/* 로그인 상태에 따라 버튼 추가 노출 가능 */}
          {!isLoggedIn && (
            <a href="/login" className="main-start-btn">지금 시작하기</a>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;