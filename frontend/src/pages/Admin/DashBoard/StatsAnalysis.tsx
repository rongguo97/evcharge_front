import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

// 1. 백엔드 DTO 구조에 맞춘 인터페이스 정의
interface IOperationStats {
  date: string;
  reservCount: number;
  cancelCount: number;
  revenue: number;
}

const StatsAnalysis: React.FC = () => {
  const [data, setData] = useState<IOperationStats[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. 백엔드 API 호출
  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        // 실제 백엔드 엔드포인트 (예시)
        const res = await axios.get<IOperationStats[]>('/api/admin/stats/analysis');
        
        if (res.data && Array.isArray(res.data)) {
          setData(res.data);
        } else {
          console.error("데이터 형식이 올바르지 않습니다.");
          setData([]);
        }
      } catch (err) {
        console.error("분석 데이터 로드 실패:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  // 3. 데이터 계산 로직 (데이터가 있을 때만 실행)
  const totalReserv = data.reduce((sum, cur) => sum + (cur.reservCount || 0), 0);
  const totalCancel = data.reduce((sum, cur) => sum + (cur.cancelCount || 0), 0);
  const totalRevenue = data.reduce((sum, cur) => sum + (cur.revenue || 0), 0);
  const avgCancelRate = totalReserv > 0 
    ? ((totalCancel / totalReserv) * 100).toFixed(1) 
    : "0.0";

  if (loading) return <div style={{ padding: '20px', color: '#fff' }}>데이터 분석 중...</div>;

  return (
    <div className="stats-analysis-page" style={{ padding: '20px' }}>
      
      {/* 1. 현황판 (Scorecards) - 실시간 계산된 값 반영 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <SummaryCard title="누적 예약" value={`${totalReserv.toLocaleString()}건`} color="#a5a9d8" />
        <SummaryCard title="누적 취소" value={`${totalCancel.toLocaleString()}건`} color="#ff4d4f" />
        <SummaryCard title="평균 취소율" value={`${avgCancelRate}%`} color="#ffa940" isWarning={Number(avgCancelRate) > 10} />
        <SummaryCard title="총 매출액" value={`${totalRevenue.toLocaleString()}원`} color="#52c41a" />
      </div>

      {/* 2. 추이 그래프 (Trend Graphs) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* 예약 vs 취소 추이 */}
        <div className="admin-card" style={cardStyle}>
          <h4 style={{ marginBottom: '15px' }}>예약 및 취소 현황 추이</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservCount" name="정상 예약" fill="#a5a9d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelCount" name="취소 건수" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 매출액 변화 추이 */}
        <div className="admin-card" style={cardStyle}>
          <h4 style={{ marginBottom: '15px' }}>일별 매출액 변동</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(val: any) => `${val.toLocaleString()}원`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="매출액" stroke="#52c41a" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

// 재사용 가능한 현황판 카드 컴포넌트
const SummaryCard = ({ title, value, color, isWarning }: any) => (
  <div style={{ ...cardStyle, borderTop: `4px solid ${color}`, minHeight: '100px' }}>
    <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>{title}</div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: isWarning ? '#ff4d4f' : '#333' }}>{value}</div>
  </div>
);

const cardStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};

export default StatsAnalysis;