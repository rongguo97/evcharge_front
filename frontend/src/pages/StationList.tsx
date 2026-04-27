import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StationService from "../services/StationService";
import type { IStation } from "../types/IStation";
import {
  getStatusLabel,
  getTypeLabel,
  getMethodLabel,
  normalizeSido,
} from "../common/stationConverter";

//아이콘 이미지 import
import InUseIcon from "../image/in_use.png";
import FixIcon from "../image/fix.png";
import InChargeIcon from "../image/in_charge.png";
import LiveInformationIcon from "../image/live_information.png";
import ReservationIcon from "../image/reservation.png";
import Simple_ReservationIcon from "../image/simple_reservation.png";
import { statusColorMap } from "../common/statusColorMap";

const StationList = () => {
  // 네비게이트 함수 초기화
  const navigate = useNavigate();
    // 상태 관리 (State) 
  const [map, setMap] = useState<any>(null); // 카카오 맵 객체
  const [stations, setStations] = useState<IStation[]>([]); // 서버에서 가져온 원본 충전소 데이터
  const [searchTerm, setSearchTerm] = useState(""); // 검색창 입력값
  const [selectedSpeed, setSelectedSpeed] = useState("전체"); // 급속/완속 필터 상태
  const [selectedStatus, setSelectedStatus] = useState("전체"); // 충전가능/중 필터 상태
  const [selectedMethod, setSelectedMethod] = useState("전체"); // 충전 방식 필터 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false); // 필터 패널 및 리스트 표시 여부
  const [selectedSido, setSelectedSido] = useState("전체"); // 시/도 필터
  const [selectedGungu, setSelectedGungu] = useState("전체"); // 군/구 필터
  const [activeTab, setActiveTab] = useState<"전체" | "즐겨찾기">("전체"); // 리스트 탭 전환

    // 내 위치 및 5km 반경 필터링용 상태 
  const [myCoords, setMyCoords] = useState<{ lat: number; lng: number } | null>(null); // 사용자 위경도
  const [isRadiusFilterActive, setIsRadiusFilterActive] = useState(false); // 5km 필터 토글 활성화 여부

  // 로컬 스토리지에서 즐겨찾기 목록 불러오기
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("ev_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const markersRef = useRef<any[]>([]); // 지도에 표시된 마커 관리용 Ref
  const wholeContainerRef = useRef<HTMLDivElement>(null); // 외부 클릭 감지용 컨테이너 Ref
  const markerObjectsRef = useRef<{ [key: string]: { marker: any; infowindow: any } }>({}); // 마커 객체 접근용
  const lastInfowindowRef = useRef<any>(null); // 마지막으로 열린 인포윈도우 관리

  //  내 위치 마커 전용 Ref(바뀐 값에 대한 보관함) 
  const myLocationMarkerRef = useRef<any>(null);

  // 즐겨찾기 변경 시 로컬 스토리지 업데이트
  useEffect(() => {
    localStorage.setItem("ev_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // TODO: 주소 데이터를 활용한 지역 리스트 추출 (useMemo)
  // 전체 데이터에서 시/도 목록 추출
  const sidoList = useMemo(() => {
    const set = new Set(stations.map((s) => normalizeSido(s.address)));
    return ["전체", ...Array.from(set).sort()];
  }, [stations]);

  // 선택된 시/도에 따른 군/구 목록 필터링
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
  
  // TODO: 두 좌표 간의 직선 거리(km) 계산 함수
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 지구 반지름
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  // 서버 API 호출: 모든 충전소 데이터 가져오기
  const fetchAllStations = (keyword: string = "") => {
    const searchParams = { searchKeyword: keyword, status: "", chargerType: "", chargerMethod: "", page: 0, size: 100000 };
    StationService.getAll(searchParams)
      .then((res: any) => {
        const data = res.data.result || res.data.content || res.data;
        if (Array.isArray(data)) setStations(data);
      })
      .catch((err) => console.error("데이터 로드 에러:", err));
  };

  // TODO: 외부 영역 클릭 시 검색 및 모든 필터 초기화 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wholeContainerRef.current && !wholeContainerRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
        setSearchTerm("");
        setSelectedSpeed("전체");
        setSelectedStatus("전체");
        setSelectedMethod("전체");
        setSelectedSido("전체");
        setSelectedGungu("전체");
        setIsRadiusFilterActive(false); // 5km 필터 끄기

        if (lastInfowindowRef.current) {
          lastInfowindowRef.current.close();
          lastInfowindowRef.current = null;
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 즐겨찾기 추가/삭제 토글
  const toggleFavorite = (groupKey: string) => {
    setFavorites(prev => 
      prev.includes(groupKey) ? prev.filter(k => k !== groupKey) : [...prev, groupKey]
    );
  };

  // TODO: 내 주변 5km 버튼 클릭 시 위치 갱신 및 반경 필터 토글 
  const fetchNearbyStations = () => {
    if (isRadiusFilterActive) {
      setIsRadiusFilterActive(false); // 이미 켜져있으면 끄기
      return;
    }

    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMyCoords({ lat: latitude, lng: longitude }); 

        if (map) {
          const moveLatLng = new (window as any).kakao.maps.LatLng(latitude, longitude);
          map.panTo(moveLatLng); // 위치 이동
          updateMyLocationMarker(latitude, longitude); // 마커 갱신
        }

        setIsRadiusFilterActive(true); // 5km 필터 활성화
        setIsFilterOpen(true); 
      },
    );
  };

  // 내 위치 마커 업데이트
 const updateMyLocationMarker = (lat: number, lng: number) => {
  const { kakao } = window as any;
  if (!map || !kakao) return
  const locPosition = new kakao.maps.LatLng(lat, lng);
  // 기존 마커가 있으면 위치만 이동, 없으면 새로 생성
 if (myLocationMarkerRef.current) {
    myLocationMarkerRef.current.setPosition(locPosition);
  } else {
   const imageSize = new kakao.maps.Size(24, 35);
    const markerImage = new kakao.maps.MarkerImage(
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', 
      imageSize
    );

    const marker = new kakao.maps.Marker({
      position: locPosition,
      image: markerImage, 
      map: map,
      zIndex: 10
    });
    myLocationMarkerRef.current = marker;
  }
};

  // TODO: 지도초기화
  useEffect(() => {
    const initMap = () => {
      const { kakao } = window as any;
      kakao.maps.load(() => {
        const container = document.getElementById("map");
        if (!container) return;
        const initialMap = new kakao.maps.Map(container, { center: new kakao.maps.LatLng(37.5665, 126.978), level: 3 });
        setMap(initialMap);
        // 초기 렌더링 시 내 위치 마커 표시
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            setMyCoords({ lat: latitude, lng: longitude });
            const moveLatLng = new kakao.maps.LatLng(latitude, longitude);
            initialMap.setCenter(moveLatLng);
            const imageSize = new (window as any).kakao.maps.Size(24, 35);
    const markerImage = new (window as any).kakao.maps.MarkerImage(
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', 
      imageSize
    );

    const marker = new (window as any).kakao.maps.Marker({ 
      position: moveLatLng, 
      image: markerImage, 
      map: initialMap, 
      zIndex: 10 
    });
    myLocationMarkerRef.current = marker;
  });
}
      });
    };
    if ((window as any).kakao && (window as any).kakao.maps) initMap();
    else {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services&autoload=false`;
      script.onload = () => initMap();
      document.head.appendChild(script);
    }
  }, []);

  // [5] 서버 데이터 호출 
  useEffect(() => {
    if (!map) return;
    fetchAllStations(searchTerm); 
  }, [map, searchTerm]);

 // 클라이언트 사이드 그룹화 및 5km 실시간 필터링 로직 
  const getGroupedStations = () => {
    const groups: { [key: string]: any } = {};
    const filtered = stations.filter((s) => {
      if (!s.address) return false;
      
      // 검색 및 기본 필터(시도, 속도, 방식 등) 적용
      const matchesSearch = searchTerm.trim() === "" || s.stationName.toLowerCase().includes(searchTerm.toLowerCase()) || s.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSido = selectedSido === "전체" || normalizeSido(s.address) === selectedSido;
      const gunguName = s.address.split(" ")[1] || "";
      const matchesGungu = selectedGungu === "전체" || gunguName === selectedGungu;
      const matchesSpeed = selectedSpeed === "전체" || getTypeLabel(s.chargerType) === selectedSpeed;
      const matchesMethod = selectedMethod === "전체" || getMethodLabel(s.chargerMethod) === selectedMethod;
      const matchesStatus = selectedStatus === "전체" || getStatusLabel(s.status) === selectedStatus;
      
      //  5km 반경 필터 활성화 시 거리 계산 조건 추가
      let matchesRadius = true;
      if (isRadiusFilterActive && myCoords) {
        const dist = calculateDistance(myCoords.lat, myCoords.lng, s.lat, s.lng);
        matchesRadius = dist <= 5.0; // 5.0km 이내만 true
      }

      return matchesSearch && matchesSido && matchesGungu && matchesSpeed && matchesMethod && matchesStatus && matchesRadius;
    });

    // TODO: 중복 위치 충전소를 그룹화
    filtered.forEach((s) => {
      const groupKey = `${s.stationName}_${s.address}`;
      if (!groups[groupKey]) groups[groupKey] = { ...s, chargers: [], groupKey };
      groups[groupKey].chargers.push(s);
    });
    return Object.values(groups);
  };

  const allFilteredGroups = getGroupedStations();
  const favoriteGroups = allFilteredGroups.filter(g => favorites.includes(g.groupKey));
  const displayGroups = activeTab === "전체" ? allFilteredGroups : favoriteGroups;

  // [7] 지도 마커 및 인포윈도우 디자인 
  useEffect(() => {
    const { kakao } = window as any;
    if (!map || !kakao) return;
    markersRef.current.forEach(m => m.setMap(null)); // 기존 마커 모두 삭제
    markersRef.current = [];
    markerObjectsRef.current = {};
    
    // 현재 필터링된 그룹들 지도에 마커로 표시
    allFilteredGroups.forEach((group: any) => {
      const groupKey = group.groupKey;
      const marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(group.lat, group.lng), map });
      
      const chargerListHtml = group.chargers.map((ch: IStation) => {
        const statusText = getStatusLabel(ch.status);
        const statusColor = statusColorMap[statusText] || "#7a5de8";
        return `<div style="padding: 12px; background: #f8f9ff; border-radius: 12px; border: 1px solid #eaddff; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;"><strong style="color: #4a3b8a; font-size: 13px;">${ch.chargerName || "충전기"}</strong><span style="color: ${statusColor}; font-weight: 800; font-size: 11px; border: 1px solid ${statusColor}; padding: 2px 6px; border-radius: 6px; background: #fff;">${statusText}</span></div>
            <div style="color: #666; font-size: 11px; margin-top: 5px;">${getTypeLabel(ch.chargerType)} | ${getMethodLabel(ch.chargerMethod)}</div>
          </div>`;
      }).join("");

      const content = `<div style="padding: 24px; background: #fff; min-width: 300px; box-shadow: 0 12px 30px rgba(122, 93, 232, 0.15); border: none; position: relative;"><div style="margin-bottom: 16px;"><strong style="font-size: 19px; color: #4a3b8a; display: block; margin-bottom: 6px; letter-spacing: -0.5px;">${group.stationName}</strong><div style="font-size: 13px; color: #888; line-height: 1.4;">${group.address}</div></div><div style="max-height: 220px; overflow-y: auto; padding-right: 4px;">${chargerListHtml}</div></div>`;
      const infowindow = new kakao.maps.InfoWindow({ content, removable: true, zIndex: 3 });
      
      kakao.maps.event.addListener(marker, "click", () => {
        if (lastInfowindowRef.current) lastInfowindowRef.current.close();
        infowindow.open(map, marker);
        lastInfowindowRef.current = infowindow;
      });
      markersRef.current.push(marker);
      markerObjectsRef.current[groupKey] = { marker, infowindow };
    });
  }, [map, allFilteredGroups]); // 필터링된 결과가 바뀔 때마다 마커 새로 그림

  // 리스트 카드 클릭 시 지도를 해당 위치로 이동
  const handleLocationClick = (group: any) => {
    const { kakao } = window as any;
    if (map && kakao) {
      map.panTo(new kakao.maps.LatLng(group.lat, group.lng));
      const target = markerObjectsRef.current[group.groupKey];
      if (target) {
        if (lastInfowindowRef.current) lastInfowindowRef.current.close();
        target.infowindow.open(map, target.marker);
        lastInfowindowRef.current = target.infowindow;
      }
    }
  };

  // 리스트의 충전소 카드 렌더링 함수
  const renderStationCard = (group: any) => {
    const isFav = favorites.includes(group.groupKey);
    //  현재 내 위치와의 실시간 거리 표시용 계산
    const distance = myCoords ? calculateDistance(myCoords.lat, myCoords.lng, group.lat, group.lng) : null;

    return (
      <div key={group.groupKey} onClick={() => handleLocationClick(group)} style={{ background: "#fff", margin: "0 0 15px 0", padding: "20px", borderRadius: "15px", border: "1px solid #ddd", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", cursor: "pointer", transition: "all 0.2s ease", position: "relative" }}>
        {/* 즐겨찾기 버튼 */}
        <div onClick={(e) => { e.stopPropagation(); toggleFavorite(group.groupKey); }} style={{ position: "absolute", top: "20px", right: "20px", width: "24px", height: "24px", backgroundColor: isFav ? "#B452B5" : "#B4A0D9", clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)", transition: "all 0.2s ease", zIndex: 5 }} />
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "10px", padding: "3px 8px", background: "#F5E6FF", color: "#B452B5", borderRadius: "10px", fontWeight: "800" }}>충전소</span>
          {/* 📍 거리 상시 표시 */}
          {distance !== null && <span style={{ fontSize: "12px", color: "#B452B5", fontWeight: "bold" }}>{distance}km</span>}
        </div>
        <strong style={{ fontSize: "16px", color: "#333", display: "block", paddingRight: "30px" }}>{group.stationName}</strong>
        <div style={{ fontSize: "12px", color: "#777", marginTop: "6px", lineHeight: "1.4", paddingRight: "30px" }}>{group.address}</div>
        <div style={{ fontSize: "12px", color: "#7a5de8", fontWeight: "bold", marginTop: "10px", display: "flex", alignItems: "center", gap: "4px" }}><i className="fa-solid fa-plug" style={{ fontSize: "10px" }}></i>총 충전기: {group.chargers.length}대</div>
        <div style={{ display: "flex", gap: "8px", marginTop: "15px" }}>
          <button onClick={(e) => { e.stopPropagation(); navigate("/main/reservation", { state: { preSelectedStation: group } }); }} style={{ flex: 1, padding: "10px 0", borderRadius: "8px", border: "none", background: "#B452B5", color: "#fff", fontSize: "13px", fontWeight: "900", cursor: "pointer" }}> 예약하기</button>
          <button onClick={(e) => { e.stopPropagation(); window.open(`https://map.kakao.com/link/to/${encodeURIComponent(group.stationName)},${group.lat},${group.lng}`, "_blank"); }} style={{ flex: 1, padding: "10px 0", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", color: "#555", fontSize: "13px", fontWeight: "900", cursor: "pointer" }}>길찾기</button>
        </div>
      </div>
    );
  };

  // 실시간 운영 통계 현황 데이터
  const stats = useMemo(() => ({
    total: stations.length,
    inUse: stations.filter(s => getStatusLabel(s.status) === "충전중").length,
    available: stations.filter(s => getStatusLabel(s.status) === "충전가능").length,
    maintenance: stations.filter(s => ["고장/점검", "통신장애", "계획정지"].includes(getStatusLabel(s.status))).length
  }), [stations]);

  // 현재 시간 조회
  const currentTime = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date());

  // 렌더링 시작(실제로 화면에 그리기)
  return (
    <div ref={wholeContainerRef} style={{ display: "flex", width: "100%", height: "100%", position: "relative", boxSizing: "border-box", background: "#f4f5fa" }}>
      {/* 사이드바 메뉴  */}
      <aside style={{ width: "450px", height: "100%", display: "flex",
                      flexDirection: "column", gap: "20px", zIndex: 10, 
                      padding: "25px", boxSizing: "border-box", 
                      background: "linear-gradient(145deg, #ffffff, #f0f1f8)",
                      position: "relative", marginTop:"-23px" }}>
        {/* 검색바 섹션 */}
        <section style={{ background: "transparent", padding: "0 0 5px 0", zIndex: 30,}}>
          <div style={{ position: "relative", width: "100%",}}>
            <input type="text" placeholder="충전소, 주소를 검색하세요" value={searchTerm} onFocus={() => setIsFilterOpen(true)} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "100%", padding: "16px 50px 16px 20px", borderRadius: "14px", border: "2px solid #929292", background: "#F5F5F5", fontSize: "16px", fontWeight: "700", outline: "none", color: "#333", boxSizing: "border-box" }} />
            <svg style={{ position: "absolute",right: "20px", top: "50%",transform: "translateY(-50%)",width: "22px",height: "22px",color: "#000" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </section>

        {/* 필터 설정 섹션 */}
        {isFilterOpen && (
          <section style={{ position: "absolute", top: "95px", left: "20px", right: "20px", background: "#fff", padding: "25px", borderRadius: "24px", boxShadow: "0 15px 35px rgba(122, 93, 232, 0.2)", border: "1px solid rgba(122, 93, 232, 0.2)", zIndex: 40 }}>
            {/* 지역 선택 셀렉트 박스들 */}
            {[ { label: "시/도", value: selectedSido, options: sidoList, onChange: (v: any) => { setSelectedSido(v); setSelectedGungu("전체"); } }, { label: "군/구", value: selectedGungu, options: gunguList, onChange: (v: any) => setSelectedGungu(v), disabled: selectedSido === "전체" } ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#4a3b8a", width: "60px", margin: 0 }}>{f.label}</h4>
                <select value={f.value} onChange={(e) => f.onChange(e.target.value)} disabled={f.disabled} style={{ flex: 1, padding: "12px", borderRadius: "14px", border: "2px solid #929292", background: f.disabled ? "rgba(255, 255, 255, 0.5)" : "#F5F5F5", fontSize: "14px", fontWeight: "800", color: "#333", outline: "none" }}>{f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select>
              </div>
            ))}
            {/* 충전 상황 필터 */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#4a3b8a", width: "60px", margin: 0 }}>상황</h4>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ flex: 1, padding: "12px", borderRadius: "14px", border: "2px solid #929292", background: "#F5F5F5", fontSize: "14px", fontWeight: "800", color: "#333", outline: "none" }}><option value="전체">전체 상태보기</option>{["충전가능", "충전중", "고장/점검"].map(s => <option key={s} value={s}>{s}</option>)}</select>
            </div>
            {/* 충전 속도 필터 */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#4a3b8a", width: "60px", margin: 0 }}>속도</h4>
              <div style={{ display: "flex", gap: "8px", flex: 1 }}>{["전체", "급속", "완속"].map(v => ( <button key={v} onClick={() => setSelectedSpeed(v)} style={{ flex: 1, padding: "12px", border: selectedSpeed === v ? "1px solid #B452B5" : "2px solid #929292", borderRadius: "14px", fontSize: "13px", fontWeight: "900", background: selectedSpeed === v ? "#B452B5" : "#F5F5F5", color: selectedSpeed === v ? "#fff" : "#333", cursor: "pointer" }}>{v}</button> ))}</div>
            </div>
            {/* 충전 방식 필터 */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#4a3b8a", width: "60px", margin: 0 }}>방식</h4>
              <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} style={{ flex: 1, padding: "12px", borderRadius: "14px", border: "2px solid #929292", background: "#F5F5F5", fontSize: "14px", fontWeight: "800", color: "#333", outline: "none" }}><option value="전체">모든 방식 보기</option>{["DC콤보", "DC차데모", "AC3상", "B타입(5핀)", "C타입(5핀)"].map(m => <option key={m} value={m}>{m}</option>)}</select>
            </div>
            {/* 5km 반경 필터 토글 버튼 */}
            <button 
              onClick={fetchNearbyStations} 
              style={{ 
                marginTop: "10px", width: "100%", padding: "16px", 
                background: isRadiusFilterActive ? "#7a5de8" : "#B452B5", 
                color: "#fff", border: "none", borderRadius: "14px", 
                fontWeight: "900", fontSize: "15px", cursor: "pointer", 
                boxShadow: "0 6px 15px rgba(180, 82, 181, 0.4)" 
              }}>
              {isRadiusFilterActive ? "전체 목록 표시" : "내 주변 5km 충전소 찾기"}
            </button>
          </section>
        )}

        {/* 상단 통계 현황판 */}
        <section style={{ background: "linear-gradient(135deg, #FAF8FF 0%, #B4A0D9 100%)", padding: "30px 20px 40px 20px", borderRadius: "24px", boxShadow: "0 8px 20px rgba(122, 93, 232, 0.05)", border: "1px solid #D9CBFF" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px", padding: "0 5px" }}>
            <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "#4a3b8a", letterSpacing: "-0.5px" }}>실시간 충전기 정보</h4>
            <span style={{ fontSize: "11px", color: "#9a8dbf", fontWeight: "600" }}>조회 기준 | {currentTime}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {[ { label: "운영 중", value: stats.total, color: "#6e56cf", icon: InChargeIcon }, { label: "사용 중", value: stats.inUse, color: "#6e56cf", icon: InUseIcon }, { label: "예약 가능", value: stats.available, color: "#6e56cf", icon: LiveInformationIcon }, { label: "점검 중", value: stats.maintenance, color: "#6e56cf", icon: FixIcon } ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", boxSizing: "border-box", overflow: "hidden" }}><img src={item.icon} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                <div style={{ fontSize: "22px", fontWeight: "900", color: item.color, letterSpacing: "-0.8px", lineHeight: 1, marginBottom: "6px" }}>{item.value.toLocaleString()}</div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#888" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 퀵 메뉴 섹션 */}
        <section style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {[ { title: "실시간 정보", desc: "충전소의 실시간 운영 상태와 사용 가능 여부를 확인할 수 있습니다.", icon: LiveInformationIcon }, { title: "간편 예약", desc: "원하는 시간과 장소를 선택하여 쉽게 예약할 수 있습니다.", icon: Simple_ReservationIcon }, { title: "예약 관리", desc: "예약 내역 및 결제 내역을 편리하게 관리할 수 있습니다.", icon: ReservationIcon } ].map((menu, idx) => (
            <div key={idx} 
              // 📍 [수정] 모든 퀵 메뉴에 개별 라우팅 처리 추가
              onClick={() => {
                if (menu.title === "실시간 정보") {
                  navigate("/"); // 실시간 정보 홈 경로
                } else if (menu.title === "간편 예약") {
                  navigate("/main/reservation"); // 간편 예약 경로
                } else if (menu.title === "예약 관리") {
                  navigate("/main/my-reservations"); // 예약 관리 경로 (임의 주소)
                }
              }} style={{ display: "flex", alignItems: "center", padding: "24px", background: "linear-gradient(135deg, #FAF8FF 0%, #B4A0D9 100%)", borderRadius: "28px", boxShadow: "0 8px 20px rgba(122, 93, 232, 0.05)", cursor: "pointer", transition: "all 0.2s ease", border: "1px solid rgba(0,0,0,0.03)" }}>
              <div style={{ width: "70px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "20px", flexShrink: 0, overflow: "hidden" }}><img src={menu.icon} alt={menu.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "17px", fontWeight: "900", color: "#333" }}>{menu.title}</h4>
                <p style={{ margin: 0, fontSize: "12.5px", color: "#888", lineHeight: "1.4", fontWeight: "500" }}>{menu.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </aside>

      {/* 실시간 필터링 결과 리스트 패널 */}
      {isFilterOpen && (
        <div style={{ position: "absolute", left: "465px", top: "15px", bottom: "15px", width: "400px", backgroundColor: "#F9F9F9", backdropFilter: "blur(10px)", zIndex: 20, boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.1)", display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #eaddff", borderRadius: "20px" }}>
          <div style={{ padding: "20px", background: "#f8f9ff", borderBottom: "1px solid #eee" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "#4a3b8a" }}>
                {/* 5km 필터가 켜져 있으면 제목 변경 */}
                {isRadiusFilterActive ? "내 주변 5km 충전소 목록" : "충전소 목록"}
              </h3>
              <button onClick={() => setIsFilterOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#B452B5" }}><i className="fa-solid fa-xmark" style={{ fontSize: "20px" }}></i></button>
            </div>
            {/* 결과 탭 (전체/즐겨찾기) */}
            <div style={{ display: "flex", background: "#eee", borderRadius: "10px", padding: "4px" }}>
              <button onClick={() => setActiveTab("전체")} style={{ flex: 1, padding: "8px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "800", background: activeTab === "전체" ? "#fff" : "transparent", color: activeTab === "전체" ? "#B452B5" : "#888", boxShadow: activeTab === "전체" ? "0 2px 5px rgba(0,0,0,0.1)" : "none" }}>전체</button>
              <button onClick={() => setActiveTab("즐겨찾기")} style={{ flex: 1, padding: "8px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "800", background: activeTab === "즐겨찾기" ? "#fff" : "transparent", color: activeTab === "즐겨찾기" ? "#B452B5" : "#888", boxShadow: activeTab === "즐겨찾기" ? "0 2px 5px rgba(0,0,0,0.1)" : "none" }}>즐겨찾기</button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "15px" }}>
              {displayGroups.length > 0 ? (
                displayGroups.map(renderStationCard)
              ) : (
                <div style={{ textAlign: "center", color: "#ccc", padding: "50px 20px", fontSize: "14px" }}>{activeTab === "즐겨찾기" ? "즐겨찾기한 충전소가 없습니다." : "결과가 없습니다."}</div>
              )}
          </div>
        </div>
      )}

      {/* 오른쪽 메인 화면: 카카오 지도 영역 */}
      <main style={{ flex: 1, position: "relative", height: "91%", margin: "0px 20px 0px 0px", padding: "15px", boxSizing: "border-box", background: "#E8E6F2" }}>
        <div id="map" style={{ width: "100%", height: "100%", overflow: "hidden", boxShadow: "10px 10px 25px rgba(0, 0, 0, 0.03)",border: "1px solid #eaddff", borderRadius: "20px" }} />
      </main>
    </div>  
  );
};

export default StationList;