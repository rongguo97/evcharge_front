// src/types/IMember.ts
export interface IMemberExtended {
  email: string;           // EMAIL (기존 userId 대용)
  memberCode: number;      // MEMBER_CODE (PK 역할을 하는 ID)
  memberName: string;      // MEMBER_NAME
  carNumber: string;       // CAR_NUMBER
  phoneNumber: string;     // PHONE_NUMBER
  role: 'USER' | 'ADMIN';  // ROLE
  grade: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND'; // GRADE
  isDeleted: 'Y' | 'N';    // IS_DELETED (SQL 관례상 string인 경우가 많으므로 확인 필요)
  insertTime: string;      // INSERT_TIME (등록 일시)
  updateTime: string;      // UPDATE_TIME
  
  // TB_WALLET 등과 조인해서 가져오는 추가 필드
  reserveFund: number; 
  point: number;          
}