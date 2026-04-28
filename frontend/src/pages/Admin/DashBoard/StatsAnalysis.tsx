import React, { useState, useEffect } from 'react';
// 📍 인증 및 baseURL 설정이 반영된 apiClient 사용
import apiClient from '../../../api/axios'; 
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

// 1. 백엔드 AdminStatsDto와 100% 일치하는 인터페이스
interface IOperationStats {
  date: string;        // "2024-05-20"
  reservCount: number; // 해당 날짜의 예약 건수
  registCount: number; // 해당 날짜의 신규 가입자 수
}

const StatsAnalysis: React.FC = () => {
  const [data, setData] = useState<IOperationStats[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. 백엔드 API 호출 (GET /api/admin/stats/daily)
  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        // 📍 컨트롤러의 @RequestMapping("/api/admin/stats") + @GetMapping("/daily") 조합
        const res = await apiClient.get('/admin/stats/daily');
        
        // 데이터 구조 추출 (배열인지 확인)
        const finalData = Array.isArray(res.data) ? res.data : res.data?.data;
        
        if (Array.isArray(finalData)) {
          setData(finalData);
        }
      } catch (err) {
        console.error("통계 데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  // 3. 상단 현황판 계산 로직
  const totalReserv = data.reduce((sum, cur) => sum + (Number(cur.reservCount) || 0), 0);
  const totalRegist = data.reduce((sum, cur) => sum + (Number(cur.registCount) || 0), 0);
  // 일일 평균 예약 건수 계산
  const avgReserv = data.length > 0 ? (totalReserv / data.length).toFixed(1) : "0";

  if (loading) return <div style={{ padding: '20px', color: '#fff' }}>데이터 분석 중...</div>;

  return (
    <div className="stats-analysis-page" style={{ padding: '20px' }}>
      
      {/* 1. 현황판 (Scorecards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <SummaryCard title="누적 예약 건수" value={`${totalReserv.toLocaleString()}건`} color="#a5a9d8" />
        <SummaryCard title="누적 신규 가입" value={`${totalRegist.toLocaleString()}명`} color="#52c41a" />
        <SummaryCard title="일평균 예약" value={`${avgReserv}건`} color="#ffa940" />
      </div>

      {/* 2. 추이 그래프 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* 예약 건수 추이 (Bar Chart) */}
        <div className="admin-card" style={cardStyle}>
          <h4 style={{ marginBottom: '15px', color: '#333' }}>일별 예약 현황</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservCount" name="예약 건수" fill="#a5a9d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 신규 가입자 추이 (Line Chart) */}
        <div className="admin-card" style={cardStyle}>
          <h4 style={{ marginBottom: '15px', color: '#333' }}>신규 회원 가입 추이</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="registCount" 
                  name="신규 가입자" 
                  stroke="#52c41a" 
                  strokeWidth={3} 
                  dot={{ r: 6 }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

// 재사용 카드 컴포넌트
const SummaryCard = ({ title, value, color }: any) => (
  <div style={{ ...cardStyle, borderTop: `4px solid ${color}`, minHeight: '100px' }}>
    <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>{title}</div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{value}</div>
  </div>
);

const cardStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};

export default StatsAnalysis;