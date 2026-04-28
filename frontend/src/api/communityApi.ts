// src/api/communityApi.ts

// 1. 전체 게시글 조회
export const fetchAllPosts = async () => {
  const response = await fetch('/api/community'); // 백엔드 @GetMapping과 일치
  if (!response.ok) throw new Error('목록 로드 실패');
  return response.json();
};

// 2. 게시글 상세 조회
export const fetchPostByUuid = async (cUuid: string | number) => {
  const response = await fetch(`/api/community/${cUuid}`); // 백엔드 @GetMapping("/{cUuid}")
  if (!response.ok) throw new Error('상세조회 실패');
  return response.json();
};

// 3. 게시글 수정
export const updatePost = async (id: number | string, updateData: any) => {
  const response = await fetch(`/api/community/${id}/update`, { // 백엔드 @PutMapping("/{cUuid}/update")
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) throw new Error('수정 실패');
  return response.json();
};

// 4. 게시글 등록
export const createPost = async (postData: any) => {
  const response = await fetch('/api/community', { // 백엔드 @PostMapping
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!response.ok) throw new Error('등록 실패');
  return response.json();
};
export const deletePost = async (id: number | string) => {
  const response = await fetch(`/api/community/${id}/delete`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('게시글 삭제에 실패했습니다.');
  }
  // 204 No Content 응답은 본문이 없으므로 response.json()을 호출하지 않습니다.
  return true;
};