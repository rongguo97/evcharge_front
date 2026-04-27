/**
 * 관리자 대시보드 시각화용 통계 데이터 인터페이스
 */
export interface IDailyStats {
  date: string;         // 날짜 (ex: "04-10")
  reservCount: number;  // 일별 총 예약 건수
  registCount: number;  // 당일 신규 가입자 수
  pointTopup: number;   // 당일 포인트 충전 총액 (원)
  cancelCount: number;  // 당일 예약 취소 건수
  revenue: number;
}