import { useState, useEffect, useRef } from "react";
import StationService from "../services/StationService";
import type { IStation } from "../types/IStation";
import {
  getStatusLabel,
  getTypeLabel,
  getMethodLabel,
} from "../common/stationConverter";



// 1. SQL charger_type 컬럼 값과 UI 명칭 매핑 테이블 (컴포넌트 외부 선언)
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

  // 필터 상태 관리
  const [searchTerm, setSearchTerm] = useState(""); // 이름 검색
  const [] = useState(""); // 지역 검색어 상태
  const [selectedSpeed, setSelectedSpeed] = useState("전체"); // 급속/완속 필터
  const [selectedStatus, setSelectedStatus] = useState("전체"); // 충전기 상태 필터

  const markersRef = useRef<any[]>([]); // 마커 관리용 Ref (중복 방지)

  // 1. 지도 초기화 및 초기 현재 위치 설정
  useEffect(() => {
    const initMap = () => {
      const { kakao } = window as any;
      kakao.maps.load(() => {
        const container = document.getElementById("map");
        if (!container) return;

        // 기본 중심 설정 (GPS 로드 전이나 실패 시 보여줄 서울 중심 좌표)
        const defaultOptions = {
          center: new kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        };

        const kakaoMap = new kakao.maps.Map(container, defaultOptions);
        setMap(kakaoMap);

        // ✨ 지도가 로드되자마자 현재 위치로 이동 시도
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const locPosition = new kakao.maps.LatLng(lat, lng);

              // 지도가 생성된 직후이므로 kakaoMap 객체에 바로 적용
              kakaoMap.setCenter(locPosition);
              kakaoMap.setLevel(3);
              console.log("📍 현재 위치로 초기 중심점 설정 완료");
            },
            (error) => {
              console.warn(
                "⚠️ 현재 위치를 가져올 수 없어 기본 위치를 사용합니다.",
                error,
              );
            },
          );
        }
      });
    };

    // 카카오맵 스크립트 로드 체크
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
  // 2. 백엔드 데이터 가져오기
  useEffect(() => {
    const fetchStations = () => {
      StationService.getAll("", 0, 100)
        .then((response: any) => {
          const data =
            response.data.result || response.data.content || response.data;
          if (Array.isArray(data)) {
            setStations(data);
          }
        })
        .catch((e: Error) => console.error("❌ 로드 실패:", e));
    };

    if (map) fetchStations();
  }, [map]);

  // 3. 통합 필터링 로직 (검색 + 속도 + 상태 + 중복제거)
  const filteredStations = stations
    .filter((s) => {
      // A) 이름/주소 검색 필터
      const matchesSearch = s.stationName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // B) 속도 필터 (SQL charger_type 매핑 적용)
      const currentStationSpeed =
        SPEED_MAP[s.chargerType as keyof typeof SPEED_MAP] || s.chargerType;
      const matchesSpeed =
        selectedSpeed === "전체" || currentStationSpeed === selectedSpeed;

      // C) 상태 필터
      const matchesStatus =
        selectedStatus === "전체" || s.status === selectedStatus;

      return matchesSearch && matchesSpeed && matchesStatus;
    })
    .filter(
      (station, index, self) =>
        // D) 중복 제거 (이름과 주소가 동일한 경우)
        index ===
        self.findIndex(
          (t) =>
            t.stationName === station.stationName &&
            t.address === station.address,
        ),
    );

  // 4. 필터링된 데이터 기반 마커 생성 (수정된 인포윈도우 코드)
  useEffect(() => {
    const { kakao } = window as any;
    if (!map || !kakao) return;

    // 기존 마커 제거 (지도 청소)
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    filteredStations.forEach((station) => {
      if (!station.lat || !station.lng) return;

      // 마커 객체 생성
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(station.lat, station.lng),
        map: map,
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
          background: ${station.status === "1" ? "#34c759" : "#555"}; 
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
        ${station.distance ? station.distance.toFixed(2) + "km" : "거리 계산 중"}
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
      // 인포윈도우 객체 생성
      const infowindow = new kakao.maps.InfoWindow({
        content: content, // 수정된 콘텐츠 적용
        removable: true,
      });

      // 마커 클릭 이벤트 등록
      kakao.maps.event.addListener(marker, "click", () => {
        infowindow.open(map, marker);
      });

      // 마커 관리용 배열에 추가
      markersRef.current.push(marker);
    });
  }, [map, filteredStations]);
  // 5. 리스트 클릭 시 이동 함수
  const handleLocationClick = (lat: number, lng: number) => {
    const { kakao } = window as any;
    if (map && kakao) {
      map.panTo(new kakao.maps.LatLng(lat, lng));
    }
  };
  // 현재 GPS 위치로 지도 이동
  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { kakao } = window as any;
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const locPosition = new kakao.maps.LatLng(lat, lng);
        map.panTo(locPosition);
        map.setLevel(3);
      });
    } else {
      alert("GPS를 사용할 수 없는 환경입니다.");
    }
  };

  
  return (
    <div
      className="station-container"
      style={{
        display: "flex",
        width: "100%",
        height: "700px",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* 📍 사이드바: 검색 및 필터 UI */}
      <aside
        style={{
          width: "350px",
          display: "flex",
          flexDirection: "column",
          marginRight: "20px",
          gap: "15px",
          color: "#1a1a1a",
        }}
      >
        {/* 검색창 */}
        <section>
          <h3 style={labelStyle}>🔎 충전소 검색</h3>
          <input
            type="text"
            placeholder="충전소명을 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
          />
        </section>

        <hr style={{ border: "0.5px solid #444", margin: "15px 0" }} />

        {/* 속도 필터 */}
        <section>
          <h3 style={labelStyle}>⚡ 충전 속도</h3>
          <div style={{ display: "flex", gap: "5px" }}>
            {["전체", "급속", "완속"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedSpeed(type)}
                style={selectedSpeed === type ? activeBtn : inactiveBtn}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* 상태 필터 */}
        <section>
          <h3 style={labelStyle}>⚙️ 충전기 상태</h3>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={selectStyle}
          >
            <option value="전체">전체 상태보기</option>
            <option value="충전가능">충전가능</option>
            <option value="충전중">충전중</option>
            <option value="고장점검">고장점검</option>
            <option value="통신장애">통신장애</option>
            <option value="통신미연결">통신미연결</option>
            <option value="충전종료">충전종료</option>
            <option value="계획정지">계획정지</option>
          </select>
        </section>

        {/* 결과 리스트 */}
        <div style={listAreaStyle}>
          {filteredStations.length > 0 ? (
            filteredStations.map((s) => (
              <div
                key={s.stationId}
                onClick={() => handleLocationClick(s.lat, s.lng)}
                style={cardStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9f9f9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <strong style={{ fontSize: "14px" }}>{s.stationName}</strong>
                <div
                  style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}
                >
                  {s.address}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#007bff",
                    marginTop: "6px",
                  }}
                >
                  {SPEED_MAP[s.chargerType as keyof typeof SPEED_MAP] ||
                    s.chargerType}{" "}
                  | {s.status}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#999" }}
            >
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </aside>

      {/* 🗺️ 지도 영역 */}
      <div
        id="map"
        style={{
          flex: 1,
          height: "100%",
          borderRadius: "10px",
          border: "1px solid #ddd",
        }}
      />
    </div>
  );
};

// --- 스타일 설정 (인라인) ---
const labelStyle = {
  fontSize: "15px",
  marginBottom: "8px",
  fontWeight: "bold" as "bold",
};
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  boxSizing: "border-box" as "border-box",
};
const selectStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  cursor: "pointer",
};
const listAreaStyle = {
  flex: 1,
  overflowY: "auto" as "auto",
  border: "1px solid #eee",
  borderRadius: "8px",
  background: "#fff",
};
const cardStyle = {
  padding: "15px",
  borderBottom: "1px solid #f0f0f0",
  cursor: "pointer",
};
const btnStyle = {
  flex: 1,
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "13px",
};
const activeBtn = {
  ...btnStyle,
  background: "#fee500",
  border: "1px solid #fee500",
  fontWeight: "bold" as "bold",
};
const inactiveBtn = { ...btnStyle, background: "#fff" };

export default StationList;
