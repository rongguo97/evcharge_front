// types/IReservation.ts
export interface IReservation {
    id?: number;
    stationId: number;    // DTO가 Long이므로 number로 매핑
    email: string;
    startTime: string;    // ISO 문자열 ("2026-04-22T14:00:00")
    endTime?: string;
    status?: string;
    stationName?: string;
    address?: string;
    rDate: string;        // "2026-04-22"
}