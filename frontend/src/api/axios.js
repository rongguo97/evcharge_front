import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', 
    
    // [매우 중요] 쿠키를 주고받기 위한 핵심 설정.
    // 이게 없을시 백엔드에서 보낸 JWT 쿠키를 브라우저가 저장하지 않음.
    withCredentials: true, 
    
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;