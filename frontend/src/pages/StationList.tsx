  import { useState, useEffect, useRef } from "react";
  import StationService from "../services/StationService";
  import type { IStation } from "../types/IStation";
  import { regionData } from "../services/RegionService";
  import { getStatusLabel,getTypeLabel,getMethodLabel} from "../common/stationConverter";
  import{statusColorMap} from"../common/statusColorMap";

  const SPEED_MAP: { [key: string]: string } = {
    "01": "급속",
    "02": "완속",
    "1": "급속",
    "2": "완속",
    Fast: "급속",
    Slow: "완속",
  };

  const StationList = () => {
    const [map, setMap] = useState<any>(null);
    const [stations, setStations] = useState<IStation[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpeed, setSelectedSpeed] = useState("전체");
    const [selectedStatus, setSelectedStatus] = useState("전체");
    const [sido, setSido] = useState("");
    const [sigungu, setSigungu] = useState("");

    const markersRef = useRef<any[]>([]);

    // 1. 지도 초기화
    useEffect(() => {
      const initMap = () => {
        const { kakao } = window as any;
        kakao.maps.load(() => {
          const container = document.getElementById("map");
          if (!container) return;
          const options = {
            center: new kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
          };
          const kakaoMap = new kakao.maps.Map(container, options);
          setMap(kakaoMap);
        });
      };

      if ((window as any).kakao && (window as any).kakao.maps) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.id = "kakao-map-script";
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=54b7f47833ff0482e1109c4a46ff80a2&libraries=services&autoload=false`;
        script.async = true;
        document.head.appendChild(script);
        script.onload = () => initMap();
      }
    }, []);

    // 2. 데이터 가져오기
    useEffect(() => {
      const fetchStations = () => {
        StationService.getAll("", 0, 100)
          .then((response: any) => {
            const data = response.data.result || response.data.content || response.data;
            if (Array.isArray(data)) setStations(data);
          })
          .catch((e: Error) => console.error("❌ 로드 실패:", e));
      };
      if (map) fetchStations();
    }, [map]);

    // 3. 필터링된 데이터 기반으로 충전소 그룹화 (중요 로직)
    const getGroupedStations = () => {
      const filtered = stations.filter((s) => {
        const matchesSearch = s.stationName.toLowerCase().includes(searchTerm.toLowerCase());
        const currentStationSpeed = SPEED_MAP[s.chargerType as keyof typeof SPEED_MAP] || s.chargerType;
        const matchesSpeed = selectedSpeed === "전체" || currentStationSpeed === selectedSpeed;
        const matchesStatus = selectedStatus === "전체" || getStatusLabel(s.status) === selectedStatus;
        return matchesSearch && matchesSpeed && matchesStatus;
      });

      // stationId를 기준으로 충전기들을 그룹화
      const groups: { [key: string]: any } = {};
      filtered.forEach((s) => {
        if (!groups[s.stationId]) {
          groups[s.stationId] = { ...s, chargers: [] };
        }
        groups[s.stationId].chargers.push(s);
      });
      return Object.values(groups);
    };

    const filteredGroups = getGroupedStations();

    // 4. 마커 및 인포윈도우 생성
    useEffect(() => {
      const { kakao } = window as any;
      if (!map || !kakao) return;

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      filteredGroups.forEach((group) => {
        if (!group.lat || !group.lng) return;

        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(group.lat, group.lng),
          map: map,
        });

      // 인포윈도우 내부 충전기 리스트 HTML 생성
const chargerListHtml = group.chargers.map((ch: IStation) => {
  const statusText = getStatusLabel(ch.status);
  const statusColor = statusColorMap[statusText] || "#8e8e93";

  // 📍 여기서 return 뒤에 백틱(`)이 바로 와야 합니다.
  return `
    <div style="padding: 12px; background: #f8f9fa; border-radius: 10px; border: 1px solid #eee; margin-bottom: 8px; font-size: 13px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <strong style="color: #333;">${ch.chargerName || '충전기'}</strong>
        <span style="color: ${statusColor}; font-weight: bold; border: 1px solid ${statusColor}; padding: 2px 6px; border-radius: 4px; font-size: 11px;">
          ${statusText}
        </span>
      </div>
      <div style="color: #666; font-size: 12px; display: flex; gap: 8px;">
        <span>⚡ ${getTypeLabel(ch.chargerType)}</span>
        <span style="color: #ddd;">|</span>
        <span>🔌 ${getMethodLabel(ch.chargerMethod)}</span>
      </div>
    </div>
  `; 
}).join('');

        const content = `
          <div style="padding: 20px; background: #ffffff; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); border: 1px solid #e1e4e8; min-width: 300px; max-width: 350px; font-family: 'Noto Sans KR', sans-serif;">
            <div style="margin-bottom: 12px;">
              <strong style="font-size: 19px; color: #000; letter-spacing: -0.5px;">${group.stationName}</strong>
              <div style="font-size: 13px; color: #007bff; font-weight: 600; margin-top: 4px;">
                ${group.distance ? group.distance.toFixed(2) + 'km' : '위치 확인됨'}
              </div>
            </div>
            <div style="margin-bottom: 15px; font-size: 14px; color: #444; display: flex; align-items: flex-start;">
              <span style="margin-right: 6px;">📍</span><span>${group.address}</span>
              </div>
              <div style="max-height: 200px; overflow-y: auto; padding-right: 5px;">
                ${chargerListHtml}
            </div>
          </div>
        `;

        const infowindow = new kakao.maps.InfoWindow({
          content: content,
          removable: true,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          infowindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });
    }, [map, filteredGroups]);

    // 지도 이동 관련 함수들
    const handleLocationClick = (lat: number, lng: number) => {
      const { kakao } = window as any;
      if (map && kakao) map.panTo(new kakao.maps.LatLng(lat, lng));
    };

    const handleMyLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { kakao } = window as any;
          const locPosition = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
          map.panTo(locPosition);
          map.setLevel(3);
        });
      } else alert("GPS를 사용할 수 없습니다.");
    };

    const handleMoveToRegion = () => {
      if (!sido || !sigungu) return alert("지역을 모두 선택해주세요.");
      const cityList = regionData[sido as keyof typeof regionData];
      const target = (cityList as any[])?.find((item: any) => item.name === sigungu);
      if (target && map) {
        const { kakao } = window as any;
        map.panTo(new kakao.maps.LatLng(target.lat, target.lng));
        map.setLevel(5);
      }
    };

    return (
      <div className="station-container" style={{ display: "flex", width: "100%", height: "700px", padding: "20px", boxSizing: "border-box" }}>
        <aside style={{ width: "350px", display: "flex", flexDirection: "column", marginRight: "20px", gap: "15px", color: "#1a1a1a" }}>
          <section>
            <h3 style={labelStyle}>🔎 충전소 검색</h3>
            <input type="text" placeholder="충전소명을 입력하세요" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={inputStyle} />
          </section>

          <section style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <h3 style={labelStyle}>📍 지역 선택 이동</h3>
            <select value={sido} onChange={(e) => { setSido(e.target.value); setSigungu(""); }} style={{ ...selectStyle, marginBottom: "8px", color: "#000" }}>
              <option value="">시/도 선택</option>
              {Object.keys(regionData).map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
            <select value={sigungu} onChange={(e) => setSigungu(e.target.value)} disabled={!sido} style={{ ...selectStyle, marginBottom: "8px", color: "#000" }}>
              <option value="">시/군/구 선택</option>
              {sido && (regionData[sido as keyof typeof regionData] as any[]).map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
            </select>
            <div style={{ display: "flex", gap: "5px" }}>
              <button onClick={handleMoveToRegion} style={{ ...gpsBtnStyle, flex: 2 }}>지역 이동</button>
              <button onClick={handleMyLocation} style={{ ...gpsBtnStyle, flex: 1, backgroundColor: "#444" }}>GPS</button>
            </div>
          </section>

          <section>
            <h3 style={labelStyle}>⚡ 충전 속도</h3>
            <div style={{ display: "flex", gap: "5px" }}>
              {["전체", "급속", "완속"].map((type) => (
                <button key={type} onClick={() => setSelectedSpeed(type)} style={selectedSpeed === type ? activeBtn : inactiveBtn}>{type}</button>
              ))}
            </div>
          </section>

          <section>
            <h3 style={labelStyle}>⚙️ 충전기 상태</h3>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={selectStyle}>
              <option value="전체">전체 상태보기</option>
              {["충전가능", "충전중", "고장/점검", "통신장애", "통신미연결", "충전종료", "계획정지"].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </section>

          <div style={listAreaStyle}>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <div key={group.stationId} onClick={() => handleLocationClick(group.lat, group.lng)} style={cardStyle} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <strong style={{ fontSize: "14px" }}>{group.stationName}</strong>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{group.address}</div>
                  <div style={{ fontSize: "11px", color: "#007bff", marginTop: "6px" }}>
                    충전기 {group.chargers.length}대 보유
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>검색 결과가 없습니다.</div>
            )}
          </div>
        </aside>

        <div id="map" style={{ flex: 1, height: "100%", borderRadius: "10px", border: "1px solid #ddd" }} />
      </div>
    );
  };

  // 스타일 설정
  const labelStyle = { fontSize: "15px", marginBottom: "8px", fontWeight: "bold" as "bold" };
  const inputStyle = { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box" as "border-box" };
  const selectStyle = { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", cursor: "pointer" };
  const listAreaStyle = { flex: 1, overflowY: "auto" as "auto", border: "1px solid #eee", borderRadius: "8px", background: "#fff" };
  const cardStyle = { padding: "15px", borderBottom: "1px solid #f0f0f0", cursor: "pointer" };
  const btnStyle = { flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "5px", cursor: "pointer", fontSize: "13px" };
  const activeBtn = { ...btnStyle, background: "#fee500", border: "1px solid #fee500", fontWeight: "bold" as "bold" };
  const inactiveBtn = { ...btnStyle, background: "#fff" };
  const gpsBtnStyle = { width: "100%", padding: "10px", backgroundColor: "#333", color: "#fee500", border: "1px solid #444", borderRadius: "5px", fontWeight: "bold" as "bold", cursor: "pointer", fontSize: "13px" };


  export default StationList;