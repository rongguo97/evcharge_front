import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

// 인터페이스 정의 (백엔드 JSON 키값과 100% 일치 확인)
interface IOperationStats {
  date: string;
  reservCount: number;
  registCount: number;
  cancelCount: number;
  revenue: number;
}

const StatsAnalysis: React.FC = () => {
  const [data, setData] = useState<IOperationStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        // 1. 프록시 설정을 따르도록 상대경로 사용 (또는 전체 경로)
        const res = await axios.get('/api/admin/stats/analysis');
        
        // 2. [중요] 데이터 추출 로직 보강
        // res.data가 바로 배열일 수도 있고, res.data.data 형태일 수도 있습니다.
        const rawData = res.data;
        const finalData = Array.isArray(rawData) ? rawData : (rawData.data || []);
        
        console.log("차트에 로드된 데이터:", finalData); // 디버깅용
        setData(finalData);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysisData();
  }, []);

  // 데이터 계산 (데이터가 없을 때 NaN 방지)
  const totalReserv = data.reduce((sum, cur) => sum + (Number(cur.reservCount) || 0), 0);
  const totalCancel = data.reduce((sum, cur) => sum + (Number(cur.cancelCount) || 0), 0);
  const totalRevenue = data.reduce((sum, cur) => sum + (Number(cur.revenue) || 0), 0);
  const avgCancelRate = totalReserv > 0 
    ? ((totalCancel / totalReserv) * 100).toFixed(1) 
    : "0.0";

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>데이터 분석 중...</div>;

  return (
    <div className="stats-analysis-page" style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      {/* 1. 상단 스코어카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <SummaryCard title="누적 예약" value={`${totalReserv.toLocaleString()}건`} color="#a5a9d8" />
        <SummaryCard title="누적 취소" value={`${totalCancel.toLocaleString()}건`} color="#ff4d4f" />
        <SummaryCard title="평균 취소율" value={`${avgCancelRate}%`} color="#ffa940" isWarning={Number(avgCancelRate) > 10} />
        <SummaryCard title="총 매출액" value={`${totalRevenue.toLocaleString()}원`} color="#52c41a" />
      </div>

      {/* 2. 그래프 영역 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        
        {/* 예약/취소 바 차트 */}
        <div style={cardStyle}>
          <h4 style={{ marginBottom: '20px' }}>예약 및 취소 현황</h4>
          <div style={{ width: '100%', height: '300px' }}> {/* 📍 명시적 높이 필수 */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservCount" name="정상 예약" fill="#a5a9d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelCount" name="취소 건수" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 매출액 라인 차트 */}
        <div style={cardStyle}>
          <h4 style={{ marginBottom: '20px' }}>일별 매출액 추이</h4>
          <div style={{ width: '100%', height: '300px' }}> {/* 📍 명시적 높이 필수 */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val: any) => `${Number(val).toLocaleString()}원`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="매출액" stroke="#52c41a" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

// 하위 컴포넌트들
const SummaryCard = ({ title, value, color, isWarning }: any) => (
  <div style={{ ...cardStyle, borderTop: `5px solid ${color}` }}>
    <div style={{ color: '#888', fontSize: '14px', marginBottom: '10px' }}>{title}</div>
    <div style={{ fontSize: '26px', fontWeight: 'bold', color: isWarning ? '#ff4d4f' : '#333' }}>{value}</div>
  </div>
);

const cardStyle: React.CSSProperties = {
  background: '#fff',
  padding: '25px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column'
};

export default StatsAnalysis;