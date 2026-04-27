import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { IDailyStats } from '../../../types/IadminChart';

const AdminChart: React.FC = () => {
  // 1. 초기값을 빈 배열로 설정하여 데이터가 오기 전까지의 렌더링 오류 방지
  const [stats, setStats] = useState<IDailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get<IDailyStats[]>('/api/admin/stats/daily');
        
        // 📍 [핵심 수정] res.data가 실제 배열인지 확인 후 세팅 (TypeError 방어)
        if (res && Array.isArray(res.data)) {
          setStats(res.data);
        } else {
          console.error("데이터 형식이 배열이 아닙니다:", res.data);
          setStats([]); 
        }
      } catch (err) {
        console.error("통계 데이터를 불러오는데 실패했습니다.", err);
        setStats([]); // 에러 시 빈 배열로 초기화
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="admin-loading">차트 데이터를 로딩 중입니다...</div>;

  return (
    <div className="admin-chart-container" style={{ display: 'grid', gap: '20px' }}>
      {/* 📍 [중요] ResponsiveContainer의 부모 요소인 admin-card에 명시적인 height를 부여해야 함 */}
      <div className="admin-card" style={{ ...cardStyle, height: '450px' }}>
        <h3>일별 예약 및 가입자 추이</h3>
        
        {/* 데이터가 없을 경우를 대비한 조건부 렌더링 */}
        {stats.length > 0 ? (
          <div style={{ width: '100%', height: 350 }}>
            {/* 📍 ResponsiveContainer에 minHeight와 minWidth를 주어 0인 상황 방지 */}
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <ComposedChart data={stats}>
                <CartesianGrid stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="date" /> 
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservCount" name="예약 수" fill="#a5a9d8" barSize={30} />
                <Line type="monotone" dataKey="registCount" name="신규 가입" stroke="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="no-data-msg" style={{ textAlign: 'center', padding: '100px 0', color: '#888' }}>
            표시할 통계 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  padding: '20px',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  boxSizing: 'border-box'
};

export default AdminChart;