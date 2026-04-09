import { useState, useEffect } from "react";
import StationService from "../services/StationService"; 
import type { IStation } from "../types/IStation";

const StationList = () => {
  const [map, setMap] = useState<any>(null);
  const [stations, setStations] = useState<IStation[]>([]);

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
          // 데이터 구조에 따른 안전한 배열 추출
          const data = response.data.result || response.data.content || response.data;
          if (Array.isArray(data)) {
            setStations(data);
          }
        })
        .catch((e: Error) => console.error("❌ 로드 실패:", e));
    };

    if (map) fetchStations();
  }, [map]);

  // 3. 데이터 로드 시 마커 생성
  useEffect(() => {
    const { kakao } = window as any;
    if (!map || !kakao || stations.length === 0) return;

    stations.forEach((station) => {
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
    });
  }, [map, stations]);

  return (
    <div className="map-wrapper" style={{ width: "100%", height: "600px", padding: "20px", boxSizing: "border-box" }}>
      {/* 지도 영역 */}
      <div 
        id="map" 
        style={{ 
          width: "100%", 
          height: "100%", 
          borderRadius: "10px", 
          border: '1px solid #ddd' 
        }} 
      />
    </div>
  );
};

export default StationList;