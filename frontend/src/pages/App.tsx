import React from 'react';
import '../css/app.css'; // 기존 app.css 내용을 이쪽으로 옮겨주세요.

// 주요 기능 데이터 타입 정의
interface Feature {
  icon: string;
  title: string;
  description: React.ReactNode; // <br> 태그 사용을 위해 ReactNode로 설정
}

const AppIntro: React.FC = () => {
  // 주요 기능 데이터 배열
  const features: Feature[] = [
    {
      icon: "📍",
      title: "실시간 위치 기반 찾기",
      description: <>내 주변 가장 가까운 충전소와<br />실시간 가동 현황을 확인하세요.</>
    },
    {
      icon: "📅",
      title: "스마트 예약 시스템",
      description: <>대기 시간 없이 원하는 시간에<br />미리 충전기를 예약하세요.</>
    },
    {
      icon: "💳",
      title: "원터치 간편 결제",
      description: <>등록한 카드로 터치 한 번에<br />결제하고 포인트를 적립하세요.</>
    },
  ];

  return (
    <div className="app-intro-page">
      {/* 히어로 섹션 */}
      <section className="app-hero">
        <div className="container app-hero-flex">
          <div className="hero-text">
            <span className="badge">CHARCAGE APP</span>
            <h1>
              충전의 시작부터 끝까지<br />
              <span>하나의 앱으로 간편하게</span>
            </h1>
            <p>
              전국 충전소 검색부터 예약, 결제까지<br />
              차카지 앱 하나면 충분합니다.
            </p>
            
            <div className="download-btns">
              <a href="#" className="btn-store">
                <i className="fab fa-apple"></i> App Store
              </a>
              <a href="#" className="btn-store">
                <i className="fab fa-google-play"></i> Google Play
              </a>
            </div>
          </div>

          <div className="hero-image">
            <div className="phone-mockup">
              {/* 이미지 경로는 프로젝트 public 폴더 구조에 맞춰 수정하세요 */}
              <img src="/image/appwindow.png" alt="앱 화면" />
            </div>
          </div>
        </div>
      </section>

      {/* 사이드 퀵 메뉴 (공통 컴포넌트로 분리 권장) */}
      <aside className="side-quick-menu">
        <a href="/mypage" className="quick-btn my-page">마 이 페 이 지</a>
        <a href="#" className="quick-btn admin-page">관 리 자 페 이 지</a>
      </aside>

      {/* 주요 기능 섹션 */}
      <section className="app-features container">
        <div className="section-title">
          <h2>주요 기능</h2>
          <div className="bar"></div>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 푸터 영역 (공통 컴포넌트로 분리 권장) */}
      <footer className="white-footer">
        <div className="container footer-flex">
          <div className="footer-logo">
            <img src="/image/logo.png" alt="CHARCAGE" />
          </div>
          <div className="footer-info">
            <p>회사이름 : 차카지</p>
            <p>대표이사 : 이팀이지</p>
            <p>사업자번호 : 123-45-67890</p>
            <p>주소 : 부산광역시 진구 범내골로</p>
            <p>E-mail : help@charcage.com</p>
            <p className="copy">&copy; 2026 CHARCAGE. All Rights Reserved.</p>
          </div>
          <div className="footer-contact">
            <p>영업 및 협력문의 <strong>1577-1234</strong></p>
            <p>비즈니스 투자문의 <strong>1577-1234</strong></p>
            <p>고객센터 <strong>1577-1234</strong></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppIntro;