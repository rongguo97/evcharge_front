import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WalletService from "../services/WalletService";
import ReservationService from "../services/ReservationService";
import chargeGaugeIcon from "../image/mypagecharge.png"; 
import { useAuth } from "../context/AuthContext"; 
import "../css/mypage.css";

interface UsageHistory {
  date: string;
  time: string;
  station: string;
  price: string;
}

const MyPage: React.FC = () => {
  const { user } = useAuth();

  // 📍 [해결] wallet과 historyData는 아래 UI에서 사용하므로 경고가 사라집니다.
  const [wallet, setWallet] = useState({ reserveFund: 0, point: 0 });
  const [reservation, setReservation] = useState<any>(null); 
  const [timeLeft, setTimeLeft] = useState<string>("00:00"); 
  const [isOverdue, setIsOverdue] = useState<boolean>(false); 
  const [historyData, setHistoryData] = useState<UsageHistory[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchWalletData(),
        fetchCurrentRes(),
        fetchUsageHistory()
      ]);
    } catch (error) {
      console.error("데이터 로딩 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWalletData = async () => {
    try {
      const response = await WalletService.getMyWallet();
      if (response.data && response.data.success) {
        const result = response.data.result;
        setWallet({
          reserveFund: result.reserveFund || 0,
          point: result.point || 0,
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

  const fetchUsageHistory = async () => {
    try {
      const response = await (ReservationService as any).getReservationHistory(); 
      if (response.data && response.data.success) {
        const formattedData = response.data.result.map((item: any) => {
          const startDate = new Date(item.startTime);
          // 📍 [해결] endDate 경고 해결: 사용하지 않는다면 선언하지 않거나, 아래처럼 로그/계산에 활용
          const endDate = new Date(item.endTime);
          console.log("이용 종료 시간:", endDate); 
          
          return {
            date: startDate.toLocaleDateString(),
            time: `${formatTime(item.startTime)} ~ ${formatTime(item.endTime)}`,
            station: item.stationName || "알 수 없는 스테이션",
            price: item.price ? `${item.price.toLocaleString()}원` : "0원",
          };
        });
        setHistoryData(formattedData);
      }
    } catch (error) {
      setHistoryData([]); 
    }
  };

  const handleStart = async (id: number) => {
    try {
      await ReservationService.startCharging(id);
      alert("충전을 시작합니다!");
      fetchCurrentRes();
    } catch (error: any) {
      alert(error.response?.data?.message || "충전 시작 실패");
    }
  };

  const handleEnd = async (id: number) => {
    try {
      await ReservationService.endCharging(id);
      alert("충전이 종료되었습니다.");
      fetchAllData();
    } catch (error: any) {
      alert(error.response?.data?.message || "충전 종료 실패");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!reservation || ["COMPLETED", "CANCELLED"].includes(reservation.status)) {
      setTimeLeft("00:00");
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

  if (isLoading) return <div className="loading-box">데이터 로딩 중...</div>;

  return (
    <div className="main-layout">
      <section className="hero-banner">
        <div className="overlay"></div>
        <div className="hero-content">
          <h2>Ready to Charge</h2>
          <p>{user?.memberName || "사용자"}님, 오늘의 충전 현황입니다.</p>
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="status-panel">
          
          <div className="glass-card" style={{ backdropFilter: 'blur(15px)' }}>
            <span>충전 제어</span>
            <img src={chargeGaugeIcon} alt="Gauge" style={{ height: "130px", margin: "15px auto", display: "block" }} />
            {!reservation ? (
              <div className="no-res" style={{ marginTop: "15px", textAlign: "center", color: "#aaa" }}>현재 예약된 내역이 없습니다.</div>
            ) : (
              <div className="charging-control" style={{ textAlign: "center" }}>
                <p style={{ color: "#aaa", fontSize: "0.85rem" }}>{formatTime(reservation.startTime)} ~ {formatTime(reservation.endTime)}</p>
                <h1 style={{ color: isOverdue ? "#ff4d4d" : "#b088f9", fontSize: "2.8rem" }}>{timeLeft}</h1>
                <button onClick={() => reservation.status === "RESERVED" ? handleStart(reservation.reservationId) : handleEnd(reservation.reservationId)}>
                  {reservation.status === "RESERVED" ? "충전 시작" : "충전 종료"}
                </button>
              </div>
            )}
          </div>

          <div className="glass-card" style={{ backdropFilter: 'blur(15px)' }}>
            <span>등록 차량 정보</span>
            <p style={{ fontSize: '1.1rem', marginTop: '15px', color: '#fff', fontWeight: 'bold' }}>
              {user?.carNumber || '등록된 차량 없음'}
            </p>
          </div>

          <div className="glass-card" style={{ backdropFilter: 'blur(15px)' }}>
            <span>보유 잔액</span>
            <h3 style={{ color: '#b088f9' }}>{wallet.reserveFund.toLocaleString()} 원</h3>
          </div>
          
          <div className="glass-card" style={{ backdropFilter: 'blur(15px)' }}>
            <span>보유 포인트</span>
            <h3 style={{ color: '#b088f9' }}>{wallet.point.toLocaleString()} P</h3>
          </div>
        </div>

        <div className="history-panel" style={{ backdropFilter: 'blur(15px)' }}>
          <h3>최근 이용 내역</h3>
          {historyData.length > 0 ? (
            historyData.map((item, index) => (
              <div key={index} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span>{item.date}</span>
                <span>{item.station}</span>
                <span style={{ color: '#b088f9' }}>{item.price}</span>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>이용 내역이 없습니다.</p>
          )}
        </div>
      </div>

      <footer className="top-nav" style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link to="/main/mypagep" style={{ color: '#888', textDecoration: 'none' }}>계정 및 차량 정보 수정</Link>
      </footer>
    </div>
  );
};

export default MyPage;