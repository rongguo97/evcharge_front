import apiClient from '../api/axios'; // 1. 공통 설정 임포트

const ReservationService = {
  
  // 📍 1. 예약 시간 슬롯 조회
  getReservationsByDate: async (chargerId: number, date: string) => {
    // axios 대신 apiClient 사용, baseURL 덕분에 주소가 짧아짐
    return await apiClient.get('/reservation/slots', {
      params: { chargerId, date }
    });
  },

  // 📍 2. 신규 예약 등록
  createReservation: async (data: any) => {
    // apiClient를 써야 'withCredentials'가 작동해서 쿠키가 날아갑니다.
    return await apiClient.post('/reservation/add', null, {
      params: {
        email: data.email,
        stationId: data.stationId,
        startTime: data.startTime,
        endTime: data.endTime
      }
    });
  },

  // 📍 3. 예상 요금 가져오기
  getEstimatedFee: async (stationId: number, startTime: string, endTime: string) => {
    return await apiClient.get('/reservation/estimate-fee', {
      params: { stationId, startTime, endTime }
    });
  },

  // 📍 4. 현재 내 지갑 잔액 가져오기
  getUserWallet: async (email: string) => {
    return await apiClient.get(`/wallet/${email}`);
  }
};

export default ReservationService;