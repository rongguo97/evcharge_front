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
  statId: any;
  location: string;
  stationId: string;         // 충전소 ID
  chargerId: number;         // 충전기 ID
  stationName: string;       // 충전소명
  chargerName?: string;      // 충전기명 (Java DTO에 있던 필드)
  address: string;           // 주소
  lat: number;               // 위도 (any 대신 number 권장)
  lng: number;               // 경도 (any 대신 number 권장)
  chargerType: string;       // 충전기타입
  chargerMethod?: string;    // 충전방식 (Java DTO에 있던 필드)
  fastChargeAmount: string;  // 급속충전량
  status: string;            // 상태 (사용가능 등)
  statUpdateDatetime: string; // 업데이트 시간
  distance: number;          // 사용자로부터의 거리 (가상 필드)
}