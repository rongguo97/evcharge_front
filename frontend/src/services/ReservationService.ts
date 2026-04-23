import axios from "axios";

// Axios 인스턴스 또는 기본 설정을 사용 중이라고 가정합니다.
// baseURL이 http://localhost:8080/api 로 설정되어 있다면 아래 코드의 url을 그대로 쓰세요.

const ReservationService = {
  
  // 📍 1. 예약 시간 슬롯 조회 수정 (단수형 reservation 사용, URL 중복 제거)
  getReservationsByDate: async (chargerId: number, date: string) => {
    // /api/reservation/slots 가 호출되도록 설정
    return await axios.get('http://localhost:8080/api/reservation/slots', {
      params: {
        chargerId: chargerId,
        date: date
      }
    });
  },

  // 📍 2. 신규 예약 등록 수정 (@RequestParam 방식에 맞춰서 전송)
  createReservation: async (data: any) => {
    // 백엔드가 JSON(@RequestBody)이 아닌 @RequestParam을 기다리므로, 
    // 데이터를 두 번째 인자(Body)가 아닌 세 번째 인자의 params로 넘겨줍니다.
    return await axios.post('http://localhost:8080/api/reservation/add', null, {
      params: {
        email: data.email,
        stationId: data.stationId,
        startTime: data.startTime ,// "2026-04-22T09:00:00" 형식의 ISO 문자열
        endTime: data.endTime
      }
    });
  },
  // 📍 1. 예약 확정 전 예상 요금 가져오기
getEstimatedFee: async (stationId: number, startTime: string, endTime: string) => {
    return await axios.get('http://localhost:8080/api/reservation/estimate-fee', {
      params: { stationId, startTime, endTime }
    });
  },

  // 📍 2. 현재 내 지갑 잔액 가져오기 (결제 전 잔액 보여주기용)
  // 지갑 컨트롤러에 이메일로 지갑을 찾는 API가 있다고 가정합니다.
  getUserWallet: async (email: string) => {
    return await axios.get(`http://localhost:8080/api/wallet/${email}`);
  }
};





export default ReservationService;