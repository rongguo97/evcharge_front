// 인터페이스 이름 앞에 반드시 'export'가 붙어있어야 합니다.
interface IRegionLocation {
  name: string;
  lat: number;
  lng: number;
}

export interface IRegionData {
  [key: string]: IRegionLocation[];
}

export interface IStation {
    statUpdateDatetime: string;
    chargerMethod: string;
    chargerName: any;
    distance: any;
    status: string;
    lat: number;
    lng: number;
    id: number;                    // id
    stationId: string;           //충전소id
    chargerId: number;             //충전기id
    sido: String;                // 시도
    gunggu: String;              // 군구
    address: String             // 주소
    stationName: String;         // 충전소명
    facilityL: String;           // 시설구분(대)
    facilityS: String;           // 시설구분(소)
    modelL: String;              // 기종(대)
    modelS: String;              // 기종(소)
    operatorL: String;           // 운영기관(대)
    operatorS: String;           // 운영기관(소)
    fastChargeAmount: String;    // 급속충전량
    chargerType: number;         // 충전기타입
    userRestriction: String;     // 이용자제한
}