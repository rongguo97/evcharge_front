import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

// 임시 데이터 (실제로는 API에서 가져온 IOperationStats[] 형태)
const data = [
  { date: '04-10', reservCount: 120, cancelCount: 12, revenue: 450000 },
  { date: '04-11', reservCount: 132, cancelCount: 15, revenue: 520000 },
  { date: '04-12', reservCount: 101, cancelCount: 25, revenue: 380000 }, // 취소 급증
  { date: '04-13', reservCount: 134, cancelCount: 18, revenue: 480000 },
  { date: '04-14', reservCount: 155, cancelCount: 10, revenue: 610000 },
  { date: '04-15', reservCount: 170, cancelCount: 14, revenue: 680000 },
  { date: '04-16', reservCount: 185, cancelCount: 22, revenue: 720000 },
];

const StatsAnalysis: React.FC = () => {
  // 현황판에 들어갈 요약 데이터 계산
  const totalReserv = data.reduce((sum, cur) => sum + cur.reservCount, 0);
  const totalCancel = data.reduce((sum, cur) => sum + cur.cancelCount, 0);
  const avgCancelRate = ((totalCancel / totalReserv) * 100).toFixed(1);

  return (
    <div className="stats-analysis-page" style={{ padding: '20px' }}>
      
      {/* 1. 현황판 (Scorecards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <SummaryCard title="누적 예약" value={`${totalReserv}건`} color="#a5a9d8" />
        <SummaryCard title="누적 취소" value={`${totalCancel}건`} color="#ff4d4f" />
        <SummaryCard title="평균 취소율" value={`${avgCancelRate}%`} color="#ffa940" isWarning={Number(avgCancelRate) > 10} />
        <SummaryCard title="총 매출액" value={`${data.reduce((sum, cur) => sum + cur.revenue, 0).toLocaleString()}원`} color="#52c41a" />
      </div>

      {/* 2. 추이 그래프 (Trend Graphs) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* 예약 vs 취소 추이 (막대 그래프) */}
        <div className="admin-card" style={cardStyle}>
          <h4 style={{ marginBottom: '15px' }}>예약 및 취소 현황 추이</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
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

        {/* 매출액 변화 추이 (선 그래프) */}
        <div className="admin-card" style={cardStyle}>
          <h4 style={{ marginBottom: '15px' }}>일별 매출액 변동</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
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
  <div style={{ ...cardStyle, borderTop: `4px solid ${color}` }}>
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