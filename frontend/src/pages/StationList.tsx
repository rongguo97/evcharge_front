import { useState, useEffect, useRef } from "react";
import StationService from "../services/StationService"; 
import type { IStation } from "../types/IStation";

// 1. SQL charger_type 컬럼 값과 UI 명칭 매핑 테이블 (컴포넌트 외부 선언)
const SPEED_MAP: { [key: string]: string } = {
  "01": "급속",
  "02": "완속",
  "1": "급속",
  "2": "완속",
  "Fast": "급속",
  "Slow": "완속"
};

const StationList = () => {
  const [map, setMap] = useState<any>(null);
  const [stations, setStations] = useState<IStation[]>([]);
  
  // 필터 상태 관리
  const [searchTerm, setSearchTerm] = useState("");     // 이름 검색
  const [selectedSpeed, setSelectedSpeed] = useState("전체"); // 급속/완속 필터
  const [selectedStatus, setSelectedStatus] = useState("전체"); // 충전기 상태 필터
  
  const markersRef = useRef<any[]>([]); // 마커 관리용 Ref (중복 방지)

  // 1. 지도 초기화 (카카오맵 로드)
  useEffect(() => {
    const initMap = () => {
      const { kakao } = window as any;
      kakao.maps.load(() => {
        const container = document.getElementById('map');
        if (!container) return;

        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.9780), // 초기 서울 중심
          level: 3 
        };

        const kakaoMap = new kakao.maps.Map(container, options);
        setMap(kakaoMap);
      });
    };

    if ((window as any).kakao && (window as any).kakao.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.id = 'kakao-map-script';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=54b7f47833ff0482e1109c4a46ff80a2&libraries=services&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => initMap();
    }
  }, []);

  // 2. 백엔드 데이터 가져오기
  useEffect(() => {
    const fetchStations = () => {
      StationService.getAll("", 0, 100) 
        .then((response: any) => {
          const data = response.data.result || response.data.content || response.data;
          if (Array.isArray(data)) {
            setStations(data);
          }
        })
        .catch((e: Error) => console.error("❌ 로드 실패:", e));
    };

    if (map) fetchStations();
  }, [map]);

  // 3. 통합 필터링 로직 (검색 + 속도 + 상태 + 중복제거)
  const filteredStations = stations
    .filter((s) => {
      // A) 이름/주소 검색 필터
      const matchesSearch = s.stationName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // B) 속도 필터 (SQL charger_type 매핑 적용)
      const currentStationSpeed = SPEED_MAP[s.chargerType as keyof typeof SPEED_MAP] || s.chargerType;
      const matchesSpeed = selectedSpeed === "전체" || currentStationSpeed === selectedSpeed;
      
      // C) 상태 필터
      const matchesStatus = selectedStatus === "전체" || s.stat === selectedStatus;
      
      return matchesSearch && matchesSpeed && matchesStatus;
    })
    .filter((station, index, self) =>
      // D) 중복 제거 (이름과 주소가 동일한 경우)
      index === self.findIndex((t) => (
        t.stationName === station.stationName && t.address === station.address
      ))
    );

  // 4. 필터링된 데이터 기반 마커 생성
  useEffect(() => {
    const { kakao } = window as any;
    if (!map || !kakao) return;

    // 기존 마커 제거 (지도 청소)
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    filteredStations.forEach((station) => {
      if (!station.lat || !station.lng) return;

      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(station.lat, station.lng),
        map: map
      });

      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px; color:black; font-size:12px;">${station.stationName}</div>`,
        removable: true
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });

      markersRef.current.push(marker); // 마커 관리용 배열에 추가
    });
  }, [map, filteredStations]);

  // 5. 리스트 클릭 시 이동 함수
  const handleLocationClick = (lat: number, lng: number) => {
    const { kakao } = window as any;
    if (map && kakao) {
      map.panTo(new kakao.maps.LatLng(lat, lng));
    }
  };

  return (
    <div className="station-container" style={{ display: "flex", width: "100%", height: "700px", padding: "20px", boxSizing: "border-box" }}>
      
      {/* 📍 사이드바: 검색 및 필터 UI */}
      <aside style={{ width: "350px", display: "flex", flexDirection: "column", marginRight: "20px", gap: "15px" }}>
        
        {/* 검색창 */}
        <section>
          <h3 style={labelStyle}>🔎 충전소 검색</h3>
          <input 
            type="text"
            placeholder="충전소명을 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
          />
        </section>

        {/* 속도 필터 */}
        <section>
          <h3 style={labelStyle}>⚡ 충전 속도</h3>
          <div style={{ display: "flex", gap: "5px" }}>
            {["전체", "급속", "완속"].map(type => (
              <button 
                key={type} 
                onClick={() => setSelectedSpeed(type)}
                style={selectedSpeed === type ? activeBtn : inactiveBtn}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* 상태 필터 */}
        <section>
          <h3 style={labelStyle}>⚙️ 충전기 상태</h3>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={selectStyle}
          >
            <option value="전체">전체 상태보기</option>
            <option value="충전가능">충전가능</option>
            <option value="충전중">충전중</option>
            <option value="고장점검">고장점검</option>
            <option value="통신장애">통신장애</option>
            <option value="통신미연결">통신미연결</option>
            <option value="충전종료">충전종료</option>
            <option value="계획정지">계획정지</option>
          </select>
        </section>

        {/* 결과 리스트 */}
        <div style={listAreaStyle}>
          {filteredStations.length > 0 ? (
            filteredStations.map((s) => (
              <div 
                key={s.stationId} 
                onClick={() => handleLocationClick(s.lat, s.lng)}
                style={cardStyle}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <strong style={{ fontSize: "14px" }}>{s.stationName}</strong>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{s.address}</div>
                <div style={{ fontSize: "11px", color: "#007bff", marginTop: "6px" }}>
                  {SPEED_MAP[s.chargerType as keyof typeof SPEED_MAP] || s.chargerType} | {s.stat}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>검색 결과가 없습니다.</div>
          )}
        </div>
      </aside>

      {/* 🗺️ 지도 영역 */}
      <div 
        id="map" 
        style={{ 
          flex: 1,
          height: "100%", 
          borderRadius: "10px", 
          border: '1px solid #ddd' 
        }} 
      />
    </div>
  );
};

// --- 스타일 설정 (인라인) ---
const labelStyle = { fontSize: "15px", marginBottom: "8px", fontWeight: "bold" as "bold" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box" as "border-box" };
const selectStyle = { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", cursor: "pointer" };
const listAreaStyle = { flex: 1, overflowY: "auto" as "auto", border: "1px solid #eee", borderRadius: "8px", background: "#fff" };
const cardStyle = { padding: "15px", borderBottom: "1px solid #f0f0f0", cursor: "pointer" };
const btnStyle = { flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "5px", cursor: "pointer", fontSize: "13px" };
const activeBtn = { ...btnStyle, background: "#fee500", border: "1px solid #fee500", fontWeight: "bold" as "bold" };
const inactiveBtn = { ...btnStyle, background: "#fff" };

export default StationList;