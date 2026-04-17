export interface IPayment {
  id: number;
  reservId: string;    // 예약 번호
  userId: string;      // 결제자 ID
  userName: string;    // 결제자 이름
  amount: number;      // 결제 금액
  method: 'POINT' | 'CARD' | 'KAKAO_PAY'; // 결제 수단
  status: 'PAID' | 'CANCELLED' | 'REFUNDED'; // 상태
  payDate: string;     // 결제 일시
}