// 1. 로그인 요청 시 (Client -> Server)
export interface ILoginRequest {
  EMAIL: string;   // 혹은 userId
  PASSWORD: string;
}

// 2. 로그인 성공 시 응답받는 유저 정보 (Server -> Client)
export interface ILoginResponse {
  LOG_ID: string;
  userName: string;
  ROLE: 'USER' | 'ADMIN'; // 유저와 관리자 구분
  accessToken: string;        // JWT 토큰 등
}

export interface ILogin {
    EMAIL: string;
    PASSWORD: string;
    MEMBER_CODE: string;
    MEMBER_NAME: string;
    CAR_NUMBER: string;
    PHONE_NUMBER: string;
    ROLE: string;
    IS_DELETED: string;
    INSERT_TIME: Date;
    UPDATE_TIME: Date;
    GRADE: string;
    LOG_ID: number;
    ADMIN_EMAIL: string;
    ACTION: string;
    TARGET: string;
    CREATED_AT: Date;
}