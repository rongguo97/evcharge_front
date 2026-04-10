import { useState, useEffect, useRef, useMemo } from "react";
import StationService from "../services/StationService";
import type { IStation } from "../types/IStation";
import {
  getStatusLabel,
  getTypeLabel,
  getMethodLabel,
  SPEED_MAP,
  normalizeSido,
} from "../common/stationConverter";
import { statusColorMap } from "../common/statusColorMap";

const StationList = () => {
  /* --- [1] 상태 관리 (State) --- */
  const [map, setMap] = useState<any>(null);               // 카카오 맵 객체
  const [stations, setStations] = useState<IStation[]>([]); // 서버 전체 데이터
  const [searchTerm, setSearchTerm] = useState("");         // 검색어
  const [selectedSpeed, setSelectedSpeed] = useState("전체"); // 급속/완속 필터
  const [selectedStatus, setSelectedStatus] = useState("전체"); // 상황 필터
  const [selectedMethod, setSelectedMethod] = useState("전체"); // 방식 필터
  const [isFilterOpen, setIsFilterOpen] = useState(false);  // 필터창 노출 여부

  // 📍 지역 필터 상태 (시/도 및 시/군/구)
  const [selectedSido, setSelectedSido] = useState("전체");
  const [selectedGungu, setSelectedGungu] = useState("전체");

  const markersRef = useRef<any[]>([]); // 지도 마커 저장용
  const wholeContainerRef = useRef<HTMLDivElement>(null); // 전체 영역 감지용 (외부 클릭)

  /* --- [2] 동적 지역 리스트 생성 (useMemo로 성능 최적화) --- */
  
  // A. 시/도 리스트: 전체 데이터의 주소 첫 단어를 중복 없이 추출
  const sidoList = useMemo(() => {
    const set = new Set(stations.map(s => normalizeSido(s.address)));
  // 전체를 제외한 지역 가나다순으로 나열
    const sortedSido = Array.from(set).sort();
    // 리스트 맨앞에 전체 추가
    return ["전체", ...sortedSido];
  }, [stations]);

  // B. 시/군/구 리스트: 선택된 시/도에 속한 데이터들의 두 번째 단어를 추출
  const gunguList = useMemo(() => {
    if (selectedSido === "전체") return ["전체"];
    const set = new Set(
      stations
        .filter(s => normalizeSido(s.address) === selectedSido)
        .map(s => s.address.split(" ")[1])
        .filter(Boolean)
    );
    const sortedGungu = Array.from(set).sort();
   return ["전체", ...sortedGungu];
}, [selectedSido, stations]);
  /* --- [3] 외부 클릭 감지: 전체 영역 밖을 누르면 필터 닫기 --- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wholeContainerRef.current && !wholeContainerRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* --- [4] 카카오 지도 초기화 --- */
  useEffect(() => {
    const initMap = () => {
      const { kakao } = window as any;
      kakao.maps.load(() => {
        const container = document.getElementById("map");
        if (!container) return;
        setMap(new kakao.maps.Map(container, { center: new kakao.maps.LatLng(37.5665, 126.978), level: 3 }));
      });
    };
    if ((window as any).kakao && (window as any).kakao.maps) { initMap(); } 
    else {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=54b7f47833ff0482e1109c4a46ff80a2&libraries=services&autoload=false`;
      script.onload = () => initMap();
      document.head.appendChild(script);
    }
  }, []);

  /* --- [5] 데이터 호출 --- */
  useEffect(() => {
    if (map) {
      StationService.getAll("", 0, 100).then((res: any) => {
        const data = res.data.result || res.data.content || res.data;
        if (Array.isArray(data)) setStations(data);
      });
    }
  }, [map]);

  /* --- [6] 필터링 및 그룹화 로직 --- */
  const getGroupedStations = () => {
    const filtered = stations.filter((s) => {
      const matchesSearch = s.stationName.toLowerCase().includes(searchTerm.toLowerCase());
      const currentSpeed = SPEED_MAP[s.chargerType as keyof typeof SPEED_MAP] || s.chargerType;
      const matchesSpeed = selectedSpeed === "전체" || currentSpeed === selectedSpeed;
      const matchesStatus = selectedStatus === "전체" || getStatusLabel(s.status) === selectedStatus;
      const matchesMethod = selectedMethod === "전체" || getMethodLabel(s.chargerMethod) === selectedMethod;
      
      // 📍 시/도 및 시/군/구 필터링 로직
      const matchesSido = selectedSido === "전체" || normalizeSido(s.address) === selectedSido;
      const matchesGungu = selectedGungu === "전체" || s.address.split(" ")[1] === selectedGungu;

      return matchesSearch && matchesSpeed && matchesStatus && matchesMethod && matchesSido && matchesGungu;
    });

    const groups: { [key: string]: any } = {};
    filtered.forEach((s) => {
      if (!groups[s.stationId]) groups[s.stationId] = { ...s, chargers: [] };
      groups[s.stationId].chargers.push(s);
    });
    return Object.values(groups);
  };

  const filteredGroups = getGroupedStations();

  /* --- [7] 마커 및 인포윈도우 생성 --- */
  useEffect(() => {
    const { kakao } = window as any;
    if (!map || !kakao) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    filteredGroups.forEach((group: any) => {
      const marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(group.lat, group.lng), map });
      const chargerListHtml = group.chargers.map((ch: IStation) => {
        const statusText = getStatusLabel(ch.status);
        const statusColor = statusColorMap[statusText] || "#333";
        return `
          <div style="padding: 10px; background: #f8f9fa; border-radius: 8px; border: 1px solid #eee; margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong style="color: #000; font-size: 13px;">${ch.chargerName || "충전기"}</strong>
              <span style="color: ${statusColor}; font-weight: 800; font-size: 11px; border: 1px solid ${statusColor}; padding: 1px 5px; border-radius: 4px;">${statusText}</span>
            </div>
            <div style="color: #444; font-size: 12px; margin-top: 4px; font-weight: 600;">⚡ ${getTypeLabel(ch.chargerType)} | 🔌 ${getMethodLabel(ch.chargerMethod)}</div>
          </div>`;
      }).join("");

      const content = `<div style="padding:15px; background:#fff; border-radius:12px; border:1px solid #ccc; min-width:280px; font-family:sans-serif;">
        <strong style="font-size: 17px; color: #000; display: block; margin-bottom: 5px;">${group.stationName}</strong>
        <div style="font-size: 13px; color: #333; margin-bottom: 10px;">📍 ${group.address}</div>
        <div style="max-height: 180px; overflow-y: auto;">${chargerListHtml}</div>
      </div>`;

      const infowindow = new kakao.maps.InfoWindow({ content, removable: true });
      kakao.maps.event.addListener(marker, "click", () => infowindow.open(map, marker));
      markersRef.current.push(marker);
    });
  }, [map, filteredGroups]);

  const handleLocationClick = (lat: number, lng: number) => {
    const { kakao } = window as any;
    if (map && kakao) map.panTo(new kakao.maps.LatLng(lat, lng));
  };

  /* --- [8] UI 렌더링 --- */
  return (
    <div ref={wholeContainerRef} className="station-container" style={{ display: "flex", width: "100%", height: "850px", padding: "20px", boxSizing: "border-box", background: "#f1f3f5" }}>
      <aside style={{ width: "400px", display: "flex", flexDirection: "column", marginRight: "20px", gap: "15px", zIndex: 10 }}>
        
        {/* 검색 섹션 */}
        <section style={sideBoxStyle}>
          <h3 style={titleStyle}>🔎 충전소 검색</h3>
          <input
            type="text"
            placeholder="충전소명을 입력하세요"
            value={searchTerm}
            onFocus={() => setIsFilterOpen(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
          />
        </section>

        {/* 필터 섹션 */}
        {isFilterOpen && (
          <section style={{ ...sideBoxStyle, border: "2px solid #7a5de8" }}>
            {/* 시/도 필터 */}
            <div style={filterRow}>
              <h4 style={filterLabel}>🗺️ 시/도</h4>
              <select value={selectedSido} onChange={(e) => { setSelectedSido(e.target.value); setSelectedGungu("전체"); }} style={selectStyle}>
                {sidoList.map(sido => <option key={sido} value={sido}>{sido}</option>)}
              </select>
            </div>
            {/* 시/군/구 필터 (시/도 선택 시에만 활성화) */}
            <div style={filterRow}>
              <h4 style={filterLabel}>📍 군/구</h4>
              <select value={selectedGungu} onChange={(e) => setSelectedGungu(e.target.value)} disabled={selectedSido === "전체"} style={selectStyle}>
                {gunguList.map(gungu => <option key={gungu} value={gungu}>{gungu}</option>)}
              </select>
            </div>
            {/* 상황 필터 */}
            <div style={filterRow}>
              <h4 style={filterLabel}>⚙️ 상황</h4>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={selectStyle}>
                <option value="전체">전체 상태보기</option>
                {["충전가능", "충전중", "고장/점검", "통신장애", "통신미연결", "충전종료", "계획정지"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {/* 속도 필터 */}
            <div style={filterRow}>
              <h4 style={filterLabel}>🚀 속도</h4>
              <div style={{ display: "flex", gap: "5px", flex: 1 }}>
                {["전체", "급속", "완속"].map(v => (
                  <button key={v} onClick={() => setSelectedSpeed(v)} style={selectedSpeed === v ? activeBtn : inactiveBtn}>{v}</button>
                ))}
              </div>
            </div>
            {/* 방식 필터 */}
            <div style={{ ...filterRow, marginBottom: 0 }}>
              <h4 style={filterLabel}>🔌 방식</h4>
              <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} style={selectStyle}>
                <option value="전체">모든 방식 보기</option>
                {["DC콤보", "DC차데모", "AC3상", "B타입(5핀)", "C타입(5핀)"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </section>
        )}

        {/* 결과 리스트 */}
        <div style={{ ...sideBoxStyle, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <p style={{ fontSize: "14px", color: "#000", fontWeight: "900", marginBottom: "12px", borderBottom: "3px solid #eee", paddingBottom: "10px" }}>
            검색 결과: {filteredGroups.length}건
          </p>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filteredGroups.map((group: any) => (
              <div key={group.stationId} onClick={() => handleLocationClick(group.lat, group.lng)} style={cardStyle}>
                <strong style={{ fontSize: "16px", color: "#000" }}>{group.stationName}</strong>
                <div style={{ fontSize: "13px", color: "#333", marginTop: "5px", fontWeight: "600" }}>📍 {group.address}</div>
                <div style={{ fontSize: "12px", color: "#007bff", fontWeight: "900", marginTop: "10px" }}>가용 충전기: {group.chargers.length}대</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div id="map" style={{ flex: 1, borderRadius: "15px", border: "2px solid #ced4da", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
    </div>
  );
};

/* --- [스타일 설정] --- */
const sideBoxStyle = { background: "#fff", padding: "20px", borderRadius: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", border: "1px solid #dee2e6" };
const titleStyle = { fontSize: "18px", fontWeight: "900", color: "#000", marginBottom: "12px" };
const filterLabel = { fontSize: "14px", fontWeight: "800", color: "#000", width: "60px", margin: 0 };
const filterRow = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" };
const inputStyle = { width: "100%", padding: "14px", borderRadius: "10px", border: "2px solid #000", fontSize: "15px", fontWeight: "700", outline: "none", color: "#000", boxSizing: "border-box" as "border-box" };
const selectStyle = { flex: 1, padding: "10px", borderRadius: "8px", border: "2px solid #eee", fontSize: "14px", fontWeight: "800", color: "#000", cursor: "pointer" };
const cardStyle = { padding: "18px 10px", borderBottom: "1px solid #f1f3f5", cursor: "pointer" };
const btnBase = { flex: 1, padding: "10px", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "900", cursor: "pointer" };
const activeBtn = { ...btnBase, background: "#7a5de8", color: "#fff" };
const inactiveBtn = { ...btnBase, background: "#f1f3f5", color: "#495057" };

export default StationList;