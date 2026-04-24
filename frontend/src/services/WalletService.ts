import apiClient from '../api/axios'; // 1. 우리가 만든 설정을 가져옵니다.

const WalletService = {
  // 📍 내 지갑 정보 가져오기
  getMyWallet: async () => {
    // 2. apiClient를 쓰면 withCredentials: true 덕분에 쿠키가 자동으로 실립니다.
    // 더이상 localStorage나 headers 설정을 일일이 할 필요가 없어요!
    return await apiClient.get('/wallet/my'); 
  },

  // 📍 지갑 충전하기
  chargeWallet: async (amount: number) => {
    // 3. 주소도 /api/wallet/charge로 짧게 써도 됩니다 (baseURL 설정 덕분)
    return await apiClient.post('/wallet/charge', null, {
      params: { amount } 
    });
  }
};

export default WalletService;