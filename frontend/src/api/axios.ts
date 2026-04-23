import axios from 'axios';

// 프로젝트 전체에서 사용할 axios 인스턴스 하나만 딱 만듭니다.
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/',
   
  
  // [매우 중요] 백엔드와 쿠키(JWT)를 주고받기 위한 핵심 설정
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json',
  },
});

// 외부에서 이 인스턴스를 'apiClient'라는 이름으로 부를 수 있게 내보냅니다.
export default apiClient;