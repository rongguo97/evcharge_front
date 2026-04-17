import React, { useEffect, useState } from 'react';
import Head from 'next/head'; // Next.js 환경이 아니라면 일반 <head> 대응 필요

const MainPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Leaflet 지도 초기화 로직
  useEffect(() => {
    // window 객체가 존재할 때(클라이언트 사이드) 실행
    if (typeof window !== 'undefined') {
      // dynamic import 등을 통해 Leaflet 초기화 로직을 여기에 작성합니다.
      // 예: const L = require('leaflet');
      // const map = L.map('map').setView([35.1595, 129.0602], 13);
    }
  }, []);

  return (
    <div className="layout-wrapper">
      <Head>
        <title>CHARCAGE | 전기차 충전 예약</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </Head>

      {/* NAV / 상단 메뉴바 */}
      <header className="navbar">
        <div className="nav-logo">CHARCAGE</div>
        
        <nav className="nav-links">
          {[
            { id: '1', label: 'CHARCAGE', active: true },
            { id: '2', label: '충전소예약' },
            { id: '3', label: '서비스' },
            { id: '4', label: '고객지원' },
          ].map((menu) => (
            <div 
              key={menu.id} 
              className="nav-item-wrapper" 
              onMouseEnter={() => setActiveMenu(menu.id)}
            >
              <a href="#" className={`nav-item ${menu.active ? 'active' : ''}`}>
                {menu.label}
              </a>
            </div>
          ))}
        </nav>

        <div className="nav-right">
          <div className="nav-log">log</div>
        </div>
      </header>

      {/* Mega Menu Panel */}
      <div 
        className={`mega-menu-panel ${activeMenu ? 'show' : ''}`} 
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="mega-container">
          {activeMenu === '1' && (
            <div className="mega-content" id="menu-1">
              <div className="mega-column">
                <h3>브랜드 스토리</h3>
                <ul>
                  <li><a href="#">CHARCAGE 소개</a></li>
                </ul>
              </div>
            </div>
          )}
          {activeMenu === '2' && (
            <div className="mega-content" id="menu-2">
              <div className="mega-column">
                <h3>충전소 타입</h3>
                <ul>
                  <li><a href="#">급속 충전소</a></li>
                  <li><a href="#">완속 충전소</a></li>
                  <li><a href="#">테슬라 슈퍼차저</a></li>
                </ul>
              </div>
            </div>
          )}
          {activeMenu === '3' && (
            <div className="mega-content" id="menu-3">
              <div className="mega-column">
                <h3>진행중인 이벤트</h3>
                <ul>
                  <li><a href="#">출석 체크 이벤트</a></li>
                  <li><a href="#">친구 초대 보너스</a></li>
                  <li><a href="#">리뷰 작성 이벤트</a></li>
                </ul>
              </div>
            </div>
          )}
          {activeMenu === '4' && (
            <div className="mega-content" id="menu-4">
              <div className="mega-column">
                <h3>문의하기</h3>
                <ul>
                  <li><a href="/notice">공지사항</a></li>
                  <li><a href="/inquiry">1:1 온라인 문의</a></li>
                  <li><a href="/faq">자주묻는질문</a></li>
                  <li><a href="/cs">고객센터</a></li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메인 동영상 화면 */}
      <section className="hero">
        <div className="video-background">
          <video autoPlay muted loop playsInline className="bg-video">
            <source src="/videos/main_video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">친환경 이동을 더 똑똑하게</h1>
          <p className="hero-sub">Save time, Reserve your charge</p>
        </div>
      </section>

      {/* 2번째 section: 지도 및 퀵메뉴 */}
      <div className="container">
        <div className="search-section">
          <form className="search" onSubmit={(e) => e.preventDefault()}>
            <input type="search" className="search-box" placeholder="충전소 위치를 검색하세요" />
            <button type="submit" className="search-btn">검색</button>
          </form>
        </div>

        <div className="content-grid">
          <div id="map" style={{ height: '500px' }}></div>
          <div className="quick-menu">
            <div className="menu-card charging">
              <div className="card-overlay"><span>충전소 찾기</span></div>
            </div>
            <div className="menu-card favorites">
              <div className="card-overlay"><span>즐겨찾기</span></div>
            </div>
            <div className="pay-row">
              <div className="menu-card evpay">
                <div className="card-overlay"><span>EV PAY</span></div>
              </div>
              <div className="menu-card qnnfc">
                <div className="card-overlay"><span>QR/NFC 스캔</span></div>
              </div>
            </div>
            <div className="menu-card community">
              <div className="card-overlay"><span>커뮤니티</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3번째 화면 */}
      <main className="hero-section">
        <nav className="sidebar">
          <ul>
            <li><a href="#">충전예약</a></li>
            <li><a href="#">서비스개요</a></li>
            <li><a href="#">App서비스</a></li>
            <li><a href="#">서비스</a></li>
          </ul>
        </nav>
        <div className="main-content">
          <h1>READY TO CHARGE</h1>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <img src="/images/brand_logo.png" alt="차카지 로고" />
          </div>
          <div className="footer-info">
            <p><strong>회사이름 :</strong> 차카지</p>
            <p><strong>대표이사 :</strong> 이팀이지</p>
            <p><strong>사업자번호 :</strong> 123-4567-8910</p>
            <p><strong>통신판매업신고 :</strong> 1238-4657-1236</p>
            <p><strong>주소 :</strong>부산 부산진구 중앙대로 00 OO빌딩</p>
            <p><strong>E-mail :</strong> chakaji@mail.com</p>
          </div>
          <div className="footer-contact">
            <p>영업및 협력문의</p>
            <h3>1577 - 1234</h3>
            <p>비즈니스 투자문의</p>
            <h3>1577 - 1234</h3>
            <p>고객센터</p>
            <h3>1577 - 1234</h3>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;