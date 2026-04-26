import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import WalletService from "../services/WalletService";
import ReservationService from "../services/ReservationService";
import chargeGaugeIcon from "../image/mypagecharge.png"; 
import { useAuth } from "../context/AuthContext"; 
import "../css/mypage.css";

// 📍 예약 내역 타입 정의
interface UsageHistory {
  reservationId: number;
  date: string;
  time: string;
  station: string;
}

const MyPage: React.FC = () => {
  const { user } = useAuth();

  const [wallet, setWallet] = useState({ reserveFund: 0, point: 0 });
  const [reservation, setReservation] = useState<any>(null); 
  const [timeLeft, setTimeLeft] = useState<string>("00:00"); 
  const [isOverdue, setIsOverdue] = useState<boolean>(false); 
  const [historyData, setHistoryData] = useState<UsageHistory[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- 데이터 로딩 함수 ---
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
      if (response.data && response.data.code === 1) {
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
      const response = await ReservationService.getReservationHistory(); 
      if (response.data && response.data.code === 1 && Array.isArray(response.data.result)) {
        const formattedData = response.data.result.map((item: any) => {
          const startDate = new Date(item.startTime);
          const endDate = new Date(item.endTime);
          
          return {
            reservationId: item.reservationId,
            date: `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')}`,
            time: `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')} ~ ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`,
            station: item.stationName || "충전소 정보 없음"
          };
        });
        setHistoryData(formattedData);
      }
    } catch (error) {
      console.error("이용 내역 조회 실패");
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

  useEffect(() => { fetchAllData(); }, []);

  useEffect(() => {
    if (!reservation || ["COMPLETED", "CANCELLED", "RESERVED"].includes(reservation.status)) {
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
                  style={{ width: "100%", padding: "12px", border: `1px solid ${reservation.status === 'RESERVED' ? '#b088f9' : '#ff4d4d'}`, color: reservation.status === 'RESERVED' ? '#b088f9' : '#ff4d4d', background: "transparent", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}
                >
                  {reservation.status === "RESERVED" ? "충전 시작" : "충전 종료"}
                </button>
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
              <span style={{ color: '#b088f9', fontSize: '0.85rem', fontWeight: '500' }}>내 정보 상세 조회 (회원정보 수정)</span>
            </Link>
          </div>
        </div>
        
        <div className="history-panel" style={{ backdropFilter: 'blur(15px)' }}>
          <h3>최근 이용 내역</h3>
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
            <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>이용 내역이 없습니다.</p>
          )}
          <div className="spacer" style={{ height: "40px" }}></div>
          <button className="more-btn" style={{ width: '100%', padding: '15px', background: 'transparent', border: '1px solid #b088f9', color: '#b088f9', borderRadius: '10px' }}>전체 내역 보기</button>
        </div>
      </div>

      <footer style={{ marginTop: '40px', textAlign: 'center', paddingBottom: '40px' }}>
        <Link to="/main/mypagep" style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem' }}>계정 및 차량 정보 수정</Link>
      </footer>
    </div>
  );
};

export default MyPage;