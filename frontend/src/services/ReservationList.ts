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

const StationService = {getAll, get};

export default StationService;