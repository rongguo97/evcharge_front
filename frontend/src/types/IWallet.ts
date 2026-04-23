// src/types/IWallet.ts
export interface IWallet {
  walletId?: number;
  email: string;
  reserveFund: number;  // 적립금
  point: number;        // 포인트
}