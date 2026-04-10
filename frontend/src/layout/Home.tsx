import StationList from '../pages/StationList'; // 1. 지도 컴포넌트 임포트
import carVideo from '../image/carvideo.mp4'; 
import { useEffect, useState } from 'react';
import StationService from '../services/StationService';
import type { IStation } from '../types/IStation';

import { getStatusLabel, getTypeLabel, getMethodLabel } from "../common/stationConverter";

const Home = () => {
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

    stations.forEach((station: {
      [x: string]: any;
      status: string;
      distance: any; lat: any; lng: any; stationName: any; 
}) => {
      if (!station.lat || !station.lng) return;

      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(station.lat, station.lng),
        map: map
      });
const content = `
  <div style="
    padding: 20px; 
    background: #ffffff; 
    border-radius: 16px; 
    box-shadow: 0 8px 24px rgba(0,0,0,0.15); 
    border: 1px solid #e1e4e8; 
    min-width: 300px; /* 폭을 조금 더 넓게 확보 */
    max-width: 350px;
    font-family: 'Noto Sans KR', sans-serif;
    color: #1a1a1a;
  ">
    
    <div style="margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <strong style="font-size: 19px; color: #000; letter-spacing: -0.5px;">
          ${station.stationName}
        </strong>
        <span style="
          background: ${station.status === '1' ? '#34c759' : '#555'}; 
          color: #ffffff !important; 
          padding: 4px 10px; 
          border-radius: 6px; 
          font-size: 11px; 
          font-weight: 800;
          white-space: nowrap;
        ">
          ${getStatusLabel(station.status)}
        </span>
      </div>
      <div style="font-size: 13px; color: #007bff; font-weight: 600;">
        ${station.distance ? station.distance.toFixed(2) + 'km' : '거리 계산 중'}
      </div>
    </div>

    <div style="margin-bottom: 15px; font-size: 14px; color: #444; line-height: 1.5; display: flex; align-items: flex-start;">
      <span style="margin-right: 6px;">📍</span>
      <span>${station.address}</span>
    </div>

    <div style="
      padding: 15px; 
      background: #f8f9fa; 
      border-radius: 10px; 
      font-size: 13px;
      border: 1px solid #eee;
    ">
      <div style="margin-bottom: 8px; display: flex; align-items: center;">
        <strong style="width: 70px; color: #000;">⚡ 타입</strong>
        <span style="color: #555;">${getTypeLabel(station.chargerType)}</span>
      </div>
      <div style="margin-bottom: 8px; display: flex; align-items: center;">
        <strong style="width: 70px; color: #000;">🔌 방식</strong>
        <span style="color: #555;">${getMethodLabel(station.chargerMethod)}</span>
      </div>
      <div style="display: flex; align-items: center;">
        <strong style="width: 70px; color: #000;">🚀 충전량</strong>
        <span style="font-weight: 700; color: #007bff;">${station.fastChargeAmount || '기본'}</span>
      </div>
    </div>
    
    <button 
      onclick="location.href='/detail/${station.stationId}'" 
      style="
        width: 100%;
        margin-top: 15px;
        background: #0b0d1a;
        color: #fff;
        border: none;
        padding: 14px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        font-size: 15px;
      "
    >
      상세 정보 보기
    </button>
  </div>
`;
      const infowindow = new kakao.maps.InfoWindow({
        content: content,
        removable: true
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });
    });
  }, [map, stations]);

  return (
    <div className="home-container">
      {/* 2. 상단: 동영상 섹션 */}
      <section className="hero">
        <div className="video-background">
          <video autoPlay muted loop playsInline>
            <source src={carVideo} type="video/mp4" />
          </video>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">친환경 이동을 더 똑똑하게</h1>
          <p className="hero-sub">Save time, Reserve your charge</p>
        </div>
      </section>
      {/* 3. 하단: 지도 섹션 (동영상 아래로 배치) */}
      <section className="map-section" style={{ padding: "50px 0" }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}></h2>
        <StationList />
      </section>
    </div>
  );
};

export default Home;