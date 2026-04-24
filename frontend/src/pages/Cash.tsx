import React from "react";
import "../css/footer.css";
import "../css/header.css";
import "../css/cash.css";

interface PricePlan {
  type: "FAST" | "SLOW";
  title: string;
  basePrice: number;
  memberPrice: string;
  nightPrice: string;
  competitors: { name: string; price: number }[];
  isHighlight?: boolean;
}

const PriceCard: React.FC<PricePlan> = ({
  type,
  title,
  basePrice,
  memberPrice,
  nightPrice,
  competitors,
  isHighlight,
}) => (
  <div className={`price-card ${isHighlight ? "highlight" : ""}`}>
    <div className="card-badge">{type}</div>
    <h3>
      <span className="cwb">{title}</span>
    </h3>
    <br />
    <div className="main-amount">
      {basePrice}
      <span>원/kWh</span>
    </div>
    <br />
    <br />
    <br />
    <h2>
      <span className="cw">👤</span>
    </h2>
    <h2>
      <span className="cw">차카지회원</span>
    </h2>
    <br />
    <div className="main-amount">
      {memberPrice}
      <span>/kWh</span>
    </div>
    <br />
    <br />
    <h2>
      <h2>
        <span className="cw">🌘</span>
      </h2>
      <span className="cw">심야요금</span>
    </h2>
    <h3>
      <span className="cwb">회원전용</span>
    </h3>
    <br />
    <div className="main-amount">
      {nightPrice}
      <span>/kWh</span>
    </div>
    <br />
    <div className="detail-box">
      {/* <div className="detail-row"><span>차카지 회원</span><strong>💜 {memberPrice}</strong></div>
      <div className="detail-row"><span>심야 할인</span><strong className="purple-text">{nightPrice}</strong></div> */}
      <h2 className="text-PP">요금 비교</h2>
      <br />
      {competitors.map((comp, idx) => (
        <p key={idx} className="text-P">
          {comp.name} &nbsp;&nbsp; {comp.price}원
        </p>
      ))}
    </div>
  </div>
);

const Pricing: React.FC = () => {
  const plans: PricePlan[] = [
    {
      type: "FAST",
      title: "급속 충전 요금",
      basePrice: 450,
      memberPrice: "320원",
      nightPrice: "290원",
      competitors: [
        { name: "A사", price: 450 },
        { name: "B사", price: 480 },
        { name: "C사", price: 475 },
        { name: "D사", price: 460 },
        { name: "E사", price: 450 },
      ],
    },
    {
      type: "SLOW",
      title: "완속 충전 요금",
      basePrice: 250,
      memberPrice: "190원",
      nightPrice: "150원",
      isHighlight: true,
      competitors: [
        { name: "A사", price: 250 },
        { name: "B사", price: 275 },
        { name: "C사", price: 250 },
        { name: "D사", price: 280 },
        { name: "E사", price: 260 },
      ],
    },
  ];

  return (
    <>
      <div className="pricing-page">
        <section className="hero-section">
          <div className="container">
            <div className="hero-text">
              <br />
              <br />
              <p className="sub-title">Save time. Reserve your charge</p>
              <h1>
                친환경 이동을 더 똑똑하게
                <br />
                <span>차카지 충전 요금 안내</span>
              </h1>
              <h3>복잡한 요금제는 잊으세요. 차카지는 합리적입니다.</h3>
              <br />
              <h3>
                <span className="cpp">차카지 회원</span>은{" "}
                <span className="cpk">더 저렴하게</span> 이용가능합니다.
                <br />
                <span className="cpk">급속, 완속</span> 요금제 확인하고{" "}
                <span className="cpk">심야</span> 요금까지 확인하세요.
              </h3>
            </div>
          </div>
        </section>
        <br />
        <br />
        <main className="container price-content">
          <div className="price-grid">
            {plans.map((plan, index) => (
              <PriceCard key={index} {...plan} />
            ))}
          </div>
        </main>
        <br />
        <br />
      </div>
    </>
  );
};

export default Pricing;
