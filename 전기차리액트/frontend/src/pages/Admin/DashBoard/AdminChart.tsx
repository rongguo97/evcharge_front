import React, { useEffect, useState } from 'react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// 분리한 타입과 데이터를 import
// 분리한 타입과 데이터를 import
import type { IDailyStats } from '../../../types/IadminChart';
import { MOCK_STATS_DATA } from '../../../data/adminMockData';

const AdminChart: React.FC = () => {
  const [stats, setStats] = useState<IDailyStats[]>([]);

  useEffect(() => {
    // 현재는 분리된 더미 데이터를 사용
    // 실제 API 연동 시: axios.get<IDailyStats[]>('/api/admin/stats').then(res => setStats(res.data));
    setStats(MOCK_STATS_DATA);
  }, []);

  return (
    <div className="admin-chart-container" style={{ display: 'grid', gap: '20px' }}>
      {/* 차트 UI 코드... (기존과 동일) */}
      <div className="admin-card" style={cardStyle}>
        <h3>일별 예약 및 가입자 추이</h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
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
      </div>
    </div>
  );
};

// 인라인 스타일도 변수로 분리하면 가독성이 좋아집니다.
const cardStyle = {
  padding: '20px',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

export default AdminChart;