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
    chargerName: any;              //충전기이름
    distance: any;
     status: string;              // 현재상태
    lat: number;                  //위도
    lng: number;                  //경도
    id: number;                    // id
    stationId: string;           //충전소id
    chargerId: number;             //충전기id
    sido: string;                // 시도
    gunggu: string;              // 군구
    address: string             // 주소
    stationName: String;         // 충전소명
    modelL: String;              // 기종(대)
    modelS: String;              // 기종(소)
    fastChargeAmount: String;    // 급속충전량
    chargerType: number;         // 충전기타입

}