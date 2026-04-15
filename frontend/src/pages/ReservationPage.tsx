function ReservationPage() {
  return (
    <div style={{ backgroundColor: "#f4f5fa", minHeight: "100vh", padding: "40px 20px" }}>
      {/* --- [1] 상단 헤더 --- */}
      <header style={{ maxWidth: "900px", margin: "0 auto 30px auto", textAlign: "center" }}>
        <h1 style={{  color: "#4a3b8a", fontSize: "28px", fontWeight: "900", letterSpacing: "-1px" }}>
          충전소 예약
        </h1>
        <p style={{ color: "#888", fontSize: "14px", marginTop: "5px" }}>원하시는 충전소와 시간대를 선택하여 예약을 진행해 주세요.</p>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "25px" }}>
        
        {/* --- [2] 충전소 검색 및 선택 섹션 --- */}
        <section style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ backgroundColor: "#B452B5", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>1</span>
            <h3 style={{ margin: 0, color: "#333", fontSize: "18px", fontWeight: "800" }}>충전소 선택</h3>
          </div>
          
          <div style={{ position: "relative" }}>
            <input 
              type="text" 
              placeholder="예약하실 충전소 이름을 검색하세요" 
              style={{ width: "100%", padding: "16px 20px", borderRadius: "14px", border: "2px solid #eaddff", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
            />
            <button style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", padding: "8px 16px", background: "#B452B5", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>검색</button>
          </div>

          {/* 검색 결과 예시 (선택 시 노출) */}
          <div style={{ marginTop: "15px", padding: "15px", borderRadius: "12px", background: "#f8f9ff", border: "1px solid #eaddff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong style={{ color: "#4a3b8a", display: "block" }}>강남역 공영주차장 충전소</strong>
              <span style={{ fontSize: "12px", color: "#888" }}>서울특별시 강남구 강남대로 123</span>
            </div>
            <span style={{ fontSize: "12px", color: "#B452B5", fontWeight: "bold" }}>선택됨</span>
          </div>
        </section>

        {/* --- [3] 충전기 리스트 및 시간대 선택 섹션 --- */}
        <section style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
            <span style={{ backgroundColor: "#B452B5", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>2</span>
            <h3 style={{ margin: 0, color: "#333", fontSize: "18px", fontWeight: "800" }}>충전기 및 시간 선택</h3>
          </div>

          {/* 충전기 타입 선택 (탭 형태) */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "2px solid #B452B5", background: "#fff", color: "#B452B5", fontWeight: "bold", cursor: "pointer" }}>급속 (1호기)</button>
            <button style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "2px solid #eee", background: "#f9f9f9", color: "#aaa", fontWeight: "bold", cursor: "pointer" }}>완속 (2호기)</button>
          </div>

          {/* 시간대 슬롯 그리드 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
            {/* 시간 슬롯 예시 */}
            {Array.from({ length: 12 }).map((_, i) => {
              const hour = i + 9; // 09:00부터 시작 예시
              const isReserved = i === 2 || i === 3; // 예약 불가 예시
              const isSelected = i === 0; // 현재 선택 예시
              
              return (
                <button 
                  key={i}
                  disabled={isReserved}
                  style={{ 
                    padding: "15px 0", 
                    borderRadius: "12px", 
                    border: isSelected ? "2px solid #B452B5" : "1px solid #eee",
                    background: isReserved ? "#f5f5f5" : (isSelected ? "#F5E6FF" : "#fff"),
                    color: isReserved ? "#ccc" : (isSelected ? "#B452B5" : "#555"),
                    fontSize: "14px",
                    fontWeight: isSelected ? "bold" : "normal",
                    cursor: isReserved ? "not-allowed" : "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {hour}:00
                  <span style={{ display: "block", fontSize: "10px", marginTop: "2px" }}>
                    {isReserved ? "예약불가" : "예약가능"}
                  </span>
                </button>
              )
            })}
          </div>

          {/* 안내 문구 */}
          <div style={{ background: "#fdf8ff", padding: "15px", borderRadius: "12px", border: "1px solid #f3e5f5" }}>
            <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#7b61ff", lineHeight: "1.8" }}>
              <li>급속 충전기는 최대 1시간까지 예약 가능합니다.</li>
              <li>예약 시간 10분 경과 시 자동 취소될 수 있습니다.</li>
            </ul>
          </div>
        </section>

        {/* --- [4] 하단 예약 버튼 --- */}
        <button style={{ 
          width: "100%", 
          padding: "20px", 
          borderRadius: "18px", 
          border: "none", 
          background: "linear-gradient(135deg, #B452B5 0%, #7a5de8 100%)", 
          color: "#fff", 
          fontSize: "18px", 
          fontWeight: "900", 
          cursor: "pointer",
          boxShadow: "0 10px 20px rgba(122, 93, 232, 0.3)",
          transition: "transform 0.1s active"
        }}>
          예약 확정 및 결제하기
        </button>

      </main>
    </div>
  )
}

export default ReservationPage;