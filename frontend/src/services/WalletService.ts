import axios from 'axios';

const API_URL = 'http://localhost:8080/api/wallet';

const WalletService = {
  // 📍 내 지갑 정보 가져오기 (적립금, 포인트)
  getMyWallet: async () => {
    const token = localStorage.getItem("token"); // 🔑 로그인 시 저장된 토큰
    return await axios.get(`${API_URL}/my`, {
      headers: {
        Authorization: `Bearer ${token}` // 신분증 부착
      }
    });
  },
  chargeWallet: async (amount: number) => {
    const token = localStorage.getItem("token"); // 🔑 신분증 꺼내기
    return await axios.post(`http://localhost:8080/api/wallet/charge`, null, {
      params: { amount }, // 📍 URL 쿼리 파라미터로 전달 (?amount=10000)
      headers: {
        Authorization: `Bearer ${token}` // 보안 통과용
      }
    });
  }
};
 
  


export default WalletService;