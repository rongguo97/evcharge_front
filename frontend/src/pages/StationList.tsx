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
      
const content = `
  <div style="
    padding: 16px; 
    background: #fff; 
    border-radius: 12px; 
    box-shadow: 0 4px 15px rgba(0,0,0,0.15); 
    border: 1px solid #e1e4e8; 
    min-width: 280px; 
    font-family: 'Noto Sans KR', sans-serif;
  ">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
      <div style="max-width: 70%;">
        <strong style="font-size: 17px; color: #1a1a1a; display: block; margin-bottom: 2px;">
          ${station.stationName}
        </strong>
        <span style="font-size: 12px; color: #007bff; font-weight: 600;">
          ${station.distance ? station.distance.toFixed(2) + 'km' : '거리 계산 중'}
        </span>
      </div>
      <span style="
        font-size: 11px; 
        background: ${station.status === '사용가능' ? '#34c759' : '#8e8e93'}; 
        color: #fff; 
        padding: 4px 10px; 
        border-radius: 20px; 
        font-weight: bold;
      ">
        ${station.status || '정보없음'}
      </span>
    </div>

    <div style="font-size: 13px; color: #444; line-height: 1.6;">
      <p style="margin: 6px 0; display: flex; align-items: flex-start;">
        <span style="margin-right: 8px;">📍</span> 
        <span style="flex: 1;">${station.address}</span>
      </p>
      
      <div style="margin-top: 10px; padding: 12px; background: #f8f9fa; border-radius: 8px; border: 1px solid #eee;">
        <p style="margin: 0; font-size: 12px; color: #555;">
          <strong>⚡ 충전기:</strong> ${station.chargerName} (ID: ${station.chargerId})
        </p>
        <p style="margin: 6px 0; font-size: 12px; color: #555;">
          <strong>🔌 타입/방식:</strong> ${station.chargerType} / ${station.chargerMethod || '기본'}
        </p>
        <p style="margin: 0; font-size: 12px; color: #666;">
          <strong>🚀 충전량:</strong> ${station.fastChargeAmount || '정보없음'}
        </p>
      </div>

      <p style="margin: 10px 0 0 0; font-size: 11px; color: #999; text-align: right;">
        업데이트: ${station.statUpdateDatetime || '-'}
      </p>
    </div>

    <button 
      onclick="window.location.href='/detail/${station.stationId}'"
      style="
        width: 100%; 
        margin-top: 14px; 
        background: #0b0d1a; 
        color: #fff; 
        border: none; 
        padding: 12px; 
        border-radius: 8px; 
        cursor: pointer; 
        font-weight: bold;
        font-size: 14px;
      "
    >
      상세 정보 보기
    </button>
  </div>
`;
      const infowindow = new kakao.maps.InfoWindow({
        content:  content,
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