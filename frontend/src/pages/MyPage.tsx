import React from 'react';
import { Link } from 'react-router-dom';
import '../css/mypage.css';
import '../css/footer.css';


interface UsageHistory {
  date: string;
  station: string;
  amount: string;
  price: string;
}

const MyPage: React.FC = () => {

  const historyData: UsageHistory[] = [
    { date: "04.07", station: "부산 시청역 스테이션", amount: "12.5kWh", price: "- 3,200원" },
    { date: "04.02", station: "해운대 LCT 스테이션", amount: "25.0kWh", price: "- 7,500원" },
    { date: "03.25", station: "범내골 스테이션", amount: "25.0kWh", price: "- 7,500원" },
  ];

  return (
    <div className="app-wrapper">

      <header className="top-nav">
        <div className="logo">MyPage</div>
        <nav className="menu">

          <Link to="/"><span>메인으로</span></Link>
          <Link to="/mypageP"><span>개인정보</span></Link>
          <Link to="/pay"><span className="active">지갑 충전하기</span></Link>
        </nav>
      </header>

      <div className="main-layout">

        <section className="hero-banner">
          <div className="overlay"></div>
          <div className="hero-content">
            <h2>Ready to Charge</h2>
            <p>환영합니다. 충전 준비가 완료되었습니다.</p>
          </div>
        </section>

        <div className="dashboard-grid">

          <div className="status-panel">
            <div className="glass-card">
              <span>현재 배터리</span>
              <div className="battery-level">

                <div className="gauge" style={{ width: '72%' }}></div>
                <span className="pct">72%</span>
              </div>
            </div>
            <div className="glass-card">
              <span>적립금</span>
              <h3>0 원</h3>
            </div>
            <div className="glass-card">
              <span>포인트</span>
              <h3>20,000 P</h3>
            </div>
          </div>


          <div className="history-panel">
            <h3>최근 이용 리포트</h3>
            {historyData.map((item, index) => (
              <div className="list-item" key={index}>
                <div className="date">{item.date}</div>
                <div className="info">{item.station} - {item.amount}</div>
                <div className="price">{item.price}</div>
              </div>
            ))}

            <div className="spacer" style={{ height: '60px' }}></div>
            <button className="more-btn">전체 내역 보기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;