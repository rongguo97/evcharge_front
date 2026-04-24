import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import WalletService from "../services/WalletService";
import ReservationService from "../services/ReservationService";
import chargeGaugeIcon from "../image/mypagecharge.png"; 
import { useAuth } from "../context/AuthContext"; 
import "../css/mypage.css";

// 📍 예약 내역 타입 정의 (날짜, 시간, 충전소)
interface UsageHistory {
  date: string;
  time: string;
  station: string;
}

const MyPage: React.FC = () => {
  const { user } = useAuth();

  // --- [1] 상태 관리 ---
  const [wallet, setWallet] = useState({ reserveFund: 0, point: 0 });
  const [reservation, setReservation] = useState<any>(null); 
  const [timeLeft, setTimeLeft] = useState<string>("00:00"); 
  const [isOverdue, setIsOverdue] = useState<boolean>(false); 
  const [historyData, setHistoryData] = useState<UsageHistory[]>([]);

  // --- [2] 데이터 로딩 함수들 ---
  const fetchAllData = async () => {
    await fetchWalletData();
    await fetchCurrentRes();
    await getReservationHistory();
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
      } else {
        setReservation(null);
      }
    } catch (e) {
      setReservation(null);
    }
  };

  const getReservationHistory = async () => {
    try {
      const response = await ReservationService.getReservationHistory(); 
      if (response.data && response.data.code === 1 && Array.isArray(response.data.result)) {
        const formattedData = response.data.result.map((item: any) => {
          const startDate = new Date(item.startTime);
          const endDate = new Date(item.endTime);
          
          const dateStr = `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')}`;
          const timeStr = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')} ~ ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

          return {
            date: dateStr,
            time: timeStr,
            station: item.stationName || "충전소 정보 없음"
          };
        });
        setHistoryData(formattedData); 
      }
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

  // --- [4] 타이머 및 초기화 (📍 수정된 타이머 로직) ---
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    // 1. 예약 데이터가 없거나 완료/취소된 상태면 00:00 고정
    if (!reservation || reservation.status === "COMPLETED" || reservation.status === "CANCELLED") {
      setTimeLeft("00:00");
      setIsOverdue(false);
      return;
    }

    // 2. 📍 충전 시작 누르기 전(RESERVED)에는 타이머를 돌리지 않고 00:00 고정
    if (reservation.status === "RESERVED") {
      setTimeLeft("00:00");
      setIsOverdue(false);
      return;
    }

    // 3. 📍 충전 중(CHARGING)일 때만 타이머 작동
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(reservation.endTime).getTime();
      const diff = end - now;

      if (diff > 0) {
        // 종료 전: 남은 시간 카운트다운
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`);
        setIsOverdue(false);
      } else {
        // 종료 후: 초과 시간 카운트업 (+ 표시)
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
            <p>{user?.memberName || "사용자"}님, 환영합니다.</p>
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
                  }}>
                    {timeLeft}
                  </h1>
                  {isOverdue && <p style={{ color: "#ff4d4d", fontWeight: "bold", fontSize: "0.9rem", marginBottom: "10px" }}>⚠️ 지연 중! 충전을 종료해주세요.</p>}
                  {reservation.status === "RESERVED" ? (
                    <button onClick={() => handleStart(reservation.reservationId)} className="start-btn" style={{ width: "100%", padding: "12px", border: "1px solid #b088f9", color: "#b088f9", background: "transparent", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>충전 시작</button>
                  ) : (
                    <button onClick={() => handleEnd(reservation.reservationId)} className="end-btn" style={{ width: "100%", padding: "12px", border: "1px solid #ff4d4d", color: "#ff4d4d", background: "transparent", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>충전 종료</button>
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
                <span style={{ color: '#b088f9', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' }}>내 정보 상세 조회 (회원정보 수정)</span>
              </Link>
            </div>
          </div>

          <div className="history-panel" style={{ backdropFilter: 'blur(15px)' }}>
            <h3>최근 예약 리포트</h3>
            {historyData.length > 0 ? (
              historyData.map((item, index) => (
                <div className="list-item" key={index} style={{ display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: '20px' }}>
                  <div className="date" style={{ textAlign: 'left' }}>
                    <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 'bold' }}>{item.date}</div>
                  </div>
                  <div className="time" style={{ textAlign: 'left' }}>
                    <div style={{ color: '#b088f9', fontSize: '0.85rem' }}>{item.time}</div>
                  </div>
                  <div className="info" style={{ color: '#fff', fontSize: '0.95rem', flex: '1' }}>{item.station}</div>
                </div>
              ))
            ) : (
              <p style={{ padding: "20px", textAlign: "center", color: "#999" }}>최근 예약 내역이 없습니다.</p>
            )}
            <div className="spacer" style={{ height: "40px" }}></div>
            <button className="more-btn" style={{ width: '100%', padding: '15px', background: 'transparent', border: '1px solid #b088f9', color: '#b088f9', borderRadius: '10px' }}>전체 내역 보기</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPage;