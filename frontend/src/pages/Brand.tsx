import React, { useEffect } from "react";
import "../css/brand.css";
import "../js/Brand.js";
import "../layout/Header.js";
import Footer from "../layout/Footer.js";

const BrandPage: React.FC = () => {
  useEffect(() => {
    // 스크롤 애니메이션 관찰자 설정
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // brand.css에 정의된 .reveal.visible (또는 .active)와 일치해야 합니다.
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="brand-container">
      {/* ──────────────── HERO SECTION ──────────────── */}
      <section className="hero">
        <div className="hero-bg-mesh"></div>
        <div className="hero-lines"></div>
        <div className="hero-content">
          <div className="hero-tag">
            <div className="hero-tag-dot"></div>
            <span>EV Charging Platform</span>
          </div>
          <h1>
            친환경 이동을
            <br />
            <em>더 똑똑하게</em>
          </h1>
          <p className="hero-sub">
            전국 충전소 검색부터 예약, 결제까지 차카지 앱 하나면 충분합니다.{" "}
            <br />
            <strong className="hero-sub-en">
              Save time. Reserve your charge.
            </strong>
          </p>
          <div className="hero-btns">
            <a href="#how" className="btn-fill">
              <AppleIcon /> App Store
            </a>
            <a href="#how" className="btn-fill btn-fill--ghost">
              <GooglePlayIcon /> Google Play
            </a>
            <a href="#brand" className="btn-ghost">
              브랜드 소개 →
            </a>
          </div>
        </div>

        <div className="hero-stat-row">
          <StatItem num="12,000" unit="+" label="전국 충전소" />
          <StatItem num="98" unit="%" label="실시간 가용률" />
          <StatItem num="50만" unit="+" label="누적 사용자" />
        </div>
      </section>

      {/* ──────────────── BRAND SECTION (이전 64라인 부근) ──────────────── */}
      <section id="brand" className="section-wrap brand-section">
        <div className="brand-inner">
          <div className="brand-visual reveal">
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
              <h2 className="section-title">
                전기차 충전 시장을
                <br />
                선도하는 <em>차카지</em>
              </h2>
              <p className="section-desc">
                국내 최초 민간 전기차 충전 서비스 사업자로, 풍부한 경험과
                기술력을 바탕으로 안정적이고 효율적인 충전 솔루션을 제공합니다.
              </p>
            </div>
            <div className="brand-pillars">
              <PillarItem
                num="01"
                title="혁신 기술 기반"
                desc="최신 e-Mobility 플랫폼과 AI 기반 충전소 운영으로 미래 이동성 산업을 리딩합니다."
                delay={1}
              />
              <PillarItem
                num="02"
                title="고객 가치 우선"
                desc="충전인프라 운영 노하우를 통해 사용자 경험을 최우선으로 하는 서비스를 제공합니다."
                delay={2}
              />
              <PillarItem
                num="03"
                title="지속가능한 성장"
                desc="친환경 이동 문화 확산을 위해 지속적으로 충전 인프라를 확장하고 기술을 발전시킵니다."
                delay={3}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* ──────────────── SERVICE SECTION ──────────────── */}
      <section id="service" className="section-wrap service-section">
        <div className="section-header center reveal">
          <div className="section-eyebrow">사업 소개</div>
          <h2 className="section-title">
            차카지가 제공하는
            <br />
            <em>3가지 핵심 사업</em>
          </h2>
          <p className="section-desc">
            충전 인프라 개발·설치·관리에서 충전 서비스까지, 원스탑 충전 솔루션을
            제공하는 기업입니다.
          </p>
        </div>
        <div className="service-cards">
          <ServiceCard
            icon={<InfrastructureIcon />}
            tag="Infrastructure"
            title="충전기 구축 사업"
            items={[
              "최적 충전기 기종 컨설팅",
              "설치 공사 및 전기 인허가",
              "사후 유지보수 서비스",
              "급·완속 충전기 전문 시공",
            ]}
            delay={1}
          />
          <ServiceCard
            icon={<OperationIcon />}
            tag="Operation"
            title="위탁 운영 사업"
            items={[
              "충전기 운영 대행 서비스",
              "실시간 모니터링 시스템",
              "장애 발생 즉시 대응",
              "수익 정산 및 보고",
            ]}
            delay={2}
          />
          <ServiceCard
            icon={<ChargingIcon />}
            tag="Charging Service"
            title="전기차 충전 사업"
            items={[
              "전국 충전소 네트워크 운영",
              "앱 기반 예약·결제 서비스",
              "멤버십 혜택 및 포인트",
              "24시간 고객센터 운영",
            ]}
            delay={3}
          />
        </div>
      </section>

      {/* ──────────────── HOW IT WORKS ──────────────── */}
      <section id="how" className="how-section">
        <div className="section-header center reveal">
          <div className="section-eyebrow">이용 방법</div>
          <h2 className="section-title section-title--white">
            4단계로 완성되는
            <br />
            <em>스마트 충전 경험</em>
          </h2>
          <p className="section-desc">
            복잡한 충전 걱정은 이제 그만. 차카지 앱 하나로 간편하게.
          </p>
        </div>
        <div className="how-steps">
          <StepItem
            num="01"
            title="앱 설치 & 가입"
            desc="App Store 또는 Google Play에서 차카지 앱을 설치하고 간편하게 회원가입하세요"
            delay={1}
          />
          <StepItem
            num="02"
            title="충전소 검색"
            desc="위치 기반으로 가장 가까운 충전소를 탐색하고 실시간 빈 자리를 확인하세요"
            delay={2}
          />
          <StepItem
            num="03"
            title="예약 & 결제"
            desc="원하는 시간대를 선택하고 앱에서 바로 결제. 카드 등록 한 번으로 매번 편리하게"
            delay={3}
          />
          <StepItem
            num="04"
            title="QR 스캔 & 충전"
            desc="도착 후 QR 스캔 한 번으로 즉시 충전 시작. 완료 알림까지 앱으로 받아보세요"
            delay={4}
          />
        </div>
      </section>

      {/* ──────────────── SOLUTION SECTION ──────────────── */}
      <section id="solution" className="section-wrap solution-section">
        <div className="section-header reveal">
          <div className="section-eyebrow">원스탑 솔루션</div>
          <h2 className="section-title">
            차카지 <em>원스탑</em>
            <br />
            전기차 충전 솔루션
          </h2>
          <p className="section-desc">
            충전 인프라 개발·설치·관리에서 충전 서비스까지, 시장을 선도하는
            혁신적인 기술력과 고객 가치를 최우선으로 하는 서비스를 통해 미래
            e모빌리티 서비스 산업을 리딩해 나가겠습니다.
          </p>
        </div>
        <div className="solution-inner">
          <div className="solution-left reveal">
            {[
              "e-Mobility 플랫폼",
              "유지·보수",
              "충전인프라 투자 및 충전서비스 운영",
              "충전기 설치",
            ].map((item, idx) => (
              <div className="solution-item" key={idx}>
                <div className="solution-bar"></div>
                <span>{item}</span>
              </div>
            ))}
            <div className="solution-item">
              <div className="solution-bar solution-bar--teal"></div>
              <span>충전기 개발·생산</span>
            </div>
          </div>
          <div className="solution-mid">
            <div className="arrow-line"></div>
            <div className="arrow-dot"></div>
            <div className="arrow-dot arrow-dot--teal"></div>
            <div className="arrow-line"></div>
          </div>
          <div className="solution-right reveal reveal-delay-2">
            <div className="solution-right-card">
              <div className="solution-right-card-label">EV 고객</div>
              <div className="solution-right-card-img solution-right-card-img--purple">
                <EvCarIcon />
              </div>
            </div>
            <div className="solution-right-card">
              <div className="solution-right-card-label solution-right-card-label--teal">
                충전 인프라
              </div>
              <div className="solution-right-card-img solution-right-card-img--teal">
                <EvInfraIcon />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* ──────────────── MANAGEMENT SECTION ──────────────── */}
      <section id="mgmt" className="section-wrap mgmt-section">
        <div className="section-header reveal">
          <div className="section-eyebrow">경영</div>
          <h2 className="section-title">
            지속가능한 성장을 위한
            <br />
            <em>경영 철학</em>
          </h2>
          <p className="section-desc">
            차카지는 혁신과 신뢰를 기반으로 전기차 충전 시장을 이끌어 나갑니다.
          </p>
        </div>
        <div className="mgmt-grid">
          <MgmtCard
            num="01"
            title="안전 & 신뢰"
            desc="고객의 안전을 최우선으로 하는 충전 인프라 운영과 투명한 서비스로 신뢰받는 기업을 추구합니다."
            highlight
            delay={1}
            icon={<ShieldIcon />}
          />
          <MgmtCard
            num="02"
            title="지속적 혁신"
            desc="급변하는 전기차 시장에 발맞춰 AI·IoT 기반의 스마트 충전 기술을 지속적으로 개발하고 도입합니다."
            delay={2}
            icon={<InnovationIcon />}
          />
          <MgmtCard
            num="03"
            title="상생 파트너십"
            desc="충전소 운영 파트너, 자동차 제조사, 정부 기관과의 협력을 통해 전기차 생태계 전체를 함께 발전시킵니다."
            delay={3}
            icon={<PartnershipIcon />}
          />
          <MgmtCard
            num="04"
            title="친환경 경영"
            desc="탄소 중립 목표를 향해 재생에너지 기반 충전 인프라 구축과 친환경 경영 활동을 적극 추진합니다."
            delay={4}
            icon={<EcoIcon />}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};

// --- 서브 컴포넌트 ---
const StatItem = ({
  num,
  unit,
  label,
}: {
  num: string;
  unit: string;
  label: string;
}) => (
  <div className="hero-stat">
    <div className="hero-stat-num">
      {num}
      <span>{unit}</span>
    </div>
    <div className="hero-stat-label">{label}</div>
  </div>
);

const PillarItem = ({
  num,
  title,
  desc,
  delay,
}: {
  num: string;
  title: string;
  desc: string;
  delay: number;
}) => (
  <div className={`brand-pillar reveal reveal-delay-${delay}`}>
    <div className="pillar-num">{num}</div>
    <div className="pillar-text">
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  </div>
);

const ServiceCard = ({ icon, tag, title, items, delay }: any) => (
  <div className={`service-card reveal reveal-delay-${delay}`}>
    <div className="service-card-top">
      <div className="service-card-icon">{icon}</div>
      <div className="tag">{tag}</div>
      <h3>{title}</h3>
    </div>
    <div className="service-card-body">
      <ul>
        {items.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
);

// 경영 철학 카드 컴포넌트
const MgmtCard = ({ num, title, desc, highlight, delay, icon }: any) => (
  <div className={`mgmt-card ${highlight ? 'mgmt-highlight' : ''} reveal reveal-delay-${delay}`}>
    <div className="mgmt-card-num">{num}</div>
    <div className="mgmt-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

// --- SVG Icons ---
const EvCarIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.3">
    <path d="M8 40h48l-6-16H14L8 40z" stroke="#7c3aed" strokeWidth="2" fill="none"/>
    <circle cx="18" cy="46" r="5" stroke="#7c3aed" strokeWidth="2" fill="none"/>
    <circle cx="46" cy="46" r="5" stroke="#7c3aed" strokeWidth="2" fill="none"/>
    <path d="M36 24V16" stroke="#7c3aed" strokeWidth="2"/>
    <path d="M32 12l4 4 4-4" stroke="#7c3aed" strokeWidth="2" fill="none"/>
  </svg>
);

const EvInfraIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.4">
    <rect x="20" y="12" width="24" height="40" rx="4" stroke="#0ea5e9" strokeWidth="2" fill="none"/>
    <path d="M32 20v12" stroke="#0ea5e9" strokeWidth="2"/>
    <path d="M28 28h8" stroke="#0ea5e9" strokeWidth="2"/>
    <rect x="26" y="38" width="12" height="8" rx="2" stroke="#0ea5e9" strokeWidth="2" fill="none"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
);

const InnovationIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z"/></svg>
);

const PartnershipIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
);

const EcoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2-8 2-8 2s4-2 7-2z"/></svg>
);

// 이용 방법(How It Works)의 각 단계를 나타내는 컴포넌트
const StepItem = ({ num, title, desc, delay }: { num: string; title: string; desc: string; delay: number }) => (
  <div className={`how-step reveal reveal-delay-${delay}`}>
    <div className="step-circle">
      <div className="step-num-label">{num}</div>
    </div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

// --- SVG Icons (중요: fill-opacity 등은 카멜케이스로 수정됨) ---
const AppleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const GooglePlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M3.18 23.76c.29.16.62.22.96.16l13.2-7.62L14.6 13.5 3.18 23.76zM20.6 10.27l-2.84-1.64L14.6 12l3.16 3.16 2.84-1.64c.81-.47.81-1.78 0-2.25zM2.01.24C1.73.55 1.56.99 1.56 1.56v20.88c0 .57.17 1.01.45 1.32L3.18.24 2.01.24zM14.6 10.5L3.18.24 14.6 10.5z" />
  </svg>
);

const InfrastructureIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M7 2v11h3v9l7-12h-4l4-8z" />
  </svg>
);

const OperationIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
  </svg>
);

const ChargingIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);



export default BrandPage;
