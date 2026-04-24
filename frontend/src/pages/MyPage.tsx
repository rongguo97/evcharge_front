import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import WalletService from '../services/WalletService'; 
import { useAuth } from '../context/AuthContext'; // 💡 유저 정보 가져오기 위해 추가
import '../css/mypage.css';

// 이용 내역 타입 정의
interface UsageHistory {
  date: string;
  station: string;
  amount: string;
  price: string;
}

const MyPage: React.FC = () => {
  const { user } = useAuth(); // 💡 1. 전역 상태에서 로그인한 유저 정보 가져오기

  //  지갑 정보를 저장할 상태 변수
  const [wallet, setWallet] = useState({
    reserveFund: 0,
    point: 0
  });

  //  2. 실제 DB에서 이용 내역을 가져올 상태 (현재는 빈 배열로 시작)
  const [historyData, setHistoryData] = useState<UsageHistory[]>([]);

  //  지갑 정보를 가져오는 함수
  const fetchWalletData = async () => {
    try {
      const response = await WalletService.getMyWallet();
      if (response.data.success) {
        setWallet({
          reserveFund: response.data.result.reserveFund || 0,
          point: response.data.result.point || 0
        });
      }
    } catch (error) {
      console.error("지갑 정보 조회 실패:", error);
    }
  };

  //  3. 실제 이용 내역을 가져오는 함수 (백엔드 엔드포인트에 맞게 호출)
  const fetchUsageHistory = async () => {
    try {
      // 예시: const response = await apiClient.get('/api/usage/history');
      // setHistoryData(response.data.result);
      
      // 만약 아직 백엔드 내역 API가 없다면 임시 데이터를 두되, 
      // 나중에 이 함수만 수정하면 DB와 바로 연동됩니다.
    } catch (error) {
      console.error("이용 내역 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchWalletData();
    fetchUsageHistory();
  }, []);

  return (
    <>
      <div className="main-layout">
        {/*  4. 하드코딩된 문구 대신 유저의 이름을 출력 */}
        <section className="hero-banner">
          <div className="overlay"></div>
          <div className="hero-content">
            <h2>Ready to Charge</h2>
            <p>{user?.memberName || '사용자'}님, 환영합니다. 충전 준비가 완료되었습니다.</p>
          </div>
        </section>

        <div className="dashboard-grid">
          <div className="status-panel">
            <div className="glass-card">
              {/*  5. 차량 정보 출력 (DB 데이터) */}
              <span>내 차량 ({user?.carModel || '미등록'})</span>
              <div className="battery-level">
                {/* 배터리 잔량은 실제 차량 연동 데이터가 필요함 (현재는 디자인 유지) */}
                <div className="gauge" style={{ width: '72%' }}></div>
                <span className="pct">72%</span>
              </div>
              <p style={{fontSize: '0.8rem', marginTop: '5px', color: '#ccc'}}>
                차량번호: {user?.carNumber || '번호 미등록'}
              </p>
            </div>
            
            <div className="glass-card">
              <span>적립금</span>
              <h3>{wallet.reserveFund.toLocaleString()} P</h3>
            </div>
            
            <div className="glass-card">
              <span>포인트</span>
              <h3>{wallet.point.toLocaleString()} P</h3>
            </div>
          </div>

          <div className="history-panel">
            <h3>최근 이용 리포트</h3>
            {/* 💡 6. 데이터가 없을 때와 있을 때 구분 */}
            {historyData.length > 0 ? (
              historyData.map((item, index) => (
                <div className="list-item" key={index}>
                  <div className="date">{item.date}</div>
                  <div className="info">{item.station} - {item.amount}</div>
                  <div className="price">{item.price}</div>
                </div>
              ))
            ) : (
              <p style={{padding: '20px', textAlign: 'center', color: '#999'}}>
                최근 이용 내역이 없습니다.
              </p>
            )}

            <div className="spacer" style={{ height: '60px' }}></div>
            <button className="more-btn">전체 내역 보기</button>
          </div>
        </div>

        <div className="app-wrapper">
          <footer className="top-nav">
            <div className="logoo">
              <Link to="/main/mypagep"><span>내 정보 상세 조회</span></Link>
            </div>
          </footer>
          <br /><br /><br /><br /><br /><br /><br /><br />
        </div>
      </div>
    </>
  );
};

export default MyPage;