import React from 'react';
import { Link } from 'react-router-dom'; // 1. Link 컴포넌트 추가
import '../css/mypage.css';
import '../css/mypageP.css' 

// 2. 인터페이스 정의 (파일 상단에 추가해야 에러가 안 납니다)
interface HistoryItem {
  id: number;
  date: string;
  location: string;
  amount: string;
  price: string;
}

const MyPage: React.FC = () => {
  const userStats = {
    battery: 72,
    balance: 0,
    points: 20000,
  };

  const historyData: HistoryItem[] = [
    { id: 1, date: "04.07", location: "부산 시청역 스테이션", amount: "12.5kWh", price: "- 3,200원" },
    { id: 2, date: "04.02", location: "해운대 LCT 스테이션", amount: "25.0kWh", price: "- 7,500원" },
    { id: 3, date: "03.25", location: "범내골 스테이션", amount: "25.0kWh", price: "- 7,500원" },
  ];

  return (
    <div className="app-wrapper">
      <header className="top-nav">
        <div className="logo">MyPage</div>
        <nav className="menu">
          {/* href="Home.tsx" 대신 router에 설정한 경로로 변경 */}
          <Link to="/"><span>메인으로</span></Link>
          <Link to="/profile"><span>개인정보</span></Link>
          <Link to="/wallet"><span className="active">지갑 충전하기</span></Link>
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
                <div
                  className="gauge"
                  style={{ width: `${userStats.battery}%` }}
                ></div>
                <span className="pct">{userStats.battery}%</span>
              </div>
            </div>

            <div className="glass-card">
              <span>적립금</span>
              <h3>{userStats.balance.toLocaleString()} 원</h3>
            </div>

            <div className="glass-card">
              <span>포인트</span>
              <h3>{userStats.points.toLocaleString()} P</h3>
            </div>
          </div>

          <div className="history-panel">
            <h3>최근 이용 리포트</h3>
            <div className="history-list">
              {historyData.map((item) => (
                <div key={item.id} className="list-item">
                  <div className="date">{item.date}</div>
                  <div className="info">
                    {item.location} - {item.amount}
                  </div>
                  <div className="price">{item.price}</div>
                </div>
              ))}
            </div>

            <div className="button-container" style={{ marginTop: "60px" }}>
              <button className="more-btn">전체 내역 보기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;