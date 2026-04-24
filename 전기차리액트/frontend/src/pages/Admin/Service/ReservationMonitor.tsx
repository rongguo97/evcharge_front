// 서비스 운영 관리

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { type IStation } from '../../../types/IStation';

const StationManager: React.FC = () => {
  const [stations, setStations] = useState<IStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axios.get('/api/stations/list');
        // 백엔드 데이터 구조에 따라 res.data 혹은 res.data.content 등을 확인해야 할 수 있습니다.
        if (Array.isArray(res.data)) {
          setStations(res.data);
        } else {
          setStations([]); 
        }
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setStations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  if (loading) return <div style={{ padding: '20px', color: 'white' }}>충전소 데이터를 불러오는 중...</div>;

  return (
    <div className="admin-table-container">
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h3 style={{ color: 'white' }}>전체 충전소 목록 ({stations?.length || 0}건)</h3>
        <button className="add-btn" style={{ padding: '8px 16px', backgroundColor: '#a5a9d8', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          신규 충전소 등록
        </button>
      </div>
      
      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1a1c23', color: 'white' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>충전소명</th>
            <th style={{ padding: '12px' }}>주소</th>
            <th style={{ padding: '12px' }}>상태</th>
            <th style={{ padding: '12px' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(stations) && stations.length > 0 ? (
            stations.map((station) => (
              <tr key={station.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '12px' }}>{station.id}</td>
                <td style={{ padding: '12px' }}>
                  <strong>{String(station.stationName)}</strong>
                </td>
                <td style={{ padding: '12px' }}>{station.address}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`status-badge ${station.status === '운영중' ? 'on' : 'off'}`}>
                    {station.status || '상태불명'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button className="edit-mini-btn" style={{ marginRight: '5px', cursor: 'pointer' }}>수정</button>
                  <button className="del-mini-btn" style={{ cursor: 'pointer' }}>삭제</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                등록된 충전소 데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StationManager;