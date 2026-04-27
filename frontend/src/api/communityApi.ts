// src/api/communityApi.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 백엔드 컨트롤러 @RequestMapping("/api/community/posts")와 일치
const BASE_URL = `${API_URL}/api/community/posts`; 

export const createPost = async (data: any) => {
  console.log("🚀 전송 데이터 확인:", data);
  
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    // 서버에서 보낸 에러 메시지가 있으면 그것을, 없으면 기본 메시지 반환
    throw new Error(errorText || '서버 저장 중 알 수 없는 에러가 발생했습니다.');
  }

  return res.json();
};

export const fetchAllPosts = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('게시글을 불러오는데 실패했습니다.');
  return res.json();
};