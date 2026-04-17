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
 * 예약 추가
 * @param params email, stationId, startTime이 담긴 데이터
 */
const addReservation = (params: URLSearchParams) => {
  // 백엔드가 @RequestParam으로 받고 있으므로 form-urlencoded 형식으로 보냅니다.
  return common.post("/reservation/add", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};  

  const StationService = {getAll, get, addReservation};

  export default StationService;