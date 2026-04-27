import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import WalletService from "../services/WalletService";
import ReservationService from "../services/ReservationService";
import chargeGaugeIcon from "../image/mypagecharge.png"; 
import { useAuth } from "../context/AuthContext"; 
import "../css/mypage.css";

// 📍 이용 내역 타입 정의
interface UsageHistory {
  reservationId: number;
  date: string;
  time: string;
  station: string;
  amount?: string;
  amountColor?: string;
  timestamp: number;
  type: string;
}

const MyPage: React.FC = () => {
  const { user } = useAuth();

  const [wallet, setWallet] = useState({ reserveFund: 0, point: 0 });
  const [reservation, setReservation] = useState<any>(null); 
  const [timeLeft, setTimeLeft] = useState<string>("00:00"); 
  const [isOverdue, setIsOverdue] = useState<boolean>(false); 
  const [historyData, setHistoryData] = useState<UsageHistory[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [showAllHistory, setShowAllHistory] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // 📍 전체 데이터 로드
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchWalletData(),
        fetchCurrentRes(),
        fetchUsageHistory()
      ]);
    } catch (error) {
      console.error("데이터 로딩 오류:", error);
    } finally {
      setIsLoading(false);
    }
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
    } catch (error) { console.error("지갑 조회 실패"); }
  };

  const fetchCurrentRes = async () => {
    try {
      const res = await ReservationService.getCurrentReservation();
      if (res.data && res.data.result) {
        setReservation(res.data.result);
      } else {
        setReservation(null);
      }
    } catch (e) { setReservation(null); }
  };

  const fetchUsageHistory = async () => {
    try {
      const [resResponse, payResponse] = await Promise.all([
        ReservationService.getReservationHistory(),
        WalletService.getPaymentHistory()
      ]);

      let combinedData: UsageHistory[] = [];

      // 1. 예약 내역 데이터 가공
      if (resResponse.data && resResponse.data.code === 1 && Array.isArray(resResponse.data.result)) {
        const resData = resResponse.data.result.map((item: any) => {
          const startDate = new Date(item.startTime);
          const endDate = new Date(item.endTime);
          
          return {
            reservationId: item.reservationId,
            date: `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')}`,
            time: `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')} ~ ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`,
            station: item.stationName || "충전소 정보 없음",
            timestamp: startDate.getTime(),
            type: "RESERVATION"
          };
        });
        combinedData = [...combinedData, ...resData];
      }

      // 2. 결제 및 환불 내역 데이터 가공 (📍 REFUND 색상 및 기호 수정)
      if (payResponse.data && payResponse.data.success && Array.isArray(payResponse.data.result)) {
        const payData = payResponse.data.result.map((item: any) => {
          const dateObj = new Date(item.createdAt);
          const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
          const timeStr = dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

          let stationText = "";
          let amountText = "";
          let amountColor = "";

          if (item.paymentType === "TOPUP") {
            stationText = "적립금 충전";
            amountText = `+${item.amount.toLocaleString()}원`;
            amountColor = '#4ade80'; // 초록색
          } 
          else if (item.paymentType === "REFUND") { 
            // 📍 환불 내역: 초록색(+)으로 표시
            stationText = item.stationName ? `${item.stationName} (취소 환불)` : "예약 취소 환불";
            amountText = `+${item.amount.toLocaleString()}원`;
            amountColor = '#4ade80'; // 초록색
          }
          else if (item.paymentType === "RESERVE_USAGE") {
            stationText = item.stationName ? `${item.stationName} ` : "적립금 사용";
            amountText = `-${item.amount.toLocaleString()}원`;
            amountColor = '#f87171'; // 빨간색
          }

          return {
            reservationId: item.reservationId || 0,
            date: dateStr,
            time: timeStr,
            station: stationText,
            amount: amountText,
            amountColor: amountColor,
            timestamp: dateObj.getTime(),
            type: item.paymentType 
          };
        });
        combinedData = [...combinedData, ...payData];
      }

      combinedData.sort((a, b) => b.timestamp - a.timestamp);
      setHistoryData(combinedData);

    } catch (error) {
      console.error("이용 내역 통합 조회 실패", error);
      setHistoryData([]); 
    }
  };

  const handleStart = async (id: number) => {
    try {
      await ReservationService.startCharging(id);
      alert("충전을 시작합니다!");
      fetchAllData(); 
    } catch (error: any) { alert(error.response?.data?.message || "시작 실패"); }
  };

  const handleEnd = async (id: number) => {
    try {
      await ReservationService.endCharging(id);
      alert("충전이 종료되었습니다. 정산이 완료되었습니다.");
      fetchAllData(); 
    } catch (error: any) { alert(error.response?.data?.message || "종료 실패"); }
  };

  const handleCancel = async (id: number, startTime: string) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const diffMins = (start - now) / (1000 * 60);

    if (diffMins < 10) {
      alert("예약 취소는 시작 10분 전까지만 가능합니다.");
      return;
    }

    if (!window.confirm("예약을 취소하시겠습니까? 취소 시 사용된 적립금은 즉시 환불됩니다.")) return;

    try {
      await ReservationService.cancelReservation(id);
      alert("예약이 취소되었습니다. 적립금이 환불되었습니다.");
      fetchAllData(); // 지갑 잔액 및 내역 동시 갱신
    } catch (error: any) {
      alert(error.response?.data?.message || "취소 실패");
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  // 타이머 로직: RESERVED 상태에서는 작동하지 않음
  useEffect(() => {
    if (!reservation || ["RESERVED", "COMPLETED", "CANCELLED"].includes(reservation.status)) {
      setTimeLeft("00:00");
      setIsOverdue(false);
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(reservation.endTime).getTime();
      const diff = end - now;

      if (diff > 0) {
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
        setIsOverdue(false);
      } else {
        const overTime = Math.abs(diff);
        const overMins = Math.floor(overTime / 60000);
        const overSecs = Math.floor((overTime % 60000) / 1000);
        setTimeLeft(`+ ${String(overMins).padStart(2, '0')}:${String(overSecs).padStart(2, '0')}`);
        setIsOverdue(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [reservation]);

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  if (isLoading) return <div className="loading-box" style={{ textAlign: 'center', marginTop: '100px', color: '#fff' }}>데이터 로딩 중...</div>;

  const filteredHistory = historyData.filter(item => {
    if (filterType === "ALL") return true;
    if (filterType === "WALLET") return ["TOPUP", "RESERVE_USAGE", "REFUND"].includes(item.type);
    return item.type === filterType;
  });

  const displayedHistory = showAllHistory ? filteredHistory : filteredHistory.slice(0, 5);

  const filterLabels: { [key: string]: string } = {
    "ALL": "전체 보기",
    "RESERVATION": "예약 내역",
    "WALLET": "적립금 내역"
  };

  return (
    <div className="main-layout">
      <section className="hero-banner">
        <div className="overlay"></div>
        <div className="hero-content">
          <h2>Ready to Charge</h2>
          <p><strong>{user?.memberName || "사용자"}</strong>님, 환영합니다.</p>
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="status-panel">
          <div className="glass-card" style={{ backdropFilter: 'blur(15px)' }}>
            <span>충전 제어</span>
            <img src={chargeGaugeIcon} alt="Gauge" style={{ height: "130px", marginTop: "15px", display: "block", margin: "15px auto" }} />
            {!reservation ? (
              <div className="no-res" style={{ textAlign: "center", color: "#aaa" }}>진행 중인 예약이 없습니다.</div>
            ) : (
              <div className="charging-control" style={{ textAlign: "center" }}>
                <p style={{ color: "#aaa", fontSize: "0.9rem" }}>{formatTime(reservation.startTime)} ~ {formatTime(reservation.endTime)}</p>
                <h1 style={{ 
                  color: isOverdue ? "#ff4d4d" : "#b088f9", 
                  fontSize: "2.8rem", 
                  margin: "10px 0",
                  textShadow: isOverdue ? "0 0 15px rgba(255, 77, 77, 0.5)" : "0 0 15px rgba(176, 136, 249, 0.5)" 
                }}>{timeLeft}</h1>
                
                <button 
                  onClick={() => reservation.status === "RESERVED" ? handleStart(reservation.reservationId) : handleEnd(reservation.reservationId)}
                  className={reservation.status === "RESERVED" ? "start-btn" : "end-btn"}
                  style={{ 
                    width: "100%", padding: "12px", borderRadius: "10px", fontWeight: "bold",
                    border: `1px solid ${reservation.status === 'RESERVED' ? '#b088f9' : '#ff4d4d'}`, 
                    color: reservation.status === 'RESERVED' ? '#b088f9' : '#ff4d4d', 
                    background: "transparent", cursor: "pointer", marginBottom: "8px" 
                  }}
                >
                  {reservation.status === "RESERVED" ? "충전 시작" : "충전 종료"}
                </button>

                {reservation.status === "RESERVED" && (
                  <button 
                    onClick={() => handleCancel(reservation.reservationId, reservation.startTime)}
                    style={{ 
                      width: "100%", padding: "10px", borderRadius: "10px",
                      border: "1px solid #ff4d4d", // 📍 빨간색 테두리로 수정
                      color: "#ff4d4d",             // 📍 빨간색 글씨로 수정
                      background: "rgba(255, 255, 255, 0.05)", 
                      cursor: "pointer", fontSize: "0.85rem" 
                    }}
                  >
                    예약 취소
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="glass-card" style={{ backdropFilter: 'blur(15px)', width: '100%', padding: '53px 40px' }}>
            <span>적립금</span>
            <h3 style={{ color: '#b088f9' }}>{wallet.reserveFund.toLocaleString()} 원</h3>
          </div>
          
          <div className="glass-card" style={{ backdropFilter: 'blur(15px)', marginBottom: '10px', width: '100%', padding: '53px 40px' }}>
            <span>포인트</span>
            <h3 style={{ color: '#b088f9' }}>{wallet.point.toLocaleString()} P</h3>
          </div>

          <div style={{ textAlign: 'left', padding: '10px 10px' }}>
            <Link to="/main/mypagep" style={{ textDecoration: 'none', display: 'inline-block', padding: '8px 16px', border: '1px solid rgba(176, 136, 249, 0.3)', borderRadius: '20px', transition: '0.3s' }}>
              <span style={{ color: '#b088f9', fontSize: '0.85rem', fontWeight: '500' }}>내 정보 상세 조회</span>
            </Link>
          </div>
        </div>
        
        <div className="history-panel" style={{ backdropFilter: 'blur(15px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>최근 이용 내역</h3>
            
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ 
                  background: 'transparent', color: '#b088f9', border: 'none', 
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', 
                  display: 'flex', alignItems: 'center', userSelect: 'none'
                }}
              >
                {filterLabels[filterType]}
                <span style={{ fontSize: '0.7rem', marginLeft: '6px' }}>▼</span>
              </div>

              {isDropdownOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '10px',
                  background: '#1a1a1a', borderRadius: '10px', overflow: 'hidden',
                  zIndex: 100, minWidth: '110px', boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
                }}>
                  {Object.entries(filterLabels).map(([key, label]) => (
                    <div 
                      key={key}
                      onClick={() => {
                        setFilterType(key);
                        setShowAllHistory(false);
                        setIsDropdownOpen(false);
                      }}
                      style={{
                        padding: '12px 15px',
                        color: filterType === key ? '#b088f9' : '#fff',
                        fontSize: '0.85rem', cursor: 'pointer',
                        borderBottom: key !== 'WALLET' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(176, 136, 249, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {displayedHistory.length > 0 ? (
            displayedHistory.map((item, index) => (
              <div className="list-item" key={index} style={{ display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: '20px' }}>
                <div className="date" style={{ textAlign: 'left' }}>
                  <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 'bold' }}>{item.date}</div>
                </div>
                <div className="time" style={{ textAlign: 'left' }}>
                  <div style={{ color: '#b088f9', fontSize: '0.85rem' }}>{item.time}</div>
                </div>
                <div className="info" style={{ color: '#fff', fontSize: '0.95rem', flex: '1' }}>{item.station}</div>
                
                {item.amount && (
                  <div className="amount" style={{ color: item.amountColor, fontSize: '1rem', fontWeight: 'bold', textAlign: 'right' }}>
                    {item.amount}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>해당하는 이용 내역이 없습니다.</p>
          )}

          <div className="spacer" style={{ height: "40px" }}></div>
          
          {filteredHistory.length > 5 && !showAllHistory && (
            <button 
              className="more-btn" 
              onClick={() => setShowAllHistory(true)}
              style={{ width: '100%', padding: '15px', background: 'transparent', border: '1px solid #b088f9', color: '#b088f9', borderRadius: '10px', cursor: 'pointer' }}
            >
              전체 내역 보기
            </button>
          )}
          
          {showAllHistory && (
            <button 
              className="more-btn" 
              onClick={() => setShowAllHistory(false)} 
              style={{ width: '100%', padding: '15px', background: 'transparent', border: '1px solid #b088f9', color: '#b088f9', borderRadius: '10px', cursor: 'pointer' }}
            >
              간략히 보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;