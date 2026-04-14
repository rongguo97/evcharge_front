import React from 'react';
import '../css/cash.css'; // 기존 cash.css와 header, footer 관련 스타일을 포함해주세요.

// 요금제 데이터 타입 정의
interface PricePlan {
  type: 'FAST' | 'SLOW';
  title: string;
  standardPrice: number;
  memberPrice: number;
  nightPrice: number;
  competitors: { name: string; price: number }[];
  isHighlight?: boolean;
}

const Pricing: React.FC = () => {
  // 요금 데이터 (서버 API에서 받아온다고 가정할 수 있습니다)
  const pricePlans: PricePlan[] = [
    {
      type: 'FAST',
      title: '급속 충전 요금',
      standardPrice: 450,
      memberPrice: 320,
      nightPrice: 290,
      competitors: [
        { name: 'A사', price: 450 },
        { name: 'B사', price: 480 },
        { name: 'C사', price: 475 },
        { name: 'D사', price: 460 },
        { name: 'E사', price: 450 },
      ]
    },
    {
      type: 'SLOW',
      title: '완속 충전 요금',
      standardPrice: 250,
      memberPrice: 190,
      nightPrice: 150,
      isHighlight: true,
      competitors: [
        { name: 'A사', price: 250 },
        { name: 'B사', price: 275 },
        { name: 'C사', price: 250 },
        { name: 'D사', price: 280 },
        { name: 'E사', price: 260 },
      ]
    }
  ];

  return (
    <div className="pricing-page">
      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-text">
            <p className="sub-title">Save time. Reserve your charge</p>
            <h1>친환경 이동을 더 똑똑하게<br /><span>차카지 충전 요금 안내</span></h1>
            <br /><br />
            <h3>복잡한 요금제는 잊으세요.<br />차카지는 합리적입니다.</h3>
            <br />
            <h3>
              <span className="cpp">차카지 회원</span>은 <span className="cpk">더 저렴하게</span> 이용가능합니다.
              <br />
              <span className="cpk">급속, 완속</span> 요금제 확인하고 <span className="cpk">심야</span> 요금까지 확인하세요.
            </h3>
          </div>
        </div>
      </section>

      {/* 메인 요금 컨텐츠 */}
      <main className="container price-content">
        <div className="price-grid">
          {pricePlans.map((plan) => (
            <div key={plan.type} className={`price-card ${plan.isHighlight ? 'highlight' : ''}`}>
              <div className="card-badge">{plan.type}</div>
              <h3><span className="cw">{plan.title}</span></h3>
              <br />
              <div className="main-amount">
                {plan.standardPrice}<span>원/kWh</span>
              </div>
              <div className="detail-box">
                <div className="detail-row">
                  <span>차카지 회원</span><strong>💜 {plan.memberPrice}원</strong>
                </div>
                <div className="detail-row">
                  <span>심야 할인</span><strong className="purple-text">{plan.nightPrice}원</strong>
                </div>
                <br /><br />
                <h2 className="text-PP">요금 비교 해보기 🔎</h2><br />
                {plan.competitors.map((comp, idx) => (
                  <p key={idx} className="text-P">
                    {comp.name} &nbsp;&nbsp;&nbsp;&nbsp; {comp.price}원
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      
    </div>
  );
};

export default Pricing;