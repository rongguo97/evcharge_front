import type { IDailyStats } from '../types/IadminChart';

export const MOCK_STATS_DATA: IDailyStats[] = [
  { date: '04-10', reservCount: 45, registCount: 12, pointTopup: 120000, cancelCount: 5 },
  { date: '04-11', reservCount: 52, registCount: 15, pointTopup: 150000, cancelCount: 8 },
  { date: '04-12', reservCount: 48, registCount: 8, pointTopup: 95000, cancelCount: 12 },
  { date: '04-13', reservCount: 70, registCount: 22, pointTopup: 210000, cancelCount: 4 },
  { date: '04-14', reservCount: 61, registCount: 18, pointTopup: 180000, cancelCount: 7 },
  { date: '04-15', reservCount: 55, registCount: 10, pointTopup: 140000, cancelCount: 3 },
  { date: '04-16', reservCount: 85, registCount: 25, pointTopup: 320000, cancelCount: 6 },
];