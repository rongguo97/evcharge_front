import axios from "axios";

// react <-> springboot : json 객체(통신)
// 목적: 리액트와 벡엔드를 통신하기 위한 설정 파일

const common = axios.create({
  baseURL: "http://localhost:8080/api", // 벡엔드주소
  headers: {
    "Content-Type": "application/json", // 통신할 문서종류(json)
  },
  withCredentials: true,                // httpOnly(js 편집 불가) 쿠키 전송
});

// 공통 벡엔드 요청(axios) 인터셉터 (옵션)

// 공통 응답 인터셉터 (옵션) : 리액트에서 벡엔드랑 통신시 에러나면 여기서 모두 처리됩니다.
// 공통 응답 인터셉터 (옵션)
common.interceptors.response.use(
  
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status && status !== 401) {
      // 401은 새로고침 시 자연스러운 로그인 안한 상태이므로 제외하고 오류 처리
      // const msg = error.response?.data?.message || "오류가 발생했습니다. 관리자에게 문의하세요";
      // alert("[서버 오류] : " + msg);
    }
    return Promise.reject(error);
  },
);

export default common;