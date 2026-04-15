// StationService.ts
// 목적: 전기차 충전소(IStation) 백엔드와 통신하는 함수들 작성

import common from "../common/CommonService";


/**
 * 1) 충전소 전체 조회
 * @param stationName 충전소명 검색어
 * @param page 현재 페이지
 * @param size 페이지당 개수
 */
// StationService.ts
const getAll = ( params: {
  searchKeyword?: string;
  status?: string;
  chargerType?: string;
  chargerMethod?: string;
  page: number;
  size: number;
}) => {
  return common.get("/station", { params });
};

  // 충전소 상세 조회 (ID 기준)

const get = (stationId: number ) => {
  return common.get(`/station/${stationId}`,);
};

/**
 * 3) 내 위치 기반 주변 충전소 조회
 * @param userLat 내 위도
 * @param userLng 내 경도
 * @param radius 반경 (km)
 */
const getNearby = (userLat: number, userLng: number, radius: number = 5.0) => {
  return common.get("/station/nearby", {
    params: {
      userLat,
      userLng,
      radius
    }
  });
};
const StationService = {getAll, get, getNearby
};



export default StationService;