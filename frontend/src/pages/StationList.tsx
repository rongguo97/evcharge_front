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
// 이미지
import InUseIcon from "../image/in_use.png";
import FixIcon from "../image/fix.png";
import CanReservationIcon from "../image/can_reservation.png";
import InChargeIcon from "../image/in_charge.png";
import LiveInformationIcon from "../image/live_information.png";
import ReservationIcon from "../image/reservation.png";
import Simple_ReservationIcon from "../image/simple_reservation.png";

const StationList = () => {
  /* --- [1] 상태 관리 (State) --- */
  const [map, setMap] = useState<any>(null);
  const [stations, setStations] = useState<IStation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpeed, setSelectedSpeed] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedMethod, setSelectedMethod] = useState("전체");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSido, setSelectedSido] = useState("전체");
  const [selectedGungu, setSelectedGungu] = useState("전체");

  const markersRef = useRef<any[]>([]);
  const wholeContainerRef = useRef<HTMLDivElement>(null);

  /* --- [2] 주소 데이터를 활용한 지역 리스트 추출 (useMemo) --- */
  const sidoList = useMemo(() => {
    const set = new Set(stations.map((s) => normalizeSido(s.address)));
    return ["전체", ...Array.from(set).sort()];
  }, [stations]);

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
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wholeContainerRef.current && !wholeContainerRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          map.panTo(moveLatLng);
        }
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

  /* --- [4] 지도 초기화 --- */
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

  /* --- [5] 서버 데이터 호출 --- */
  useEffect(() => {
    if (!map) return;
    const searchParams = {
      searchKeyword: searchTerm,
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

  /* --- [6] 클라이언트 사이드 그룹화 --- */
  const getGroupedStations = () => {
    const groups: { [key: string]: any } = {};
    const addressFiltered = stations.filter((s) => {
      if (!s.address) return false;
      const matchesSido = selectedSido === "전체" || normalizeSido(s.address) === selectedSido;
      const gunguName = s.address.split(" ")[1] || "";
      const matchesGungu = selectedGungu === "전체" || gunguName === selectedGungu;

      const currentTypeLabel = getTypeLabel(s.chargerType); 
      const matchesSpeed = selectedSpeed === "전체" || currentTypeLabel === selectedSpeed;

      const currentMethodLabel = getMethodLabel(s.chargerMethod);
      const matchesMethod = selectedMethod === "전체" || currentMethodLabel === selectedMethod;
      
      const currentStatusLabel = getStatusLabel(s.status);
      const matchesStatus = selectedStatus === "전체" || currentStatusLabel === selectedStatus;

      return matchesSido && matchesGungu && matchesSpeed && matchesMethod && matchesStatus;
    });

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
      map.panTo(new kakao.maps.LatLng(lat, lng));
    }
  };

  /* --- [대시보드 데이터 집계] --- */
  const stats = useMemo(() => {
    return {
      total: stations.length,
      inUse: stations.filter(s => getStatusLabel(s.status) === "충전중").length,
      available: stations.filter(s => getStatusLabel(s.status) === "충전가능").length,
      maintenance: stations.filter(s => ["고장/점검", "통신장애", "계획정지"].includes(getStatusLabel(s.status))).length
    };
  }, [stations]);

  const currentTime = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date());

  return (
    <div ref={wholeContainerRef} style={{ display: "flex", width: "100%", height: "100%", position: "relative", boxSizing: "border-box", background: "#f4f5fa" }}>
      
      {/* 좌측 사이드바 */}
      <aside style={{ width: "450px", height: "100%", display: "flex", flexDirection: "column", gap: "20px", zIndex: 10, padding: "20px", boxSizing: "border-box", background: "linear-gradient(145deg, #ffffff, #f0f1f8)", position: "relative" }}>
        
        {/* 검색창 섹션 */}
        <section style={{ background: "transparent", padding: "0 0 5px 0", zIndex: 30 }}>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              placeholder="충전소, 주소를 검색하세요"
              value={searchTerm}
              onFocus={() => setIsFilterOpen(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%", padding: "16px 50px 16px 20px", borderRadius: "14px", border: "2px solid #929292",
                background: "#F5F5F5", fontSize: "16px", fontWeight: "700", outline: "none", color: "#333", boxSizing: "border-box"
              }}
            />
            <svg style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", width: "22px", height: "22px", color: "#000" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </section>

        {/* [필터 섹션] */}
        {isFilterOpen && (
          <section style={{ 
            position: "absolute",
            top: "95px",
            left: "20px",
            right: "20px",
            background: "#fff", 
            padding: "25px", 
            borderRadius: "24px", 
            boxShadow: "0 15px 35px rgba(122, 93, 232, 0.2)", 
            border: "1px solid rgba(122, 93, 232, 0.2)",
            zIndex: 40 
          }}>
            {/* 시/도, 군/구 */}
            {[
              { label: "시/도", value: selectedSido, options: sidoList, onChange: (v: any) => { setSelectedSido(v); setSelectedGungu("전체"); } },
              { label: "군/구", value: selectedGungu, options: gunguList, onChange: (v: any) => setSelectedGungu(v), disabled: selectedSido === "전체" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#4a3b8a", width: "60px", margin: 0 }}>{f.label}</h4>
                <select value={f.value} onChange={(e) => f.onChange(e.target.value)} disabled={f.disabled} 
                  style={{ flex: 1, padding: "12px", borderRadius: "14px", border: "2px solid #929292", background: f.disabled ? "rgba(255, 255, 255, 0.5)" : "#F5F5F5", fontSize: "14px", fontWeight: "800", color: "#333", outline: "none" }}>
                  {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}

            {/* 상황 필터 */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#4a3b8a", width: "60px", margin: 0 }}>상황</h4>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} 
                style={{ flex: 1, padding: "12px", borderRadius: "14px", border: "2px solid #929292", background: "#F5F5F5", fontSize: "14px", fontWeight: "800", color: "#333", outline: "none" }}>
                <option value="전체">전체 상태보기</option>
                {["충전가능", "충전중", "고장/점검"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* 속도 필터 */}
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
                      border: selectedSpeed === v ? "1px solid #B452B5" : "2px solid #929292", 
                      borderRadius: "14px", 
                      fontSize: "13px", 
                      fontWeight: "900", 
                      background: selectedSpeed === v ? "#B452B5" : "#F5F5F5", 
                      color: selectedSpeed === v ? "#fff" : "#333", 
                      cursor: "pointer" 
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
                style={{ flex: 1, padding: "12px", borderRadius: "14px", border: "2px solid #929292", background: "#F5F5F5", fontSize: "14px", fontWeight: "800", color: "#333", outline: "none" }}
              >
                <option value="전체">모든 방식 보기</option>
                {["DC콤보", "DC차데모", "AC3상", "B타입(5핀)", "C타입(5핀)"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <button onClick={fetchNearbyStations} style={{ marginTop: "10px", width: "100%", padding: "16px", background: "#B452B5", color: "#fff", border: "none", borderRadius: "14px", fontWeight: "900", fontSize: "15px", cursor: "pointer", boxShadow: "0 6px 15px rgba(180, 82, 181, 0.4)" }}>내 주변 5km 충전소 찾기</button>
          </section>
        )}

      
        <section style={{ 
  background: "linear-gradient(135deg, #FAF8FF 0%, #B4A0D9 100%)", 
  padding: "30px 20px 40px 20px", 
  borderRadius: "24px", 
  boxShadow: "0 8px 20px rgba(122, 93, 232, 0.05)", 
  border: "1px solid #D9CBFF" 
}}>
  {/* [타이틀 및 시간 영역] */}
  {/* 글자컬러 백업:#4a3b8a */}
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px", padding: "0 5px" }}>
    <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "#4a3b8a", letterSpacing: "-0.5px" }}>실시간 충전기 정보</h4>
    <span style={{ fontSize: "11px", color: "#9a8dbf", fontWeight: "600" }}>조회 기준 | {currentTime}</span>
  </div>

  {/* [통합 데이터 그리드] */}
  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" ,  
                boxShadow: "0 8px 20px rgba(122, 93, 232, 0.05)",    }}>
    {[
      { label: "운영 중", value: stats.total, color: "#6e56cf", icon: InChargeIcon, bgColor: "#EADDFF" },
      { label: "사용 중", value: stats.inUse, color: "#6e56cf", icon: InUseIcon, bgColor: "#EADDFF" },
      { label: "예약 가능", value: stats.available, color: "#6e56cf", icon: LiveInformationIcon, bgColor: "#EADDFF" },
      { label: "점검 중", value: stats.maintenance, color: "#6e56cf", icon: FixIcon, bgColor: "#EADDFF" }
    ].map((item, idx) => (
      <div key={idx} style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* 1. 아이콘 */}
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "12px", 
          boxSizing: "border-box",
          overflow: "hidden"
        }}>
          <img src={item.icon} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* 2. 숫자 */}
        <div style={{ 
          fontSize: "22px", 
          fontWeight: "900", 
          color: item.color, 
          letterSpacing: "-0.8px", 
          lineHeight: 1,
          marginBottom: "6px" 
        }}>
          {item.value.toLocaleString()}
        </div>

        {/* 3. 라벨 */}
        <div style={{ 
          fontSize: "12px", 
          fontWeight: "700", 
          color: "#888" 
        }}>
          {item.label}
        </div>
      </div>
    ))}
  </div>
</section>

        {/* 메뉴 리스트 */}
        <section style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {[
            { 
              title: "실시간 정보", 
              desc: "충전소의 실시간 운영 상태와 사용 가능 여부를 확인할 수 있습니다.", 
              icon: LiveInformationIcon, 
              bgColor: "#EADDFF" 
            },
            { 
              title: "간편 예약", 
              desc: "원하는 시간과 장소를 선택하여 쉽게 예약할 수 있습니다.", 
              icon: Simple_ReservationIcon, 
              bgColor: "#EADDFF" 
            },
            { 
              title: "예약 관리", 
              desc: "예약 내역 및 결제 내역을 편리하게 관리할 수 있습니다.", 
              icon: ReservationIcon, 
              bgColor: "#EADDFF" 
            }
          ].map((menu, idx) => (
            <div key={idx} style={{
              display: "flex",
              alignItems: "center",
              padding: "24px",
              background: "linear-gradient(135deg, #FAF8FF 0%, #B4A0D9 100%)",
              borderRadius: "28px",
              boxShadow: "0 8px 20px rgba(122, 93, 232, 0.05)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "1px solid rgba(0,0,0,0.03)"
            }}>
              <div style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "20px",
                flexShrink: 0,
                overflow: "hidden" 
              }}>
                <img 
                  src={menu.icon} 
                  alt={menu.title} 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover", 
                    display: "block"
                  }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "17px", fontWeight: "900", color: "#333" }}>{menu.title}</h4>
                <p style={{ margin: 0, fontSize: "12.5px", color: "#888", lineHeight: "1.4", fontWeight: "500" }}>{menu.desc}</p>
              </div>
              <div style={{ color: "#ccc", marginLeft: "10px" }}>
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          ))}
        </section>
      </aside>

      {/* 검색 결과 패널 */}
      {isFilterOpen && (
        <div style={{ position: "absolute", left: "465px", top: "15px", bottom: "15px", width: "400px", backgroundColor: "#F9F9F9", backdropFilter: "blur(10px)", zIndex: 20, boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.1)", display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #eaddff" }}>
          <div style={{ padding: "20px", background: "#f8f9ff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "#4a3b8a" }}>검색 결과 {filteredGroups.length}곳</h3>
            <button onClick={() => setIsFilterOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#B452B5" }}><i className="fa-solid fa-xmark" style={{ fontSize: "20px" }}></i></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px" }}>
            {filteredGroups.map((group: any) => (
              <div key={`${group.stationName}_${group.address}`} onClick={() => handleLocationClick(group.lat, group.lng)} style={{ padding: "18px 0", borderBottom: "1px solid #f4f5fa", cursor: "pointer" }}>
                <strong style={{ fontSize: "15px", color: "#333" }}>{group.stationName}</strong>
                <div style={{ fontSize: "12px", color: "#777", marginTop: "4px" }}>{group.address}</div>
                <div style={{ fontSize: "12px", color: "#7a5de8", fontWeight: "bold", marginTop: "8px" }}>총 충전기: {group.chargers.length}대</div>
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <button onClick={(e) => { e.stopPropagation(); alert(`${group.stationName} 예약`); }} style={{ flex: 1, padding: "10px 0", borderRadius: "10px", border: "none", background: "#B452B5", color: "#fff", fontSize: "12px", fontWeight: "900" }}>예약하기</button>
                  <button onClick={(e) => { e.stopPropagation(); window.open(`https://map.kakao.com/link/to/${encodeURIComponent(group.stationName)},${group.lat},${group.lng}`, "_blank"); }} style={{ flex: 1, padding: "10px 0", borderRadius: "10px", border: "1px solid #dcd3ff", background: "#929292", color: "#fff", fontSize: "12px", fontWeight: "900" }}>길찾기</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 우측 지도 */}
      <main style={{ flex: 1, position: "relative", height: "100%", margin: "0px 20px 0px 0px", padding: "15px", boxSizing: "border-box", background: "#E8E6F2" }}>
        <div id="map" style={{ width: "100%", height: "100%", overflow: "hidden", boxShadow: "10px 10px 25px rgba(0, 0, 0, 0.03)", border: "1px solid #eaddff" }} />
      </main>
    </div>
  );
};

export default StationList;