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
  const [map, setMap] = useState<any>(null); // 카카오 지도 객체
  const [stations, setStations] = useState<IStation[]>([]); // 백엔드 호출 데이터
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 입력값
  const [selectedSpeed, setSelectedSpeed] = useState("전체"); // 급속/완속 필터
  const [selectedStatus, setSelectedStatus] = useState("전체"); // 충전소 상태 필터
  const [selectedMethod, setSelectedMethod] = useState("전체"); // 충전 방식 필터
  const [isFilterOpen, setIsFilterOpen] = useState(false); // 필터창 표시 여부
  const [selectedSido, setSelectedSido] = useState("전체"); // 시/도 필터
  const [selectedGungu, setSelectedGungu] = useState("전체"); // 군/구 필터

  const markersRef = useRef<any[]>([]); // 지도 마커 객체 관리
  const wholeContainerRef = useRef<HTMLDivElement>(null); // 외부 클릭 감지를 위한 참조

  /* --- [2] 주소 데이터를 활용한 지역 리스트 추출 (useMemo) --- */
  // 전체 데이터에서 시/도 목록 중복 제거 후 추출
  const sidoList = useMemo(() => {
    const set = new Set(stations.map((s) => normalizeSido(s.address)));
    return ["전체", ...Array.from(set).sort()];
  }, [stations]);

  // 선택된 시/도에 해당하는 군/구 목록 중복 제거 후 추출
  const gunguList = useMemo(() => {
    if (selectedSido === "전체") return ["전체"];
    const set = new Set(
      stations
        .filter((s) => normalizeSido(s.address) === selectedSido)
        .map((s) => s.address.split(" ")[1])
        .filter(Boolean)
    );
    return ["전체", ...Array.from(set).sort()];
  }, [selectedSido, stations]);

  /* --- [3] 이벤트 핸들러 및 유틸리티 함수 --- */
  // 지도 밖 클릭 시 필터창 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wholeContainerRef.current && !wholeContainerRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 브라우저 Geolocation API를 통한 내 위치 조회
  const fetchNearbyStations = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (map) {
          const moveLatLng = new (window as any).kakao.maps.LatLng(latitude, longitude);
          map.panTo(moveLatLng); // 부드럽게 위치 이동
        }
        // 백엔드 주변 조회 API 호출 (반경 5km)
        StationService.getNearby(latitude, longitude, 5.0)
          .then((res: any) => {
            const data = res.data.result || res.data;
            if (Array.isArray(data)) setStations(data);
          })
          .catch((err) => console.error("주변 데이터 호출 에러:", err));
      },
      (err) => console.error("위치 획득 실패:", err)
    );
  };

  /* --- [4] 지도 초기화 (최초 1회 실행) --- */
  useEffect(() => {
    const initMap = () => {
      const { kakao } = window as any;
      kakao.maps.load(() => {
        const container = document.getElementById("map");
        if (!container) return;
        setMap(new kakao.maps.Map(container, {
          center: new kakao.maps.LatLng(37.5665, 126.978),
          level: 3
        }));
      });
    };
    if ((window as any).kakao && (window as any).kakao.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services&autoload=false`;
      script.onload = () => initMap();
      document.head.appendChild(script);
    }
  }, []);

  /* --- [5] 필터 변경 시 서버 데이터 재요청 (API 사이드 필터링) --- */
  useEffect(() => {
    if (!map) return;
    const searchParams = {
     searchKeyword: searchTerm, // 검색어는 여전히 서버에서 처리하는 게 빠릅니다.
    status: "",
    chargerType: "",
    chargerMethod: "",
    page: 0,
    size: 100000,
    };
    StationService.getAll(searchParams)
      .then((res: any) => {
        const data = res.data.result || res.data.content || res.data;
        if (Array.isArray(data)) setStations(data);
      })
      .catch((err) => console.error("데이터 호출 에러:", err));
  }, [map, searchTerm]);

  /* --- [6] 클라이언트 사이드 그룹화 (같은 장소 충전기 묶기) --- */
  const getGroupedStations = () => {
    const groups: { [key: string]: any } = {};
    // 1단계: 주소를 기반으로 시/도, 군/구 필터링
    const addressFiltered = stations.filter((s) => {
      if (!s.address) return false;
      const matchesSido = selectedSido === "전체" || normalizeSido(s.address) === selectedSido;
    const gunguName = s.address.split(" ")[1] || "";
    const matchesGungu = selectedGungu === "전체" || gunguName === selectedGungu;

    // 📍 속도 필터 (getTypeLabel 활용)
    const currentTypeLabel = getTypeLabel(s.chargerType); 
    const matchesSpeed = selectedSpeed === "전체" || currentTypeLabel === selectedSpeed;

    // 📍 방식 필터 (getMethodLabel 활용)
    const currentMethodLabel = getMethodLabel(s.chargerMethod);
    const matchesMethod = selectedMethod === "전체" || currentMethodLabel === selectedMethod;
    
    // 📍 상태 필터 (getStatusLabel 활용)
    const currentStatusLabel = getStatusLabel(s.status);
    const matchesStatus = selectedStatus === "전체" || currentStatusLabel === selectedStatus;

    return matchesSido && matchesGungu && matchesSpeed && matchesMethod && matchesStatus;
    });

    // 2단계: 충전소명과 주소가 같으면 하나의 그룹으로 병합
    addressFiltered.forEach((s) => {
      const groupKey = `${s.stationName}_${s.address}`;
      if (!groups[groupKey]) {
        groups[groupKey] = { ...s, chargers: [] };
      }
      groups[groupKey].chargers.push(s);
    });
    return Object.values(groups);
  };

  const filteredGroups = getGroupedStations();

  /* --- [7] 지도 마커 및 인포윈도우 디자인 --- */
  useEffect(() => {
    const { kakao } = window as any;
    if (!map || !kakao) return;
    
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    filteredGroups.forEach((group: any) => {
      const marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(group.lat, group.lng), map });
      
      const chargerListHtml = group.chargers.map((ch: IStation) => {
        const statusText = getStatusLabel(ch.status);
        const statusColor = statusColorMap[statusText] || "#7a5de8";
        return `
          <div style="padding: 10px; background: #f8f9ff; border-radius: 10px; border: 1px solid #eaddff; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong style="color: #4a3b8a; font-size: 13px;">${ch.chargerName || "충전기"}</strong>
              <span style="color: ${statusColor}; font-weight: 800; font-size: 11px; border: 1px solid ${statusColor}; padding: 2px 6px; border-radius: 6px; background: #fff;">
                ${statusText}
              </span>
            </div>
            <div style="color: #666; font-size: 11px; margin-top: 5px;">
              ${getTypeLabel(ch.chargerType)} | ${getMethodLabel(ch.chargerMethod)}
            </div>
          </div>`;
      }).join("");

      const content = `
        <div style="padding:20px; background:#fff; border-radius:18px; min-width:300px; box-shadow: 0 10px 25px rgba(122,93,232,0.15);">
          <div style="margin-bottom: 12px;">
            <strong style="font-size: 18px; color: #4a3b8a; display: block; margin-bottom: 4px;">${group.stationName}</strong>
            <div style="font-size: 13px; color: #888;"> ${group.address}</div>
          </div>
          <div style="max-height: 200px; overflow-y: auto;">
            ${chargerListHtml}
          </div>
        </div>`;

      const infowindow = new kakao.maps.InfoWindow({ content, removable: true, zIndex: 3 });
      kakao.maps.event.addListener(marker, "click", () => infowindow.open(map, marker));
      markersRef.current.push(marker);
    });
  }, [map, filteredGroups]);

 const handleLocationClick = (lat: number, lng: number) => {
  const { kakao } = window as any;
  if (map && kakao) {
    // panTo는 지도를 부드럽게 이동시킵니다.
    map.panTo(new kakao.maps.LatLng(lat, lng));
  }
};

  /* --- [8] UI 렌더링 --- */
  return (
    <div
      ref={wholeContainerRef}
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        background: "#f4f5fa",
      }}
    >
      {/* 좌측 사이드바 패널 */}
      <aside
        style={{
          width: "450px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          zIndex: 10,
          padding: "20px",
          boxSizing: "border-box",
          background: "linear-gradient(145deg, #ffffff, #f0f1f8)",
        }}
      >
        {/* 검색창 섹션 */}
        <section
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "24px",
            boxShadow: "10px 10px 20px rgba(122, 93, 232, 0.12)",
          }}
        >
          <h3 style={{ fontSize: "19px", fontWeight: "900", color: "#4a3b8a", marginBottom: "15px" }}>
            충전소 찾기
          </h3>
          <input
            type="text"
            placeholder="충전소명을 입력하세요"
            value={searchTerm}
            onFocus={() => setIsFilterOpen(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "2px solid #7a5de8",
              background: "rgba(255, 255, 255, 0.9)",
              fontSize: "15px",
              fontWeight: "700",
              outline: "none",
              color: "#4a3b8a",
              boxSizing: "border-box",
            }}
          />
        </section>

        {/* 조건 필터 섹션 */}
        {isFilterOpen && (
          <section
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "24px",
              boxShadow: "10px 10px 20px rgba(122, 93, 232, 0.12)",
              border: "1px solid rgba(122, 93, 232, 0.2)",
            }}
          >
            {[
              { label: "시/도", value: selectedSido, options: sidoList, onChange: (v: any) => { setSelectedSido(v); setSelectedGungu("전체"); } },
              { label: "군/구", value: selectedGungu, options: gunguList, onChange: (v: any) => setSelectedGungu(v), disabled: selectedSido === "전체" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#4a3b8a", width: "60px", margin: 0 }}>{f.label}</h4>
                <select
                  value={f.value}
                  onChange={(e) => f.onChange(e.target.value)}
                  disabled={f.disabled}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #7a5de8",
                    background: f.disabled ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.9)",
                    fontSize: "14px", fontWeight: "800", color: "#4a3b8a", outline: "none",
                  }}
                >
                  {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}

            {/* 상태 필터 */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#4a3b8a", width: "60px", margin: 0 }}>상황</h4>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #7a5de8", background: "rgba(255, 255, 255, 0.9)", fontSize: "14px", fontWeight: "800", color: "#4a3b8a", outline: "none" }}
              >
                <option value="전체">전체 상태보기</option>
                {["충전가능", "충전중", "고장/점검", "통신장애", "통신미연결", "충전종료", "계획정지"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* 충전 속도 필터 (버튼형) */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#4a3b8a", width: "60px", margin: 0 }}>속도</h4>
              <div style={{ display: "flex", gap: "8px", flex: 1 }}>
                {["전체", "급속", "완속"].map(v => (
                  <button
  key={v}
  onClick={() => setSelectedSpeed(v)}
  style={{
    flex: 1,
    padding: "12px",
    border: "1px solid #7a5de8",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "900",
    // 선택 상태에 따른 배경색/글자색 (기존 로직 유지)
    background: selectedSpeed === v ? "#7a5de8" : "rgba(255, 255, 255, 0.6)",
    color: selectedSpeed === v ? "#fff" : "#7a5de8",
    cursor: "pointer",
    transition: "all 0.2s", // 쫀득한 움직임을 위한 필수 속성
  }}
  // 📍 호버 효과 추가
  onMouseEnter={(e) => {
    // 선택되지 않은 버튼(흰색 배경)일 때만 강조 효과를 줍니다.
    if (selectedSpeed !== v) {
      e.currentTarget.style.filter = "brightness(0.95)"; // 아주 살짝만 어둡게
      e.currentTarget.style.transform = "translateY(-1px)"; // 위로 살짝 이동
    } else {
      // 이미 선택된 버튼(보라색 배경)일 때는 더 진한 보라색으로 강조
      e.currentTarget.style.filter = "brightness(0.9)";
    }
  }}
  onMouseLeave={(e) => {
    // 원래 상태로 복구
    e.currentTarget.style.filter = "brightness(1)";
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
  {v}
</button>
                ))}
              </div>
            </div>

            {/* 방식 필터 */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#4a3b8a", width: "60px", margin: 0 }}>방식</h4>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #7a5de8", background: "rgba(255, 255, 255, 0.9)", fontSize: "14px", fontWeight: "800", color: "#4a3b8a", outline: "none" }}
              >
                <option value="전체">모든 방식 보기</option>
                {["DC콤보", "DC차데모", "AC3상", "B타입(5핀)", "C타입(5핀)"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* 내 주변 찾기 버튼 */}
            <button
              onClick={fetchNearbyStations}
              style={{
                marginTop: "10px", width: "100%", padding: "16px", background: "#7a5de8", color: "#fff", 
                border: "none", borderRadius: "14px", fontWeight: "900", fontSize: "15px", cursor: "pointer",
                boxShadow: "0 6px 15px rgba(122, 93, 232, 0.4)",
              }}
             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5d44cc")} // 호버 시 짙은 보라
             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7a5de8")} // 복귀
            >
              내 주변 5km 충전소 찾기
            </button>
          </section>
        )}

        {/* 검색 결과 리스트 섹션 */}
        <div
          style={{
            background: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "5px 5px 15px rgba(0,0,0,0.03)",
            flex: 1, display: "flex", flexDirection: "column", overflow: "hidden"
          }}
        >
          <p style={{ fontSize: "14px", color: "#4a3b8a", fontWeight: "900", marginBottom: "12px", borderBottom: "2px solid #f0ebff", paddingBottom: "10px" }}>
            검색 결과: {filteredGroups.length}곳
          </p>
          <div style={{ overflowY: "auto", flex: 1, paddingRight: "5px" }}>
            {filteredGroups.map((group: any) => (
              <div
                key={`${group.stationName}_${group.address}`}
                onClick={() => handleLocationClick(group.lat, group.lng)}
                style={{ padding: "18px 10px", borderBottom: "1px solid #f4f5fa", cursor: "pointer" }}
              >
                <strong style={{ fontSize: "16px", color: "#333" }}>{group.stationName}</strong>
                <div style={{ fontSize: "12px", color: "#777", marginTop: "4px" }}>{group.address}</div>
                {/* 주소 바로 밑에 추가 */}
<div style={{ fontSize: "12px", color: "#7a5de8", fontWeight: "bold", marginTop: "8px" }}>
  총 충전기: {group.chargers.length}대
</div>
                
                {/* 리스트 내 버튼들 */}
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); alert(`${group.stationName} 예약 페이지 이동`); }}
                    style={{
                      flex: 1, padding: "12px 0", borderRadius: "12px", border: "none", fontSize: "13px", fontWeight: "900",
                      background: "#7a5de8", color: "#fff", cursor: "pointer"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5d44cc")} // 호버 시 짙은 보라
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7a5de8")} // 복귀
                  >
                    예약하기
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://map.kakao.com/link/to/${encodeURIComponent(group.stationName)},${group.lat},${group.lng}`, "_blank");
                    }}
                    style={{
                      flex: 1, padding: "12px 0", borderRadius: "12px", border: "1px solid #dcd3ff", fontSize: "13px",
                      fontWeight: "900", background: "#f8f9ff", color: "#6e56cf", cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
    e.currentTarget.style.filter = "brightness(0.95)";
    e.currentTarget.style.transform = "translateY(-1px)"; // 살짝 떠오르는 효과 추가
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.filter = "brightness(1)";
    e.currentTarget.style.transform = "translateY(0)";
  }}>길찾기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 우측 지도 섹션 */}
      <main style={{ flex: 1, position: "relative", height: "100%", padding: "20px 20px 20px 10px", boxSizing: "border-box" }}>
        <div
          id="map"
          style={{
            width: "100%", height: "100%", borderRadius: "30px", overflow: "hidden",
            boxShadow: "10px 10px 25px rgba(122, 93, 232, 0.1)", border: "1px solid #eaddff"
          }}
        />
      </main>
    </div>
  );
};

export default StationList;