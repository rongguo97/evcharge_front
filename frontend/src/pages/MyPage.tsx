import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import WalletService from '../services/WalletService'; 
import ReservationService from "../services/ReservationService";
import '../css/mypage.css';

// 📍 [변경사항 1] 이미지 import 추가
import chargeGaugeIcon from '../image/mypagecharge.png';

interface UsageHistory {
  date: string;
  station: string;
  amount: string;
  price: string;
}

const MyPage: React.FC = () => {
  // --- [1] 상태 관리 ---
  const [wallet, setWallet] = useState({ reserveFund: 0, point: 0 });
  const [reservation, setReservation] = useState<any>(null); // 현재 예약 정보
  const [timeLeft, setTimeLeft] = useState<string>("00:00"); // 타이머
  const [isOverdue, setIsOverdue] = useState<boolean>(false); // 시간 초과 여부

  const historyData: UsageHistory[] = [
    { date: "04.07", station: "부산 시청역 스테이션", amount: "12.5kWh", price: "- 3,200원" },
    { date: "04.02", station: "해운대 LCT 스테이션", amount: "25.0kWh", price: "- 7,500원" },
  ];

  // --- [2] 데이터 로딩 함수들 ---
  const fetchAllData = async () => {
    await fetchWalletData();
    await fetchCurrentRes();
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

  // --- [4] 타이머 로직 ---
  useEffect(() => {
    fetchAllData();
  }, []);

  // --- [4] 타이머 로직 (RESERVED: 정지 / CHARGING: 카운트다운 및 초과 카운트업) ---
  useEffect(() => {
    // 예약이 없거나 완료/취소 상태면 타이머 종료
    if (!reservation || reservation.status === 'COMPLETED' || reservation.status === 'CANCELLED') {
      setTimeLeft("00:00");
      return;
    }

    // 1. RESERVED(대기) 상태일 때는 00:00으로 멈춤
    if (reservation.status === 'RESERVED') {
      setTimeLeft("00:00");
      setIsOverdue(false);
      return;
    }

    // 2. CHARGING(충전 중)일 때만 타이머 가동
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(reservation.endTime).getTime();
      const diff = end - now;

      if (diff > 0) {
        // [정상 충전 중] 종료 시간까지 카운트다운 (남은 시간)
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`);
        setIsOverdue(false);
      } else {
        // [시간 초과!] 00:00부터 다시 카운트업 (초과 시간)
        const overTime = Math.abs(diff); // 차이값을 양수로 변환
        const overMins = Math.floor(overTime / (1000 * 60));
        const overSecs = Math.floor((overTime % (1000 * 60)) / 1000);
        
        // 초과됨을 알리기 위해 앞에 '+'를 붙이거나 빨간색으로 표시
        setTimeLeft(`+ ${overMins < 10 ? '0' + overMins : overMins}:${overSecs < 10 ? '0' + overSecs : overSecs}`);
        setIsOverdue(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [reservation]);

  // 시간을 "14:30" 형식으로 예쁘게 바꿔주는 함수
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
            <p>환영합니다. 충전 준비가 완료되었습니다.</p>
          </div>
        </section>

        <div className="dashboard-grid">
          <div className="status-panel">
            
            {/* 충전 제어 카드 */}
            <div className="glass-card">
              <span>충전 제어</span>
              {!reservation ? (
                <div className="no-res" style={{marginTop: '15px'}}>진행 중인 예약이 없습니다.</div>
              ) : (
                <div className="charging-control" style={{textAlign: 'center'}}>
                  
                  {/* 📍 [변경사항 2] 충전기 정보 위쪽에 아이콘 추가 및 스타일링 */}
                  <img 
                    src={chargeGaugeIcon} 
                    alt="Charging Gauge" 
                    style={{
                      height: '50px', // 아이콘 높이 조절
                      marginBottom: '10px', // 아래쪽 제목과의 간격
                      display: 'block', // 중앙 정렬을 위해 블록화
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }} 
                  />

                  {/* 예약 내용 동적 표시 영역 */}
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

                  {/* 타이머 색상 */}
                  <h1 style={{ 
                    color: isOverdue ? '#ff4d4d' : '#b088f9', 
                    fontSize: '2.8rem', 
                    margin: '15px 0',
                    textShadow: isOverdue ? '0 0 10px rgba(255, 77, 77, 0.4)' : '0 0 10px rgba(176, 136, 249, 0.4)'
                  }}>
                    {timeLeft}
                  </h1>
                  {isOverdue && <p style={{ color: '#ff4d4d', fontWeight: 'bold', marginBottom: '15px' }}>⚠️ 지연 중! 충전을 종료해주세요.</p>}
                  
                  {/* 요청하신 버튼 디자인 적용 완료 */}
                  {reservation.status === "RESERVED" ? (
                    <button 
                      className="start-btn" 
                      onClick={() => handleStart(reservation.reservationId)}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        marginTop: '1.5rem',
                        background: 'transparent',
                        border: '1px solid #b088f9', /* 연보라색 테두리 */
                        color: '#b088f9', /* 연보라색 글씨 */
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: '0.3s',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}
                    >
                      충전 시작
                    </button>
                  ) : (
                    <button 
                      className="end-btn overdue" 
                      onClick={() => handleEnd(reservation.reservationId)}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        marginTop: '1.5rem',
                        background: 'transparent',
                        border: '1px solid #ff4d4d', /* 종료는 빨간색 테두리 */
                        color: '#ff4d4d', /* 빨간색 글씨 */
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: '0.3s',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}
                    >
                      충전 종료
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 적립금 카드 */}
            <div className="glass-card">
              <span>적립금</span>
              <h3>{wallet.reserveFund.toLocaleString()} 원</h3>
            </div>

            {/* 포인트 카드 */}
            <div className="glass-card">
              <span>포인트</span>
              <h3>{wallet.point.toLocaleString()} P</h3>
            </div>

          </div> {/* status-panel 닫기 */}

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
        </div> {/* dashboard-grid 닫기 */}

        <div className="app-wrapper">
          <footer className="top-nav">
            <div className="logoo">
              <Link to="/main/mypagep"><span>개인정보 조회</span></Link>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default MyPage;