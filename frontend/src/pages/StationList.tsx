import { useState, useEffect, useRef, useMemo } from "react";
import StationService from "../services/StationService";
import type { IStation } from "../types/IStation";
import {
  getStatusLabel,
  getTypeLabel,
  getMethodLabel,
  normalizeSido,
} from "../common/stationConverter";
import { statusColorMap } from "../common/statusColorMap";

const StationList = () => {
  /* --- [1] 상태 관리 (State) --- */
  const [map, setMap] = useState<any>(null);               // 카카오 맵 객체
  const [stations, setStations] = useState<IStation[]>([]); // 서버에서 받아온 필터링된 데이터
  const [searchTerm, setSearchTerm] = useState("");         // 검색어
  const [selectedSpeed, setSelectedSpeed] = useState("전체"); // 급속/완속 필터
  const [selectedStatus, setSelectedStatus] = useState("전체"); // 상태 필터
  const [selectedMethod, setSelectedMethod] = useState("전체"); // 방식 필터
  const [isFilterOpen, setIsFilterOpen] = useState(false);  // 필터창 열림 여부

  const [selectedSido, setSelectedSido] = useState("전체");
  const [selectedGungu, setSelectedGungu] = useState("전체");

  const markersRef = useRef<any[]>([]); // 지도 마커 참조
  const wholeContainerRef = useRef<HTMLDivElement>(null); // 외부 클릭 감지용

  /* --- [2] 지역 리스트 생성 (기본 주소 기반) --- */
  const sidoList = useMemo(() => {
    const set = new Set(stations.map(s => normalizeSido(s.address)));
    return ["전체", ...Array.from(set).sort()];
  }, [stations]);

  const gunguList = useMemo(() => {
    if (selectedSido === "전체") return ["전체"];
    const set = new Set(
      stations
        .filter(s => normalizeSido(s.address) === selectedSido)
        .map(s => s.address.split(" ")[1])
        .filter(Boolean)
    );
    return ["전체", ...Array.from(set).sort()];
  }, [selectedSido, stations]);

  /* --- [3] 외부 클릭 시 필터 닫기 --- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wholeContainerRef.current && !wholeContainerRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* --- 내 위치로 지도 이동 및 데이터 로드 --- */
const fetchNearbyStations = () => {
  if (!navigator.geolocation) {
    alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      // 1. 카카오 지도 중심 이동
      if (map) {
        const moveLatLng = new (window as any).kakao.maps.LatLng(latitude, longitude);
        map.panTo(moveLatLng);
      }

      // 2. 백엔드 API 호출 (반경 5km)
      StationService.getNearby(latitude, longitude, 5.0)
        .then((res: any) => {
          const data = res.data.result || res.data;
          if (Array.isArray(data)) {
            setStations(data); // 가져온 주변 데이터를 상태에 저장
          }
        })
        .catch((err) => console.error("주변 충전소 로드 실패:", err));
    },
    (err) => {
  console.error("위치 획득 실패:", err);
  
  // if (err.code === 1) { // PERMISSION_DENIED
  //   alert("위치 정보 권한이 차단되었습니다. 권한을 허용해주세요!");
  // } else if (err.code === 2) { // POSITION_UNAVAILABLE
  //   alert("현재 위치를 파악할 수 없습니다. 잠시 후 다시 시도해주세요.");
  // } else if (err.code === 3) { // TIMEOUT
  //   alert("위치 정보를 가져오는 시간이 초과되었습니다.");
  // }
}
  );
};
// 기존에 map이 생성될 때 실행되는 useEffect 하단에 추가하거나 별도로 작성
useEffect(() => {
  if (map) {
    fetchNearbyStations();
  }
}, [map]); // 지도가 로드되면 자동으로 내 주변을 찾습니다.

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
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services&autoload=false`;
      script.onload = () => initMap();
      document.head.appendChild(script);
    }
  }, []);

  /* --- [5] 서버 데이터 호출 (서버 사이드 필터링) --- */
  useEffect(() => {
    if (!map) return;

    // 서버에 보낼 파라미터 구성 (통합 필터)
    const searchParams = {
      searchKeyword: searchTerm,
      status: selectedStatus === "전체" ? "" : selectedStatus,
      chargerType: selectedSpeed === "전체" ? "" : selectedSpeed,
      chargerMethod: selectedMethod === "전체" ? "" : selectedMethod,
      sido: selectedSido === "전체" ? "" : selectedSido,
      gungu: selectedGungu === "전체" ? "" : selectedGungu,
      page: 0,
      size: 500 // 충분한 데이터 양 확보
    };

    StationService.getAll(searchParams).then((res: any) => {
      const data = res.data.result || res.data.content || res.data;
      if (Array.isArray(data)) setStations(data);
    }).catch(err => console.error("데이터 호출 에러:", err));
    
  }, [map, searchTerm, selectedSido, selectedGungu, selectedStatus, selectedSpeed, selectedMethod]);

  /* --- [6] 그룹화 및 주소 필터링 로직 (최종) --- */
const getGroupedStations = () => {
  const groups: { [key: string]: any } = {};

  // 1단계: 서버에서 가져온 stations 중 사용자가 선택한 [시/도]와 [군/구]에 맞는 것만 먼저 뽑습니다.
  const addressFiltered = stations.filter((s) => {
    if (!s.address) return false;

    // 시/도 체크
    const matchesSido = selectedSido === "전체" || normalizeSido(s.address) === selectedSido;
    
    // 군/구 체크 (주소 문자열 쪼개기)
    const addressParts = s.address.split(" ");
    const gunguName = addressParts.length > 1 ? addressParts[1] : "";
    const matchesGungu = selectedGungu === "전체" || gunguName === selectedGungu;

    return matchesSido && matchesGungu;
  });

  // 2단계: 걸러진 데이터(addressFiltered)를 가지고 기존처럼 이름과 주소로 묶습니다.
  addressFiltered.forEach((s) => {
    // 📍 여기서 이름과 주소로 묶어주기 때문에 기존 기능이 유지됩니다!
    const groupKey = `${s.stationName}_${s.address}`;

    if (!groups[groupKey]) {
      groups[groupKey] = { ...s, chargers: [] };
    }
    // 같은 장소(groupKey)에 여러 대의 충전기를 추가
    groups[groupKey].chargers.push(s);
  });

  // 3단계: 묶인 객체들을 배열로 변환해서 반환
  return Object.values(groups);
};

// 지도와 리스트는 이 결과를 사용합니다.
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
              <strong style="color: #000; font-size: 12px;">${ch.chargerName || "충전기"}</strong>
              <span style="color: ${statusColor}; font-weight: 800; font-size: 11px; border: 1px solid ${statusColor}; padding: 1px 4px; border-radius: 4px;">${statusText}</span>
            </div>
            <div style="color: #444; font-size: 11px; margin-top: 4px;">⚡ ${getTypeLabel(ch.chargerType)} | 🔌 ${getMethodLabel(ch.chargerMethod)}</div>
          </div>`;
      }).join("");

      const content = `
        <div style="padding:15px; background:#fff; border-radius:12px; border:1px solid #ccc; min-width:280px; font-family:sans-serif;">
          <strong style="font-size: 16px; color: #000; display: block; margin-bottom: 5px;">${group.stationName}</strong>
          <div style="font-size: 12px; color: #666; margin-bottom: 10px;">📍 ${group.address}</div>
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
    <div ref={wholeContainerRef} className="station-container" style={{ display: "flex", width: "100vh", height: "850px",  boxSizing: "border-box", background: "#f1f3f5" }}>
      <aside style={{ width: "450px",height: "100%", display: "flex", flexDirection: "column", marginRight: "20px", gap: "15px", zIndex: 10 }}>
        
        {/* 검색 섹션 */}
        <section style={sideBoxStyle}>
          <h3 style={titleStyle}> 충전소 찾기</h3>
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
            <div style={filterRow}><h4 style={filterLabel}>시/도</h4>
              <select value={selectedSido} onChange={(e) => { setSelectedSido(e.target.value); setSelectedGungu("전체"); }} style={selectStyle}>
                {sidoList.map(sido => <option key={sido} value={sido}>{sido}</option>)}
              </select>
            </div>
            <div style={filterRow}><h4 style={filterLabel}>군/구</h4>
              <select value={selectedGungu} onChange={(e) => setSelectedGungu(e.target.value)} disabled={selectedSido === "전체"} style={selectStyle}>
                {gunguList.map(gungu => <option key={gungu} value={gungu}>{gungu}</option>)}
              </select>
            </div>
            <div style={filterRow}><h4 style={filterLabel}>상황</h4>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={selectStyle}>
                <option value="전체">전체 상태보기</option>
                {["충전가능", "충전중", "고장/점검", "통신장애", "통신미연결", "충전종료", "계획정지"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={filterRow}><h4 style={filterLabel}>속도</h4>
              <div style={{ display: "flex", gap: "5px", flex: 1 }}>
                {["전체", "급속", "완속"].map(v => (
                  <button key={v} onClick={() => setSelectedSpeed(v)} style={selectedSpeed === v ? activeBtn : inactiveBtn}>{v}</button>
                ))}
              </div>
            </div>
            <div style={{ ...filterRow, marginBottom: 0 }}><h4 style={filterLabel}>🔌 방식</h4>
              <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} style={selectStyle}>
                <option value="전체">모든 방식 보기</option>
                {["DC콤보", "DC차데모", "AC3상", "B타입(5핀)", "C타입(5핀)"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            {/* 검색창 섹션 등에 추가 */}
<button 
  onClick={fetchNearbyStations}
  style={{
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#7a5de8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  }}
>
   내 주변 충전소 찾기
</button>
          </section>
        )}

        {/* 결과 리스트 */}
        <div style={{ ...sideBoxStyle, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <p style={{ fontSize: "14px", color: "#000", fontWeight: "900", marginBottom: "12px", borderBottom: "3px solid #eee", paddingBottom: "10px" }}>
            검색 결과: {filteredGroups.length}곳의 충전소
          </p>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filteredGroups.map((group: any) => (
              <div key={`${group.stationName}_${group.address}`} onClick={() => handleLocationClick(group.lat, group.lng)} style={cardStyle}>
                <strong style={{ fontSize: "16px", color: "#000" }}>{group.stationName}</strong>
                <div style={{ fontSize: "13px", color: "#333", marginTop: "5px", fontWeight: "600" }}> {group.address}</div>
                <div style={{ fontSize: "12px", color: "#007bff", fontWeight: "900", marginTop: "10px" }}>총 충전기: {group.chargers.length}대</div>

                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <button style={reserveBtnStyle} onClick={(e) => { e.stopPropagation(); alert(`${group.stationName} 예약 페이지 이동`); }}> 예약하기</button>
                  <button style={routeBtnStyle} onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        const url = `https://map.kakao.com/link/from/내위치,${pos.coords.latitude},${pos.coords.longitude}/to/${encodeURIComponent(group.stationName)},${group.lat},${group.lng}`;
                        window.open(url, "_blank");
                      }, () => {
                        window.open(`https://map.kakao.com/link/to/${encodeURIComponent(group.stationName)},${group.lat},${group.lng}`, "_blank");
                      });
                    }
                  }}> 길찾기</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div id="map" style={{ flex: 1, borderRadius: "15px", border: "2px solid #ced4da", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
    </div>
  );
};

/* --- 스타일 정의 --- */
const sideBoxStyle = { background: "#fff", padding: "20px", borderRadius: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", border: "1px solid #dee2e6" };
const titleStyle = { fontSize: "18px", fontWeight: "900", color: "#000", marginBottom: "12px" };
const filterLabel = { fontSize: "14px", fontWeight: "800", color: "#000", width: "60px", margin: 0 };
const filterRow = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" };
const inputStyle = { width: "100%", padding: "14px", borderRadius: "10px", border: "2px solid #000", fontSize: "15px", fontWeight: "700", outline: "none", color: "#000", boxSizing: "border-box" as "border-box" };
const selectStyle = { flex: 1, padding: "10px", borderRadius: "8px", border: "2px solid #eee", fontSize: "14px", fontWeight: "800", color: "#000", cursor: "pointer" };
const cardStyle = { padding: "18px 10px", borderBottom: "1px solid #f1f3f5", cursor: "pointer" };
const reserveBtnStyle = { flex: 1, padding: "10px 0", background: "#7a5de8", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "900", cursor: "pointer" };
const routeBtnStyle = { flex: 1, padding: "10px 0", background: "#fff", color: "#495057", border: "1px solid #dee2e6", borderRadius: "8px", fontSize: "13px", fontWeight: "900", cursor: "pointer" };
const activeBtn = { flex: 1, padding: "10px", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "900", background: "#7a5de8", color: "#fff", cursor: "pointer" };
const inactiveBtn = { flex: 1, padding: "10px", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "900", background: "#f1f3f5", color: "#495057", cursor: "pointer" };

export default StationList;