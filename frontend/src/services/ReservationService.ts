
import apiClient from '../api/axios'; // 1. 공통 설정 임포트 (baseURL 등 포함)

const ReservationService = {
  
  // 📍 1. 예약 시간 슬롯 조회 (충전소 및 날짜별)
  getReservationsByDate: async (chargerId: number, date: string) => {
    return await apiClient.get('/reservation/slots', {
      params: { chargerId, date }
    });
  },

  // 📍 2. 신규 예약 등록 (결제 포함)
  createReservation: async (data: any) => {
    return await apiClient.post('/reservation/add', null, {
      params: {
        email: data.email,
        stationId: data.stationId,
        startTime: data.startTime,
        endTime: data.endTime
      }
    });
  },

  // 📍 3. 예약 전 예상 요금 가져오기
  getEstimatedFee: async (stationId: number, startTime: string, endTime: string) => {
    return await apiClient.get('/reservation/estimate-fee', {
      params: { stationId, startTime, endTime }
    });
  },

  // 📍 4. 특정 사용자의 지갑 잔액 조회 (이메일 기준)
  getUserWallet: async (email: string) => {
    return await apiClient.get(`/wallet/${email}`);
  },

  // 📍 5. 현재 활성화된 예약 조회 (마이페이지 타이머 및 제어용)
  getCurrentReservation: async () => {
    // 💡 백엔드의 @GetMapping("/current")와 매칭
    return await apiClient.get('/reservation/current');
  },

  // 📍 6. 충전 시작 처리
  startCharging: async (reservationId: number) => {
    // 💡 백엔드의 @PutMapping("/{reservationId}/start")와 매칭
    return await apiClient.put(`/reservation/${reservationId}/start`);
  },

  // 📍 7. 충전 종료 및 최종 정산 처리
  endCharging: async (reservationId: number) => {
    // 💡 백엔드의 @PutMapping("/{reservationId}/end")와 매칭
    return await apiClient.put(`/reservation/${reservationId}/end`);
  },

  // 📍 8. [신규 추가] 내 예약 내역 전체 조회 (마이페이지 최근 예약 리포트용)
  getReservationHistory: async () => {
    // 💡 백엔드 컨트롤러의 @GetMapping("/history")와 매칭
    return await apiClient.get('/reservation/history');
  },
  cancelReservation: async (reservationId: number) => {
    // 백엔드에서 설정한 @PutMapping("/{reservationId}/cancel") 주소와 맞춥니다.
   return await apiClient.put(`/reservation/${reservationId}/cancel`);
  }
};

export default ReservationService;