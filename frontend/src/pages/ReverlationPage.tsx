import React, { useState } from "react";
import StationService from "../services/StationService";
import type { IStation } from "../types/IStation";

function ReservationPage() {
  // --- [1] 상태 관리 ---
  const [keyword, setKeyword] = useState(""); 
  const [results, setResults] = useState<any[]>([]); 
  const [selectedStation, setSelectedStation] = useState<any>(null); 
  const [isSearching, setIsSearching] = useState(false); 

  const [chargers, setChargers] = useState<any[]>([]); 
  const [selectedCharger, setSelectedCharger] = useState<any>(null); 

  // --- [2] 검색 핸들러 (그룹화 로직) ---
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
  };

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
        
        {/* --- [STEP 1] 충전소 선택 섹션 --- */}
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
              {results.length > 0 ? results.map((group, index) => (
                <div 
                  key={group.groupKey || index}
                  onClick={() => handleStationSelect(group)} 
                  style={{ padding: "15px 20px", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }} 
                  onMouseOver={(e) => (e.currentTarget.style.background = "#f8f9ff")} 
                  onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  <span style={{ fontWeight: "600", color: "#333" }}>{group.stationName}</span>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{group.address}</div>
                </div>
              )) : <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>검색 결과가 없습니다.</div>}
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

        {/* --- [STEP 2] 충전기 선택 섹션 (수정된 스타일 적용) --- */}
        {selectedStation && (
          <section style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
              <span style={{ backgroundColor: "#B452B5", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>2</span>
              <h3 style={{ margin: 0, color: "#333", fontSize: "18px", fontWeight: "800" }}>충전기 선택</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {chargers.length > 0 ? chargers.map((ch, index) => {
                const isSelected = selectedCharger?.id === ch.id;

                return (
                  <button
                    key={ch.id || index}
                    onClick={() => setSelectedCharger(ch)}
                    // 📍 마우스 올렸을 때만 배경색 변경
                    onMouseOver={(e) => (e.currentTarget.style.background = "#f8f9ff")}
                    // 📍 마우스 떼면 다시 흰색으로 복구
                    onMouseOut={(e) => (e.currentTarget.style.background = "#ffffff")}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "16px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "block",
                      outline: "none",
                      marginBottom: "8px",
                      // 📍 누르기 전후 모두 흰색 고정
                      background: "#ffffff", 
                      // 📍 테두리 두께와 색상으로만 선택 상태 구분
                      border: isSelected ? "1px solid #eaddff" : "1px solid #eaddff",
                      boxShadow: isSelected ? "0 4px 10px rgba(180, 82, 181, 0.15)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "#4a3b8a", fontSize: "15px", fontWeight: "800" }}>
                        {ch.chargerName || `${ch.chargerId}호기`}
                      </strong>
                      <span style={{ 
                        color: ch.status === "1" ? "#28a745" : "#7a5de8", 
                        fontWeight: "800", fontSize: "11px", 
                        border: `1px solid ${ch.status === "1" ? "#28a745" : "#7a5de8"}`, 
                        padding: "3px 8px", borderRadius: "6px", background: "#fff" 
                      }}>
                        {ch.status === "1" ? "충전가능" : "충전중"}
                      </span>
                    </div>
                    <div style={{ color: "#666", fontSize: "13px", marginTop: "8px", fontWeight: "500" }}>
                      {ch.chargerType === 1 ? "급속" : "완속"} | {ch.chargerMethod || "DC콤보"}
                    </div>
                  </button>
                );
              }) : <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>등록된 충전기가 없습니다.</div>}
            </div>
          </section>
        )}

        {/* --- [STEP 3] 하단 예약 버튼 --- */}
        <button disabled={!selectedStation || !selectedCharger} style={{ width: "100%", padding: "20px", borderRadius: "18px", border: "none", background: (!selectedStation || !selectedCharger) ? "#ccc" : "linear-gradient(135deg, #B452B5 0%, #7a5de8 100%)", color: "#fff", fontSize: "18px", fontWeight: "900", cursor: (!selectedStation || !selectedCharger) ? "default" : "pointer", boxShadow: (!selectedStation || !selectedCharger) ? "none" : "0 10px 20px rgba(122, 93, 232, 0.3)" }}>
          {(!selectedStation || !selectedCharger) ? "충전소와 충전기를 선택해주세요" : "예약 확정 및 결제하기"}
        </button>
      </main>
    </div>
  );
}

export default ReservationPage;