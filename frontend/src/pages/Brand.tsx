import React, { useEffect } from 'react';
// CSS 파일 경로는 프로젝트 구조에 맞게 수정하세요.
import '../css/Brand.css';
import '../js/brand.js';

interface StatProps {
  num: string;
  suffix: string;
  label: string;
}

const StatItem: React.FC<StatProps> = ({ num, suffix, label }) => (
  <div className="hero-stat">
    <div className="hero-stat-num">{num}<span>{suffix}</span></div>
    <div className="hero-stat-label">{label}</div>
  </div>
);

const Brand: React.FC = () => {
  
  // Brand.js에 있던 Scroll Reveal 로직을 useEffect로 구현
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="brand-page-container">
      {/* ──────────────── 브랜드 소개 Hero  ──────────────── */}
      <section className="hero">
        <div className="hero-bg-mesh"></div>
        <div className="hero-lines"></div>
        <div className="hero-content">
          <div className="hero-tag">
            <div className="hero-tag-dot"></div>
            <span>EV Charging Platform</span>
          </div>
          <h1>친환경 이동을<br /><em>더 똑똑하게</em></h1>
          <p className="hero-sub">
            전국 충전소 검색부터 예약, 결제까지 차카지 앱 하나면 충분합니다. <br />
            <strong className="hero-sub-en">Save time. Reserve your charge.</strong>
          </p>
          <div className="hero-btns">
            <a href="#how" className="btn-fill">
              <AppleIcon /> App Store
            </a>
            <a href="#how" className="btn-fill btn-fill--ghost">
              <PlayStoreIcon /> Google Play
            </a>
            <a href="#brand" className="btn-ghost">브랜드 소개 →</a>
          </div>
        </div>
        <div className="hero-stat-row">
          <StatItem num="12,000" suffix="+" label="전국 충전소" />
          <StatItem num="98" suffix="%" label="실시간 가용률" />
          <StatItem num="50만" suffix="+" label="누적 사용자" />
        </div>
      </section>

      {/* ──────────────── BRAND ──────────────── */}
      <section id="brand" className="section-wrap brand-section">
        <div className="brand-inner">
          <div className="brand-visual">
            <div className="brand-circle-outer">
              <div className="brand-circle-inner">
                <div className="big-letter">CC</div>
                <div className="small-text">CHARCAGE</div>
              </div>
            </div>
            <div className="brand-dot"></div>
            <div className="brand-dot"></div>
            <div className="brand-dot brand-dot--teal"></div>
          </div>
          <div className="brand-text">
            <div className="section-header reveal">
              <div className="section-eyebrow">브랜드 소개</div>
              <div className="section-title">전기차 충전 시장을<br />선도하는 <em>차카지</em></div>
              <p className="section-desc">국내 최초 민간 전기차 충전 서비스 사업자로, 풍부한 경험과 기술력을 바탕으로 안정적이고 효율적인 충전 솔루션을 제공합니다.</p>
            </div>
            <div className="brand-pillars">
              <Pillar num="01" title="혁신 기술 기반" desc="최신 e-Mobility 플랫폼과 AI 기반 충전소 운영으로 미래 이동성 산업을 리딩합니다." delay="1" />
              <Pillar num="02" title="고객 가치 우선" desc="충전인프라 운영 노하우를 통해 사용자 경험을 최우선으로 하는 서비스를 제공합니다." delay="2" />
              <Pillar num="03" title="지속가능한 성장" desc="친환경 이동 문화 확산을 위해 지속적으로 충전 인프라를 확장하고 기술을 발전시킵니다." delay="3" />
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* ──────────────── SERVICE ──────────────── */}
      <section id="service" className="section-wrap service-section">
        <div className="section-header center reveal">
          <div className="section-eyebrow">사업 소개</div>
          <div className="section-title">차카지가 제공하는<br /><em>3가지 핵심 사업</em></div>
          <p className="section-desc">충전 인프라 개발·설치·관리에서 충전 서비스까지, 원스탑 충전 솔루션을 제공하는 기업입니다.</p>
        </div>
        <div className="service-cards">
          <ServiceCard 
            delay="1" 
            tag="Infrastructure" 
            title="충전기 구축 사업" 
            desc="충전기 선정부터 설치까지 토탈 충전 솔루션을 제공합니다."
            items={["최적 충전기 기종 컨설팅", "설치 공사 및 전기 인허가", "사후 유지보수 서비스", "급·완속 충전기 전문 시공"]}
            icon={<path d="M7 2v11h3v9l7-12h-4l4-8z"/>}
          />
          <ServiceCard 
            delay="2" 
            tag="Operation" 
            title="위탁 운영 사업" 
            desc="전기 신사업 자격 취득 없이 충전기 운영 대행 서비스를 제공합니다."
            items={["충전기 운영 대행 서비스", "실시간 모니터링 시스템", "장애 발생 즉시 대응", "수익 정산 및 보고"]}
            icon={<path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>}
          />
          <ServiceCard 
            delay="3" 
            tag="Charging Service" 
            title="전기차 충전 사업" 
            desc="충전인프라 운영 노하우를 통해 최상의 고객 서비스를 제공합니다."
            items={["전국 충전소 네트워크 운영", "앱 기반 예약·결제 서비스", "멤버십 혜택 및 포인트", "24시간 고객센터 운영"]}
            icon={<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>}
          />
        </div>
      </section>

      {/* ──────────────── HOW IT WORKS ──────────────── */}
      <section id="how" className="how-section">
        <div className="section-header center reveal">
          <div className="section-eyebrow">이용 방법</div>
          <div className="section-title section-title--white">4단계로 완성되는<br /><em>스마트 충전 경험</em></div>
          <p className="section-desc">복잡한 충전 걱정은 이제 그만. 차카지 앱 하나로 간편하게.</p>
        </div>
        <div className="how-steps">
          <Step num="01" title="앱 설치 & 가입" desc="App Store 또는 Google Play에서 차카지 앱을 설치하고 간편하게 회원가입하세요" delay="1" />
          <Step num="02" title="충전소 검색" desc="위치 기반으로 가장 가까운 충전소를 탐색하고 실시간 빈 자리를 확인하세요" delay="2" />
          <Step num="03" title="예약 & 결제" desc="원하는 시간대를 선택하고 앱에서 바로 결제. 카드 등록 한 번으로 매번 편리하게" delay="3" />
          <Step num="04" title="QR 스캔 & 충전" desc="도착 후 QR 스캔 한 번으로 즉시 충전 시작. 완료 알림까지 앱으로 받아보세요" delay="4" />
        </div>
      </section>

      {/* ... 나머지 SOLUTION 및 MGMT 섹션도 동일한 방식으로 컴포넌트화 가능 ... */}
    </div>
  );
};

// ──────────────── 내부 서브 컴포넌트들 ────────────────

const Pillar: React.FC<{num: string, title: string, desc: string, delay: string}> = ({ num, title, desc, delay }) => (
  <div className={`brand-pillar reveal reveal-delay-${delay}`}>
    <div className="pillar-num">{num}</div>
    <div className="pillar-text">
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  </div>
);

const ServiceCard: React.FC<{delay: string, tag: string, title: string, desc: string, items: string[], icon: React.ReactNode}> = ({ delay, tag, title, desc, items, icon }) => (
  <div className={`service-card reveal reveal-delay-${delay}`}>
    <div className="service-card-top">
      <div className="service-card-icon">
        <svg viewBox="0 0 24 24">{icon}</svg>
      </div>
      <div className="tag">{tag}</div>
      <h3>{title}</h3>
    </div>
    <div className="service-card-body">
      <p>{desc}</p>
      <ul>
        {items.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </div>
  </div>
);

const Step: React.FC<{num: string, title: string, desc: string, delay: string}> = ({ num, title, desc, delay }) => (
  <div className={`how-step reveal reveal-delay-${delay}`}>
    <div className="step-circle">
      <div className="step-num-label">{num}</div>
    </div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

// 아이콘 컴포넌트 (가독성을 위해 분리)
const AppleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const PlayStoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M3.18 23.76c.29.16.62.22.96.16l13.2-7.62L14.6 13.5 3.18 23.76zM20.6 10.27l-2.84-1.64L14.6 12l3.16 3.16 2.84-1.64c.81-.47.81-1.78 0-2.25zM2.01.24C1.73.55 1.56.99 1.56 1.56v20.88c0 .57.17 1.01.45 1.32L3.18.24 2.01.24zM14.6 10.5L3.18.24 14.6 10.5z"/>
  </svg>
);

export default Brand;