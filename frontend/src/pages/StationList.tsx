import { useState, useEffect, useRef } from "react";
import StationService from "../services/StationService"; 
import type { IStation } from "../types/IStation";

const StationList = () => {
  const [map, setMap] = useState<any>(null);
  const [stations, setStations] = useState<IStation[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const markersRef = useRef<any[]>([]); // 생성된 마커들을 저장하고 지우기 위한 참조

  // 1. 지도 초기화 (카카오맵 로드)
  useEffect(() => {
    const initMap = () => {
      const { kakao } = window as any;
      kakao.maps.load(() => {
        const container = document.getElementById('map');
        if (!container) return;

        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.9780),
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

  // 3. 검색 필터링 및 중복 제거 로직
const filteredStations = stations
  .filter((s) => s.stationName.toLowerCase().includes(searchTerm.toLowerCase()))
  .filter((station, index, self) =>
    // stationName과 address가 모두 같은 데이터가 뒤에 또 있다면 제외합니다.
    index === self.findIndex((t) => (
      t.stationName === station.stationName && t.address === station.address
    ))
  );

  // 4. 필터링된 데이터 로드 시 마커 생성
  useEffect(() => {
    const { kakao } = window as any;
    if (!map || !kakao) return;

    // [중요] 기존 마커들을 모두 지도에서 제거
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

      // 마커 배열에 추가 (다음에 지우기 위함)
      markersRef.current.push(marker);
    });
  }, [map, filteredStations]); // 검색어가 바뀌어서 리스트가 바뀔 때마다 실행

  // 5. 리스트 항목 클릭 시 이동 함수
  const handleLocationClick = (lat: number, lng: number) => {
    const { kakao } = window as any;
    if (map && kakao) {
      const moveLatLon = new kakao.maps.LatLng(lat, lng);
      map.panTo(moveLatLon); // 부드럽게 이동
    }
  };

  return (
    <div className="station-container" style={{ display: "flex", width: "100%", height: "650px", padding: "20px", boxSizing: "border-box" }}>
      
      {/* 검색창 사이드바 */}
      <aside style={{ width: "300px", display: "flex", flexDirection: "column", marginRight: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>🔎 충전소 검색</h3>
          <input 
            type="text"
            placeholder="충전소 이름을 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
          />
        </div>

        {/* 검색 결과 리스트 */}
        <div style={{ flex: 1, overflowY: "auto", border: "1px solid #eee", borderRadius: "5px" }}>
          {filteredStations.length > 0 ? (
            filteredStations.map((s) => (
              <div 
                key={s.stationId} 
                onClick={() => handleLocationClick(s.lat, s.lng)}
                style={{ padding: "12px", borderBottom: "1px solid #eee", cursor: "pointer", fontSize: "14px" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <strong>{s.stationName}</strong>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{s.address}</div>
              </div>
            ))
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>검색 결과가 없습니다.</div>
          )}
        </div>
      </aside>

      {/* 지도 영역 */}
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

export default StationList;