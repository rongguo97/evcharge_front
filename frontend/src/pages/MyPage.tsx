import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WalletService from "../services/WalletService";
import ReservationService from "../services/ReservationService";
import chargeGaugeIcon from "../image/mypagecharge.png"; 
import { useAuth } from "../context/AuthContext"; 
import "../css/mypage.css";

// 📍 예약 내역 타입 정의 (날짜, 시간, 충전소, 결제금액)
interface UsageHistory {
  date: string;
  time: string;
  station: string;
  price: string;
}

const MyPage: React.FC = () => {
  const { user } = useAuth();

  // --- [1] 상태 관리 ---
  const [wallet, setWallet] = useState({ reserveFund: 0, point: 0 });
  const [reservation, setReservation] = useState<any>(null); 
  const [timeLeft, setTimeLeft] = useState<string>("00:00"); 
  const [isOverdue, setIsOverdue] = useState<boolean>(false); 

  // 초기 상태는 빈 배열로 두고, 데이터를 불러오기 전까지 보여줄 더미 데이터를 세팅해 둡니다.
  const [historyData, setHistoryData] = useState<UsageHistory[]>([
    { date: "2026.04.07", time: "14:00 ~ 15:30", station: "부산 시청역 스테이션", price: "3,200원" },
    { date: "2026.04.02", time: "09:00 ~ 11:00", station: "해운대 LCT 스테이션", price: "7,500원" },
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
      if (response.data && response.data.success) {
        setWallet({
          reserveFund: response.data.result.reserveFund || 0,
          point: response.data.result.point || 0,
        });
      }
    } catch (error) {
      console.error("지갑 정보 조회 실패:", error);
    }
  };

  const fetchCurrentRes = async () => {
    try {
      const res = await ReservationService.getCurrentReservation();
      if (res.data && res.data.result) {
        setReservation(res.data.result);
      }
    } catch (e) {
      setReservation(null);
    }
  };

  // 📍 [안전 모드] 지금은 에러 방지를 위해 실제 연동 코드를 주석 처리했습니다!
  // 나중에 ReservationService.ts에 함수를 확실히 만들고 나서 주석을 푸시면 됩니다.
  const fetchUsageHistory = async () => {
    try {
      /*
      const response = await (ReservationService as any).getReservationHistory(); 
      
      if (response.data && response.data.success) {
        const formattedData = response.data.result.map((item: any) => {
          const startDate = new Date(item.startTime);
          const endDate = new Date(item.endTime);
          
          const dateStr = `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')}`;
          const timeStr = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')} ~ ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

          return {
            date: dateStr,
            time: timeStr,
            station: item.stationName || item.station?.stationName || "충전소 정보 없음",
            price: item.price ? `${item.price.toLocaleString()}원` : "결제 안됨",
          };
        });
        
        setHistoryData(formattedData); 
      } 
      */
    } catch (error) {
      console.error("예약 내역 조회 실패:", error);
    }
  };

  // --- [3] 충전 제어 핸들러 ---
  const handleStart = async (id: number) => {
    try {
      await ReservationService.startCharging(id);
      alert("충전을 시작합니다!");
      fetchAllData(); 
    } catch (error: any) {
      alert(error.response?.data?.message || "충전 시작 실패");
    }
  };

  const handleEnd = async (id: number) => {
    try {
      await ReservationService.endCharging(id);
      alert("충전이 종료되었습니다. 정산이 완료되었습니다.");
      fetchAllData(); 
    } catch (error: any) {
      alert(error.response?.data?.message || "충전 종료 실패");
    }
  };

  // --- [4] 타이머 로직 ---
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!reservation || reservation.status === "COMPLETED" || reservation.status === "CANCELLED") {
      setTimeLeft("00:00");
      return;
    }

    if (reservation.status === "RESERVED") {
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
        setTimeLeft(`${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`);
        setIsOverdue(false);
      } else {
        const overTime = Math.abs(diff);
        const overMins = Math.floor(overTime / (1000 * 60));
        const overSecs = Math.floor((overTime % (1000 * 60)) / 1000);
        setTimeLeft(`+ ${overMins < 10 ? "0" + overMins : overMins}:${overSecs < 10 ? "0" + overSecs : overSecs}`);
        setIsOverdue(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [reservation]);

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <>
      <div className="main-layout">
        <section className="hero-banner">
          <div className="overlay"></div>
          <div className="hero-content">
            <h2>Ready to Charge</h2>
            <p>{user?.memberName || "사용자"}님, 환영합니다. 충전 준비가 완료되었습니다.</p>
          </div>
        </section>

        <div className="dashboard-grid">
          <div className="status-panel">
            
            {/* 1. 충전 제어 카드 */}
            <div className="glass-card" style={{ backdropFilter: 'blur(15px)' }}>
              <span>충전 제어</span>
              
              <img
                src={chargeGaugeIcon}
                alt="Charging Gauge"
                style={{
                  height: "130px",
                  marginTop: "15px",
                  marginBottom: "10px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />

              {!reservation ? (
                <div className="no-res" style={{ marginTop: "15px", textAlign: "center", color: "#aaa" }}>
                  진행 중인 예약이 없습니다.
                </div>
              ) : (
                <div className="charging-control" style={{ textAlign: "center" }}>
                  <p style={{ margin: "10px 0", color: "#aaa", fontSize: "0.95rem" }}>
                    예약 시간: {formatTime(reservation.startTime)} ~ {formatTime(reservation.endTime)}
                  </p>

                  <h1
                    style={{
                      color: isOverdue ? "#ff4d4d" : "#b088f9",
                      fontSize: "2.8rem",
                      margin: "10px 0",
                      textShadow: isOverdue
                        ? "0 0 15px rgba(255, 77, 77, 0.5)"
                        : "0 0 15px rgba(176, 136, 249, 0.5)",
                    }}
                  >
                    {timeLeft}
                  </h1>
                  {isOverdue && (
                    <p style={{ color: "#ff4d4d", fontWeight: "bold", fontSize: "0.9rem", marginBottom: "10px" }}>
                      ⚠️ 지연 중! 충전을 종료해주세요.
                    </p>
                  )}

                  {reservation.status === "RESERVED" ? (
                    <button
                      className="start-btn"
                      onClick={() => handleStart(reservation.reservationId)}
                      style={{
                        width: "100%", padding: "1rem", marginTop: "1rem",
                        background: "transparent", border: "1px solid #b088f9",
                        color: "#b088f9", borderRadius: "12px", cursor: "pointer",
                        transition: "0.3s", fontWeight: "bold", fontSize: "1rem",
                      }}
                    >
                      충전 시작
                    </button>
                  ) : (
                    <button
                      className="end-btn overdue"
                      onClick={() => handleEnd(reservation.reservationId)}
                      style={{
                        width: "100%", padding: "1rem", marginTop: "1rem",
                        background: "transparent", border: "1px solid #ff4d4d",
                        color: "#ff4d4d", borderRadius: "12px", cursor: "pointer",
                        transition: "0.3s", fontWeight: "bold", fontSize: "1rem",
                      }}
                    >
                      충전 종료
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 2. 차량 정보 카드 */}
            <div className="glass-card" style={{ backdropFilter: 'blur(15px)' }}>
              <span>내 차량 ({user?.carModel || '미등록'})</span>
              <div className="battery-level">
                <div className="gauge" style={{ width: '72%' }}></div>
                <span className="pct">72%</span>
              </div>
              <p style={{ fontSize: '0.8rem', marginTop: '10px', color: '#ccc' }}>
                차량번호: {user?.carNumber || '번호 미등록'}
              </p>
            </div>

            {/* 3. 적립금 카드 */}
            <div className="glass-card" style={{ backdropFilter: 'blur(15px)' }}>
              <span>적립금</span>
              <h3 style={{ color: '#b088f9' }}>{wallet.reserveFund.toLocaleString()} 원</h3>
            </div>
            
            {/* 4. 포인트 카드 */}
            <div className="glass-card" style={{ backdropFilter: 'blur(15px)' }}>
              <span>포인트</span>
              <h3 style={{ color: '#b088f9' }}>{wallet.point.toLocaleString()} P</h3>
            </div>
          </div>

          {/* 5. 최근 예약 리포트 */}
          <div className="history-panel" style={{ backdropFilter: 'blur(15px)' }}>
            <h3>최근 예약 리포트</h3>
            
            {historyData.length > 0 ? (
              historyData.map((item, index) => (
                <div className="list-item" key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '15px 0', 
                  borderBottom: '1px solid rgba(255,255,255,0.05)' 
                }}>
                  {/* 날짜 & 시간 (왼쪽) */}
                  <div className="date-time" style={{ flex: '1.2', textAlign: 'left' }}>
                    <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>{item.date}</div>
                    <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '4px' }}>{item.time}</div>
                  </div>
                  
                  {/* 충전소 이름 (가운데) */}
                  <div className="info" style={{ flex: '2', textAlign: 'center', color: '#fff', fontSize: '0.95rem' }}>
                    {item.station}
                  </div>
                  
                  {/* 결제 금액 (오른쪽) */}
                  <div className="price" style={{ flex: '1', textAlign: 'right', color: '#b088f9', fontSize: '1rem', fontWeight: 'bold' }}>
                    {item.price}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ padding: "20px", textAlign: "center", color: "#999" }}>최근 예약 내역이 없습니다.</p>
            )}
            
            <div className="spacer" style={{ height: "40px" }}></div>
            <button className="more-btn" style={{
              width: '100%', padding: '15px', background: 'transparent',
              border: '1px solid #b088f9', color: '#b088f9', borderRadius: '10px',
              cursor: 'pointer', transition: '0.3s'
            }}>전체 내역 보기</button>
          </div>

        </div>

        <div className="app-wrapper">
          <footer className="top-nav">
            <div className="logoo01">
              <Link to="/main/mypagep">
                <span>내 정보 상세 조회</span>
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default MyPage;