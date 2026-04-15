// src/types/IMember.ts
export interface IMemberExtended {
  wallet: any;
  id: number;
  userId: string;
  userName: string;
  email: string;
  role: 'USER' | 'ADMIN';    // ROLE 컬럼
  grade: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND'; // GRADE 컬럼
  point: number;             // TB_WALLET의 포인트
  isDeleted: boolean;        // 탈퇴 여부
  regDate: string;
}