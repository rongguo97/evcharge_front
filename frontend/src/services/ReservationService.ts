import apiClient from '../api/axios';

/**
 * [주의] apiClient의 baseURL 설정에 '/api'가 포함되어 있는지 확인하세요.
 * 만약 포함되어 있지 않다면 아래 경로 앞에 '/api'를 붙여야 합니다.
 * 여기서는 컨트롤러의 @RequestMapping("/api/reservation")을 기준으로 작성했습니다.
 */
const BASE_URL = '/reservation';

const ReservationService = {
  
  // 📍 1. 예약 가능 슬롯 확인
  getReservedSlots: async (chargerId: number, date: string) => {
    const response = await apiClient.get(`${BASE_URL}/slots`, {
      params: { chargerId, date }
    });
    return response.data; // 컨트롤러가 List<String> 반환
  },

  // 📍 2. 신규 예약 등록 (결제 포함)
  createReservation: async (data: { email: string; stationId: number; startTime: string; endTime: string }) => {
    const response = await apiClient.post(`${BASE_URL}/add`, null, {
      params: data // @RequestParam으로 받으므로 params에 전달
    });
    return response.data;
  },

  // 📍 3. 예약 전 예상 요금 조회
  getEstimatedFee: async (stationId: number, startTime: string, endTime: string) => {
    const response = await apiClient.get(`${BASE_URL}/estimate-fee`, {
      params: { stationId, startTime, endTime }
    });
    return response.data;
  },

  // 📍 4. 현재 활성화된 예약 조회 (내 예약/타이머용)
  getCurrentReservation: async () => {
    const response = await apiClient.get(`${BASE_URL}/current`);
    return response.data; // ApiResponse<ReservationDto> 반환
  },

  // 📍 5. 내 예약 히스토리 전체 조회
  getReservationHistory: async () => {
    const response = await apiClient.get(`${BASE_URL}/history`);
    return response.data; // CMRespDto<List<ReservationDto>> 반환
  },

  // 📍 6. 충전 시작
  startCharging: async (reservationId: number) => {
    const response = await apiClient.put(`${BASE_URL}/${reservationId}/start`);
    return response.data;
  },

  // 📍 7. 충전 종료
  endCharging: async (reservationId: number) => {
    const response = await apiClient.put(`${BASE_URL}/${reservationId}/end`);
    return response.data;
  },

  // 📍 8. [신규 추가] 예약 취소 
  // 백엔드: @PutMapping("/{reservationId}/cancel")
  cancelReservation: async (reservationId: number) => {
    const response = await apiClient.put(`${BASE_URL}/${reservationId}/cancel`);
    return response.data;
  },

  // 📍 9. 지갑 잔액 조회 (백엔드 경로 확인 필요: /api/wallet 인지 확인)
  getUserWallet: async (email: string) => {
    const response = await apiClient.get(`/wallet/${email}`);
    return response.data;
  }
};

export default ReservationService;