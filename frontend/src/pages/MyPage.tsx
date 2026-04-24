import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import WalletService from '../services/WalletService'; 
import ReservationService from "../services/ReservationService";
import chargeGaugeIcon from '../image/mypagecharge.png'; // 📍 폴더명 img로 맞춤
import { useAuth } from '../context/AuthContext'; // 💡 유저 정보 가져오기
import '../css/mypage.css';

interface UsageHistory {
  date: string;
  station: string;
  amount: string;
  price: string;
}

const MyPage: React.FC = () => {
  const { user } = useAuth(); // 💡 전역 상태에서 로그인한 유저 정보 가져오기

  // --- [1] 상태 관리 ---
  const [wallet, setWallet] = useState({ reserveFund: 0, point: 0 });
  const [reservation, setReservation] = useState<any>(null); // 현재 예약 정보
  const [timeLeft, setTimeLeft] = useState<string>("00:00"); // 타이머
  const [isOverdue, setIsOverdue] = useState<boolean>(false); // 시간 초과 여부
  
  // 이용 내역 상태 (더미 데이터로 초기화)
  const [historyData, setHistoryData] = useState<UsageHistory[]>([
    { date: "04.07", station: "부산 시청역 스테이션", amount: "12.5kWh", price: "- 3,200원" },
    { date: "04.02", station: "해운대 LCT 스테이션", amount: "25.0kWh", price: "- 7,500원" },
  ]);

  // --- [2] 데이터 로딩 함수들 ---
  const fetchAllData = async () => {
    await fetchWalletData();
    await fetchCurrentRes();
    await fetchUsageHistory();
  };

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

  const fetchCurrentRes = async () => {
    try {
      const res = await ReservationService.getCurrentReservation();
      setReservation(res.data.result);
    } catch (e) {
      setReservation(null);
    }
  };

  const fetchUsageHistory = async () => {
    try {
      // 예시: const response = await apiClient.get('/api/usage/history');
      // setHistoryData(response.data.result);
    } catch (error) {
      console.error("이용 내역 조회 실패:", error);
    }
  };

  // --- [3] 충전 제어 핸들러 ---
  const handleStart = async (id: number) => {
    try {
      await ReservationService.startCharging(id);
      alert("충전을 시작합니다!");
      fetchAllData(); // 상태 갱신
    } catch (error: any) {
      alert(error.response?.data?.message || "충전 시작 실패");
    }
  };

  const handleEnd = async (id: number) => {
    try {
      await ReservationService.endCharging(id);
      alert("충전이 종료되었습니다. 정산이 완료되었습니다.");
      fetchAllData(); // 지갑 잔액과 예약 상태 갱신
    } catch (error: any) {
      alert(error.response?.data?.message || "충전 종료 실패");
    }
  };

  // --- [4] 초기 데이터 로드 및 타이머 로직 ---
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!reservation || reservation.status === 'COMPLETED' || reservation.status === 'CANCELLED') {
      setTimeLeft("00:00");
      return;
    }

    if (reservation.status === 'RESERVED') {
      setTimeLeft("00:00");
      setIsOverdue(false);
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(reservation.endTime).getTime();
      const diff = end - now;

      if (diff > 0) {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`);
        setIsOverdue(false);
      } else {
        const overTime = Math.abs(diff);
        const overMins = Math.floor(overTime / (1000 * 60));
        const overSecs = Math.floor((overTime % (1000 * 60)) / 1000);
        setTimeLeft(`+ ${overMins < 10 ? '0' + overMins : overMins}:${overSecs < 10 ? '0' + overSecs : overSecs}`);
        setIsOverdue(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [reservation]);

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <div className="main-layout">
        <section className="hero-banner">
          <div className="overlay"></div>
          <div className="hero-content">
            <h2>Ready to Charge</h2>
            <p>{user?.memberName || '사용자'}님, 환영합니다. 충전 준비가 완료되었습니다.</p>
          </div>
        </section>

        <div className="dashboard-grid">
          <div className="status-panel">
            
            {/* 1. 충전 제어 카드 */}
            <div className="glass-card">
              <span>충전 제어</span>
              {!reservation ? (
                <div className="no-res" style={{marginTop: '15px'}}>진행 중인 예약이 없습니다.</div>
              ) : (
                <div className="charging-control" style={{textAlign: 'center'}}>
                  
                  <img 
                    src={chargeGaugeIcon} 
                    alt="Charging Gauge" 
                    style={{
                      height: '50px', 
                      marginBottom: '10px', 
                      display: 'block', 
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }} 
                  />

                  <div className="reservation-info" style={{ 
                    backgroundColor: 'rgba(255,255,255,0.05)', 
                    padding: '15px', 
                    borderRadius: '10px', 
                    margin: '15px 0',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem' }}>
                      {reservation.stationName || reservation.station?.stationName || '충전소 정보'} 
                    </h3>
                    <p style={{ margin: '0', color: '#aaa', fontSize: '0.9rem' }}>
                      예약 시간: {formatTime(reservation.startTime)} ~ {formatTime(reservation.endTime)}
                    </p>
                  </div>

                  <h1 style={{ 
                    color: isOverdue ? '#ff4d4d' : '#b088f9', 
                    fontSize: '2.8rem', 
                    margin: '15px 0',
                    textShadow: isOverdue ? '0 0 10px rgba(255, 77, 77, 0.4)' : '0 0 10px rgba(176, 136, 249, 0.4)'
                  }}>
                    {timeLeft}
                  </h1>
                  {isOverdue && <p style={{ color: '#ff4d4d', fontWeight: 'bold', marginBottom: '15px' }}>⚠️ 지연 중! 충전을 종료해주세요.</p>}
                  
                  {reservation.status === "RESERVED" ? (
                    <button 
                      className="start-btn" 
                      onClick={() => handleStart(reservation.reservationId)}
                      style={{
                        width: '100%', padding: '1rem', marginTop: '1.5rem', background: 'transparent',
                        border: '1px solid #b088f9', color: '#b088f9', borderRadius: '12px',
                        cursor: 'pointer', transition: '0.3s', fontWeight: 'bold', fontSize: '1rem'
                      }}
                    >
                      충전 시작
                    </button>
                  ) : (
                    <button 
                      className="end-btn overdue" 
                      onClick={() => handleEnd(reservation.reservationId)}
                      style={{
                        width: '100%', padding: '1rem', marginTop: '1.5rem', background: 'transparent',
                        border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '12px',
                        cursor: 'pointer', transition: '0.3s', fontWeight: 'bold', fontSize: '1rem'
                      }}
                    >
                      충전 종료
                    </button>
                  )}
                </div>
              )}
            </div>

            

            {/* 3. 적립금 카드 */}
            <div className="glass-card">
              <span>적립금</span>
              <h3>{wallet.reserveFund.toLocaleString()} P</h3>
            </div>

            {/* 4. 포인트 카드 */}
            <div className="glass-card">
              <span>포인트</span>
              <h3>{wallet.point.toLocaleString()} P</h3>
            </div>

          </div>

          <div className="history-panel">
            <h3>최근 이용 리포트</h3>
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
        </div>
      </div>
    </>
  );
};

export default MyPage;