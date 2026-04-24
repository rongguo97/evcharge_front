import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import apiClient from '../api/axios'; // 직접 만든 axios 인스턴스 사용
import WalletService from '../services/WalletService'; 
import { useAuth } from '../context/AuthContext'; 
import '../css/mypage.css';

// 이용 내역 타입 정의 (백엔드 DTO 구조에 맞춤)
interface UsageHistory {
  historyId: number;
  date: string;
  stationName: string;
  chargeAmount: string;
  totalFee: string;
}

const MyPage: React.FC = () => {
  const { user } = useAuth(); 

  // 지갑 상태 관리
  const [wallet, setWallet] = useState({
    reserveFund: 0,
    point: 0
  });

  // 이용 내역 상태 관리
  const [historyData, setHistoryData] = useState<UsageHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 지갑 정보 조회 (DB 연동)
  const fetchWalletData = async () => {
    try {
      const response = await WalletService.getMyWallet();
      // 백엔드 응답 구조가 { success: true, result: { ... } } 인 경우
      const data = response.data.result || response.data;
      setWallet({
        reserveFund: data.reserveFund || 0,
        point: data.point || 0
      });
    } catch (error) {
      console.error("지갑 정보 조회 실패:", error);
    }
  };

  // 2. 이용 내역 조회 (DB 연동)
  const fetchUsageHistory = async () => {
    try {
      // 💡 실제 백엔드 엔드포인트로 요청
      const response = await apiClient.get('/api/usage/history'); 
      const data = response.data.result || response.data;
      
      // 서버에서 가져온 데이터를 상태에 저장
      setHistoryData(data);
    } catch (error) {
      console.error("이용 내역 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 페이지 진입 시 두 데이터를 모두 가져옴
    Promise.all([fetchWalletData(), fetchUsageHistory()]);
  }, []);

  return (
    <div className="main-layout">
      {/* 히어로 배너: 인증된 사용자 이름 출력 */}
      <section className="hero-banner">
        <div className="overlay"></div>
        <div className="hero-content">
          <h2>Ready to Charge</h2>
          <p><strong>{user?.memberName || '사용자'}</strong>님, 환영합니다. 충전 준비가 완료되었습니다.</p>
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="status-panel">
          {/* 차량 정보: DB 유저 데이터 연동 */}
          <div className="glass-card">
            <span>내 차량 ({user?.carModel || '미등록'})</span>
            <div className="battery-level">
              {/* 배터리 잔량 데이터가 DB에 있다면 user?.batteryPct 등으로 교체 가능 */}
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

        {/* 이용 내역 패널: DB 리스트 렌더링 */}
        <div className="history-panel">
          <h3>최근 이용 리포트</h3>
          {loading ? (
            <p style={{padding: '20px', textAlign: 'center'}}>데이터를 불러오는 중...</p>
          ) : historyData.length > 0 ? (
            historyData.map((item) => (
              <div className="list-item" key={item.historyId}>
                <div className="date">{item.date}</div>
                <div className="info">{item.stationName} - {item.chargeAmount}kWh</div>
                <div className="price">{Number(item.totalFee).toLocaleString()}원</div>
              </div>
            ))
          ) : (
            <p style={{padding: '40px', textAlign: 'center', color: '#999'}}>
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
      </div>
    </div>
  );
};

export default MyPage;