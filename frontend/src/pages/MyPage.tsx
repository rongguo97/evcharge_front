import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import WalletService from '../services/WalletService'; 
import '../css/mypage.css';

interface UsageHistory {
  date: string;
  station: string;
  amount: string;
  price: string;
}

const MyPage: React.FC = () => {
  // 최근 이용 리포트 (데이터)
  const historyData: UsageHistory[] = [
    { date: "04.07", station: "부산 시청역 스테이션", amount: "12.5kWh", price: "- 3,200원" },
    { date: "04.02", station: "해운대 LCT 스테이션", amount: "25.0kWh", price: "- 7,500원" },
    { date: "03.25", station: "범내골 스테이션", amount: "25.0kWh", price: "- 7,500원" },
  ];

  // 📍 1. 지갑 정보를 저장할 상태 변수 생성
  const [wallet, setWallet] = useState({
    reserveFund: 0,
    point: 0
  });

  // 📍 2. 페이지 로드 시 지갑 정보를 가져오는 함수
  const fetchWalletData = async () => {
    try {
      const response = await WalletService.getMyWallet();
      // 백엔드 ApiResponse 구조(result 안에 데이터가 있음)에 맞춰 세팅
      if (response.data.success) {
        setWallet({
          reserveFund: response.data.result.reserveFund || 0,
          point: response.data.result.point || 0
        });
      }
    } catch (error) {
      console.error("지갑 정보 조회 실패 (로그인 상태를 확인하세요):", error);
    }
  };

  // 📍 3. 컴포넌트가 처음 렌더링될 때 실행
  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <>
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
            
            {/* 📍 적립금 표시부 */}
            <div className="glass-card">
              <span>적립금</span>
              <h3>{wallet.reserveFund.toLocaleString()} 원</h3>
            </div>
            
            {/* 📍 포인트 표시부 */}
            <div className="glass-card">
              <span>포인트</span>
              <h3>{wallet.point.toLocaleString()} P</h3>
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

        <div className="app-wrapper">
          <footer className="top-nav">
            <div className="logoo">
              <Link to="/main/mypagep"><span>개인정보 조회</span></Link>
            </div>
          </footer>
          <br /><br /><br /><br /><br /><br /><br /><br />
        </div>
      </div>
    </>
  );
};

export default MyPage;