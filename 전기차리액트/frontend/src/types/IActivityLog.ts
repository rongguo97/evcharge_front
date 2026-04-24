export interface IActivityLog {
  id: number;
  adminId: string;    // 작업을 수행한 관리자 ID
  adminName: string;  // 관리자 이름
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN'; // 작업 유형
  targetMenu: string; // 작업이 일어난 메뉴 (예: 회원관리, 충전소관리)
  description: string; // 상세 내용 (예: "강남역 충전소 상태 변경: 운영중 -> 점검중")
  ipAddress: string;  // 접속 IP
  regDate: string;    // 작업 일시
}