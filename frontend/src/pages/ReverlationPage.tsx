// 📍 [수정] useEffect와 useLocation(라우터 상태 받기용) 추가 임포트
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReservationService from "../services/ReservationList";
import StationService from "../services/StationService";
import type { IStation } from "../types/IStation";
import {
  getStatusLabel,
  getTypeLabel,
  getMethodLabel,
} from "../common/stationConverter";

function ReservationPage() {
  // 📍 [추가] 전달받은 라우터 상태 접근
  const location = useLocation();

  // --- [1] 상태 관리 ---
  const [keyword, setKeyword] = useState(""); 
  const [results, setResults] = useState<any[]>([]); 
  const [selectedStation, setSelectedStation] = useState<any>(null); 
  const [isSearching, setIsSearching] = useState(false); 

  const [chargers, setChargers] = useState<any[]>([]); 
  const [selectedCharger, setSelectedCharger] = useState<any>(null); 
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // 📍 팝업창(모달) 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 📍 1: 정보 확인, 2: 결제(적립금) 확인, 3: 예약 완료
  
  // 페이징
  const [currentPage, setCurrentPage] = useState(1); 
  const ITEMS_PER_PAGE = 10; 

  // 📍 [추가] StationList 화면에서 "예약하기"를 눌러 데이터가 넘어왔다면, 초기 화면에 충전소를 세팅
  useEffect(() => {
    if (location.state?.preSelectedStation) {
      const station = location.state.preSelectedStation;
      setSelectedStation(station);
      setChargers(station.chargers || []);
    }
  }, [location.state]);

  // --- [2] 검색 핸들러 ---
  const handleSearch = async () => {
    if (!keyword.trim()) return;
    const searchParams = { searchKeyword: keyword, status: "", chargerType: "", chargerMethod: "", page: 0, size: 10000 };
    try {
      const response = await StationService.getAll(searchParams);
      const data = response.data.result || response.data.content || response.data;
      if (Array.isArray(data)) {
        const groups: { [key: string]: any } = {};
        data.forEach((s: IStation) => {
          const groupKey = `${s.stationName}_${s.address}`;
          if (!groups[groupKey]) {
            groups[groupKey] = { ...s, chargers: [], groupKey };
          }
          groups[groupKey].chargers.push(s);
        });
        setResults(Object.values(groups));
        setCurrentPage(1);
        setIsSearching(true);
        setSelectedStation(null); 
      }
    } catch (error) {
      console.error("충전소 검색 실패:", error);
      setResults([]);
    }
  };

  // --- [3] 충전소 클릭 핸들러 ---
  const handleStationSelect = (group: any) => {
    setSelectedStation(group); 
    setChargers(group.chargers); 
    setIsSearching(false); 
    setSelectedCharger(null); 
    setSelectedTime(null); 
  };

  // --- [4] 시간 슬롯 생성 (동적 로직) ---
  const generateTimeSlots = (charger: any) => {
    if (!charger) return [];

    const typeLabel = getTypeLabel(charger.chargerType);
    const methodLabel = getMethodLabel(charger.chargerMethod);
    let duration = 60; // 기본값 완속 60분

    if (typeLabel.includes("급속") || methodLabel.includes("100kW")) {
      duration = 40;
    } else if (methodLabel.includes("50kW")) {
      duration = 70;
    }

    const buffer = 10; 
    const totalMinutes = 24 * 60;
    const slots = [];
    let currentMin = 0;

    while (currentMin + duration <= totalMinutes) {
      const startH = String(Math.floor(currentMin / 60)).padStart(2, "0");
      const startM = String(currentMin % 60).padStart(2, "0");
      
      const endMinTotal = currentMin + duration;
      let endH = String(Math.floor(endMinTotal / 60)).padStart(2, "0");
      const endM = String(endMinTotal % 60).padStart(2, "0");
      
      if (endMinTotal === 1440) endH = "24"; 

      slots.push(`${startH}:${startM} - ${endH}:${endM}`);
      currentMin = endMinTotal + buffer;
    }
    return slots;
  };

  // 📍 [수정됨] 최종 예약 확정 핸들러 (모달 Step 2에서 호출됨)
 const handleConfirmReservation = async () => {
  try {
    // 1. 데이터 추출 (가짜 이메일 사용 - DB에 해당 이메일이 미리 있어야 함!)
    const loggedInEmail = "test@example.com"; 
    
    // selectedTime ("14:00 - 15:00")에서 시작 시간만 추출
    const startTimeStr = selectedTime?.split(" - ")[0]; 
    if (!startTimeStr || !selectedCharger) {
      alert("예약 정보를 확인해주세요.");
      return;
    }

    // 2. 날짜 포맷팅 (YYYY-MM-DDTHH:mm:ss)
    const today = new Date();
    const isoStartTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}T${startTimeStr}:00`;

    // 3. 백엔드 @RequestParam 형식에 맞게 URLSearchParams 생성
    const params = new URLSearchParams();
    params.append("email", loggedInEmail);
    params.append("stationId", selectedCharger.stationId || selectedCharger.id);
    params.append("startTime", isoStartTime);

    // 4. 서비스 호출
    const response = await ReservationService.addReservation(params);

    // 5. 성공 시 다음 단계로
    if (response.status === 201 || response.data.success) {
      setModalStep(3);
      return;
    }
  } catch (error: any) {
    console.error("예약 전송 실패:", error);
    if (error.response && error.response.status === 409) {
      alert(error.response.data.message || "이미 예약된 시간입니다.");
    } else {
      alert("서버 연결에 실패했습니다.");
    }
  }
};

  // --- [렌더링 전 페이징 데이터 계산 로직] ---
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const PAGES_PER_BLOCK = 10;
  const currentBlock = Math.ceil(currentPage / PAGES_PER_BLOCK);
  const startPage = (currentBlock - 1) * PAGES_PER_BLOCK + 1;
  const endPage = Math.min(startPage + PAGES_PER_BLOCK - 1, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  // 📍 결제용 임시 데이터 (나중에 실제 데이터와 연동하세요)
  const MOCK_RESERVATION_FEE = 2000;
  const MOCK_CURRENT_POINTS = 5000;
  const remainPoints = MOCK_CURRENT_POINTS - MOCK_RESERVATION_FEE;

  return (
    <div style={{ backgroundColor: "#f4f5fa", minHeight: "100vh", padding: "0 0 40px 0" }}>
      <header style={{ 
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), 
                     url('https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200') no-repeat center/cover`,
        height: "500px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#ffffff", width: "100%", marginBottom: "40px"
      }}>
        <h1 style={{ color: "#ffffff", fontSize: "36px", fontWeight: "900", margin: 0 }}>충전소 예약</h1>
        <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "16px", marginTop: "10px" }}>원하시는 충전소와 시간대를 선택해 주세요.</p>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "25px", padding: "0 20px" }}>
        
        {/* [STEP 1] 충전소 선택 */}
        <section style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ backgroundColor: "#B452B5", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>1</span>
            <h3 style={{ margin: 0, color: "#333", fontSize: "18px", fontWeight: "800" }}>충전소 선택</h3>
          </div>
          
          <div style={{ position: "relative", width: "100%" }}>
            <input 
              type="text" 
              placeholder="예약하실 충전소 이름을 검색하세요" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{ width: "100%", padding: "16px 50px 16px 20px", borderRadius: "14px", border: "2px solid #eaddff", fontSize: "15px", outline: "none", boxSizing: "border-box", color: "#333", background: "#fff" }} 
            />
            <svg onClick={handleSearch} style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", width: "22px", height: "22px", color: "#B452B5", cursor: "pointer" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>

          {isSearching && !selectedStation && (
            <div style={{ marginTop: "10px", border: "1px solid #eaddff", borderRadius: "14px", overflow: "hidden", background: "#fff" }}>
              {paginatedResults.length > 0 ? paginatedResults.map((group, index) => (
                <div key={group.groupKey || index} onClick={() => handleStationSelect(group)} style={{ padding: "15px 20px", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }} onMouseOver={(e) => (e.currentTarget.style.background = "#f8f9ff")} onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}>
                  <span style={{ fontWeight: "600", color: "#333" }}>{group.stationName}</span>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{group.address}</div>
                </div>
              )) : <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>검색 결과가 없습니다.</div>}

              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "15px", gap: "8px", background: "#fafafa", borderTop: "1px solid #eee" }}>
                  <button 
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #ddd", background: currentPage === 1 ? "#f0f0f0" : "#fff", color: currentPage === 1 ? "#aaa" : "#555", cursor: currentPage === 1 ? "default" : "pointer" }}
                  >
                    이전
                  </button>

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: "32px", height: "32px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold",
                        background: currentPage === page ? "#B452B5" : "transparent",
                        color: currentPage === page ? "#fff" : "#555"
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #ddd", background: currentPage === totalPages ? "#f0f0f0" : "#fff", color: currentPage === totalPages ? "#aaa" : "#555", cursor: currentPage === totalPages ? "default" : "pointer" }}
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedStation && (
            <div style={{ marginTop: "15px", padding: "15px", borderRadius: "12px", background: "#f8f9ff", border: "1px solid #eaddff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ color: "#4a3b8a", display: "block" }}>{selectedStation.stationName}</strong>
                <span style={{ fontSize: "12px", color: "#888" }}>{selectedStation.address}</span>
              </div>
              <button onClick={() => { setSelectedStation(null); setResults([]); setIsSearching(false); }} style={{ fontSize: "12px", color: "#B452B5", background: "none", border: "none", fontWeight: "bold", cursor: "pointer" }}>변경</button>
            </div>
          )}
        </section>

        {/* [STEP 2] 충전기 및 예약시간 선택 */}
        {selectedStation && (
          <section style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
              <span style={{ backgroundColor: "#B452B5", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>2</span>
              <h3 style={{ margin: 0, color: "#333", fontSize: "18px", fontWeight: "800" }}>충전기 및 예약시간 선택</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {chargers.length > 0 ? chargers.map((ch, index) => {
                const isSelected = selectedCharger === ch;
                
                const statusLabel = getStatusLabel(ch.status);
                const typeLabel = getTypeLabel(ch.chargerType);
                const methodLabel = getMethodLabel(ch.chargerMethod);
                
                const isAvailable = statusLabel === "충전가능";
                const isFast = typeLabel.includes("급속");

                return (
                  <div key={ch.chargerId || index}>
                    <button
                      onClick={() => { 
                        if (isSelected) {
                          setSelectedCharger(null); 
                          setSelectedTime(null);
                        } else {
                          setSelectedCharger(ch);  
                          setSelectedTime(null);
                        }
                      }}
                      onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.background = "#f8f9ff"; }}
                      onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.background = "#ffffff"; }}
                      style={{
                        width: "100%", textAlign: "left", padding: "16px", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s ease", display: "block", outline: "none",
                        background: "#ffffff", border: isSelected ? "1px solid #f0f0f0" : "1px solid #eaddff", boxShadow: isSelected ? "0 4px 10px rgba(180, 82, 181, 0.15)" : "none",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ color: "#4a3b8a", fontSize: "15px", fontWeight: "800" }}>{ch.chargerName || `${ch.chargerId}호기`}</strong>
                        <span style={{ color: isAvailable ? "#28a745" : "#7a5de8", fontWeight: "800", fontSize: "11px", border: `1px solid ${isAvailable ? "#28a745" : "#7a5de8"}`, padding: "3px 8px", borderRadius: "6px", background: "#fff" }}>
                          {statusLabel}
                        </span>
                      </div>
                      <div style={{ color: "#666", fontSize: "13px", marginTop: "8px", fontWeight: "500" }}>
                        {typeLabel} | {methodLabel}
                      </div>
                    </button>

                    {isSelected && (
                      <div style={{ 
                        margin: "10px 0 20px 0", padding: "20px", background: "#fcfcfc", 
                        borderRadius: "12px", border: "1px solid #eaddff"
                      }}>
                        <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#333", marginBottom: "15px", display: "flex", alignItems: "center", gap: "5px" }}>
                          🕒 예약 가능 시간 <span style={{ fontSize: "11px", color: "#B452B5", fontWeight: "normal" }}>({isFast ? "* 40분 충전" : "* 60분 충전"})</span>
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                          
                          {generateTimeSlots(ch).map((time) => {
                            const isTimeSelected = selectedTime === time;
                            return (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                style={{
                                  padding: "10px 0", borderRadius: "8px", border: isTimeSelected ? "1px solid #eaddff" : "1px solid #eee",
                                  background: isTimeSelected ? "#F5E6FF" : "#fff", color: isTimeSelected ? "#555" : "#555",
                                  fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s"
                                }}
                              >
                                {time}
                              </button>
                            );
                          })}

                        </div>
                        <div style={{ marginTop: "15px", fontSize: "12px", color: "#333", fontWeight: "600" }}>
                          *{isFast ? "원할한 충전기 사용을 위해 각 예약 시간 사이에 10분 간격을 두고있습니다." : "원할한 충전기 사용을 위해 각 예약 시간 사이에 10분 간격을 두고있습니다."}
                          <br />
                           *{isFast ? "예약시간 10분 후까지 충전을 시작하지 않으면 예약은 자동으로 취소되고 결제하신 금액은 환불되지 않습니다. " : "예약시간 10분 후까지 충전을 시작하지 않으면 예약은 자동으로 취소되고 결제하신 금액은 환불되지 않습니다."}
                           <br />
                           *{isFast ? "예약 시간을 초과해서 충전시 부담금(5,000원)이 부과됩니다. 만약 본인 예약시간에 다른 이용자가 이용하고 있으면 고객 지원을 통해 문의해주세요." : "예약 시간을 초과해서 충전시 부담금(5,000원)이 부과됩니다. 만약 본인 예약시간에 다른 이용자가 이용하고 있으면 고객 지원을 통해 문의해주세요."}
                          <br />
                           *{isFast ? "충전소 운영시간이 상이할 수 있으므로 충전을 못할경우 고객지원을 통해 문의해주세요. " : "충전소 운영시간이 상이할 수 있으므로 충전을 못할경우 고객지원을 통해 문의해주세요."}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }) : <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>등록된 충전기가 없습니다.</div>}
            </div>
          </section>
        )}

        {/* [STEP 3] 하단 예약 버튼 */}
        <button 
          disabled={!selectedStation || !selectedCharger || !selectedTime} 
          onClick={() => {
            setIsModalOpen(true);
            setModalStep(1); 
          }} 
          style={{ 
            width: "100%", padding: "20px", borderRadius: "18px", border: "none", 
            background: (!selectedStation || !selectedCharger || !selectedTime) ? "#ccc" : "linear-gradient(135deg, #B452B5 0%, #7a5de8 100%)", 
            color: "#fff", fontSize: "18px", fontWeight: "900", 
            cursor: (!selectedStation || !selectedCharger || !selectedTime) ? "default" : "pointer", 
            boxShadow: (!selectedStation || !selectedCharger || !selectedTime) ? "none" : "0 10px 20px rgba(122, 93, 232, 0.3)" 
          }}
        >
          {!selectedStation ? "충전소를 선택해주세요" : !selectedCharger ? "충전기를 선택해주세요" : !selectedTime ? "예약 시간을 선택해주세요" : "이 시간대로 예약하시겠습니까?"}
        </button>
      </main>

      {/* 📍 예약/결제 확인 팝업창 (모달) */}
      {isModalOpen && selectedStation && selectedCharger && selectedTime && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 999, 
          display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
        }}>
          <div style={{
            background: "#fff", padding: "40px", borderRadius: "24px", width: "100%", maxWidth: "500px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)", animation: "fadeIn 0.3s ease-out"
          }}>
            
            {/* 📍 모달 Step 1: 예약 정보 확인 */}
            {modalStep === 1 && (
              <>
                <h3 style={{ margin: "0 0 25px 0", color: "#333", fontSize: "22px", textAlign: "center", fontWeight: "800" }}>예약 정보 확인</h3>
                
                <div style={{ background: "#f8f9ff", borderRadius: "12px", padding: "25px", border: "1px solid #eaddff", marginBottom: "30px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ color: "#666", fontSize: "15px" }}>충전소</span>
                    <strong style={{ color: "#333", fontSize: "16px" }}>{selectedStation.stationName}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ color: "#666", fontSize: "15px" }}>충전기</span>
                    <strong style={{ color: "#333", fontSize: "16px" }}>{selectedCharger.chargerName || `${selectedCharger.chargerId}호기`}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#666", fontSize: "15px" }}>예약 시간</span>
                    <strong style={{ color: "#333", fontSize: "20px", padding: "4px 0px", borderRadius: "8px" }}>{selectedTime}</strong>
                  </div>
                </div>

                <p style={{ textAlign: "center", color: "#333", fontSize: "18px", fontWeight: "bold", margin: "0 0 30px 0" }}>
                  해당 시간으로 예약을 진행하시겠습니까?
                </p>

                <div style={{ display: "flex", gap: "15px" }}>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    style={{ flex: 1, padding: "18px", borderRadius: "14px", border: "1px solid #ddd", background: "#fff", color: "#555", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    취소
                  </button>
                  <button 
                    onClick={() => setModalStep(2)} 
                    style={{ flex: 1, padding: "18px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #B452B5 0%, #7a5de8 100%)", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 12px rgba(122, 93, 232, 0.3)" }}
                  >
                    예약하기
                  </button>
                </div>
              </>
            )}

            {/* 📍 모달 Step 2: 결제(적립금) 정보 확인 */}
            {modalStep === 2 && (
              <>
                <h3 style={{ margin: "0 0 25px 0", color: "#333", fontSize: "22px", textAlign: "center", fontWeight: "800" }}>결제 정보 확인</h3>
                
                <div style={{ background: "#f8f9ff", borderRadius: "12px", padding: "25px", border: "1px solid #eaddff", marginBottom: "30px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ color: "#666", fontSize: "15px" }}>예약 금액</span>
                    <strong style={{ color: "#333", fontSize: "16px" }}>{MOCK_RESERVATION_FEE.toLocaleString()} 원</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ color: "#666", fontSize: "15px" }}>현재 적립금액</span>
                    <strong style={{ color: "#333", fontSize: "16px" }}>{MOCK_CURRENT_POINTS.toLocaleString()} P</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ color: "#666", fontSize: "15px" }}>차감 금액</span>
                    <strong style={{ color: "#e53e3e", fontSize: "16px" }}>- {MOCK_RESERVATION_FEE.toLocaleString()} P</strong>
                  </div>
                  
                  <div style={{ borderTop: "1px dashed #ccc", margin: "20px 0" }}></div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#333", fontSize: "16px", fontWeight: "800" }}>결제 후 남은 적립금</span>
                    <strong style={{ color: "#B452B5", fontSize: "20px" }}>{remainPoints.toLocaleString()} P</strong>
                  </div>
                </div>

                <p style={{ textAlign: "center", color: "#333", fontSize: "18px", fontWeight: "bold", margin: "0 0 30px 0" }}>
                  적립금으로 결제하시겠습니까?
                </p>

                <div style={{ display: "flex", gap: "15px" }}>
                  <button 
                    onClick={() => setModalStep(1)} 
                    style={{ flex: 1, padding: "18px", borderRadius: "14px", border: "1px solid #ddd", background: "#fff", color: "#555", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    이전
                  </button>
                  <button 
                    onClick={handleConfirmReservation} // 📍 클릭 시 3단계(완료 화면)로 넘어감
                    style={{ flex: 1, padding: "18px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #B452B5 0%, #7a5de8 100%)", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 12px rgba(122, 93, 232, 0.3)" }}
                  >
                    예약 확정
                  </button>
                </div>
              </>
            )}

            {/* 📍 모달 Step 3: 최종 예약 완료 화면 */}
            {modalStep === 3 && (
              <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease-out" }}>
    
                <h3 style={{ margin: "0 0 25px 0", color: "#333", fontSize: "24px", fontWeight: "900" }}>예약이 완료되었습니다!</h3>
                
                <div style={{ background: "#f8f9ff", borderRadius: "12px", padding: "25px", border: "1px solid #eaddff", marginBottom: "30px", textAlign: "left" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ color: "#666", fontSize: "15px" }}>예약 충전소</span>
                    <strong style={{ color: "#333", fontSize: "16px" }}>{selectedStation.stationName}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ color: "#666", fontSize: "15px" }}>예약 충전기</span>
                    <strong style={{ color: "#333", fontSize: "16px" }}>{selectedCharger.chargerName || `${selectedCharger.chargerId}호기`}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#666", fontSize: "15px" }}>예약 시간</span>
                    <strong style={{ color: "#B452B5", fontSize: "20px", padding: "4px 0px", borderRadius: "8px" }}>{selectedTime}</strong>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = '/'} // 📍 홈으로 돌아가기
                  style={{ width: "100%", padding: "18px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #B452B5 0%, #7a5de8 100%)", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 12px rgba(122, 93, 232, 0.3)" }}
                >
                  홈으로 돌아가기
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default ReservationPage;