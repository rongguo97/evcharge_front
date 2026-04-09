// StationService.ts
// 목적: 전기차 충전소(IStation) 백엔드와 통신하는 함수들 작성

import common from "../common/CommonService";
import type { IStation } from "../types/IStation";

/**
 * 1) 충전소 전체 조회
 * @param stationName 충전소명 검색어
 * @param page 현재 페이지
 * @param size 페이지당 개수
 */
const getAll = (stationName: string, page: number, size: number) => {
  // 2. 주소를 /station으로 통일 (기존 /map에서 변경)
  return common.get("/station", { params: { stationName, page, size } });
};

/**
 * 2) 충전소 추가 (Insert)
 */
const insert = (data: IStation) => { // 3. 타입 수정
  return common.post("/station", data);
};

/**
 * 3) 충전소 상세 조회 (ID 기준)
 */
const get = (id: number) => {
  return common.get(`/station/${id}`);
};

/**
 * 4) 충전소 정보 수정 (Update)
 */
const update = (id: number, data: IStation) => { // 3. 타입 수정
  return common.put(`/station/${id}`, data);
};

/**
 * 5) 충전소 정보 삭제 (Delete)
 */
const remove = (id: number) => {
  return common.delete(`/station/${id}`);
};

/**
 * 6) 지역별 충전소 검색 (시도/군구 기반)
 */
const getByRegion = (sido: string, gunggu: string) => {
  return common.get("/station/region", { params: { sido, gunggu } });
};

const StationService = {
  getAll,
  insert,
  get,
  update,
  remove,
  getByRegion
};

export default StationService;