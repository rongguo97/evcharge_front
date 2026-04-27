import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { type IStation } from '../../../types/IStation';

const StationManager: React.FC = () => {
  const [stations, setStations] = useState<IStation[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 충전소 데이터 로드 (백엔드 연동)
  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/stations/list');
      
      // 공통 응답 구조(res.data.data) 또는 일반 배열(res.data) 대응
      const data = Array.isArray(res.data) ? res.data : res.data?.data;
      
      if (Array.isArray(data)) {
        setStations(data);
      } else {
        setStations([]); 
      }
    } catch (err) {
      console.error("데이터 로드 실패:", err);
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  // 2. 충전소 삭제 핸들러 (실제 DELETE 요청)
  const handleDelete = async (id: number, stationName: string) => {
    if (!window.confirm(`[경고] '${stationName}' 충전소를 삭제하시겠습니까?`)) return;

    try {
      // 📍 백엔드 엔드포인트: 충전소 삭제 API
      await axios.delete(`/api/admin/stations/${id}`);
      alert("삭제되었습니다.");
      
      // 삭제 후 리스트 갱신
      fetchStations();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 3. 수정 버튼 클릭 시 (보통 모달을 띄우거나 페이지 이동)
  const handleEdit = (id: number) => {
    // 실제 구현 시: navigate(`/admin/station/edit/${id}`) 혹은 모달 오픈 로직
    alert(`충전소 ID: ${id} 수정 페이지로 이동합니다.`);
  };

  // 4. 신규 등록 버튼 클릭 시
  const handleAddNew = () => {
    // 실제 구현 시: 등록 모달 호출 로직
    alert("신규 충전소 등록 모달을 엽니다.");
  };

  if (loading) return <div style={{ padding: '20px', color: 'white' }}>충전소 데이터를 불러오는 중...</div>;

  return (
    <div className="admin-table-container">
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h3 style={{ color: 'white' }}>전체 충전소 목록 ({stations?.length || 0}건)</h3>
        <button 
          className="add-btn" 
          onClick={handleAddNew}
          style={{ padding: '8px 16px', backgroundColor: '#a5a9d8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
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
          {stations.length > 0 ? (
            stations.map((station) => (
              <tr key={station.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '12px' }}>{station.id}</td>
                <td style={{ padding: '12px' }}>
                  <strong>{station.stationName}</strong>
                </td>
                <td style={{ padding: '12px' }}>{station.address}</td>
                <td style={{ padding: '12px' }}>
                  {/* 상태값에 따른 뱃지 디자인 유지 */}
                  <span className={`status-badge ${station.status === '운영중' ? 'on' : 'off'}`} 
                        style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          backgroundColor: station.status === '운영중' ? '#2d5a27' : '#5a2d2d' 
                        }}>
                    {station.status || '상태불명'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button 
                    className="edit-mini-btn" 
                    onClick={() => handleEdit(station.id)}
                    style={{ marginRight: '5px', cursor: 'pointer', padding: '4px 8px' }}
                  >
                    수정
                  </button>
                  <button 
                    className="del-mini-btn" 
                    onClick={() => handleDelete(station.id, station.stationName)}
                    style={{ cursor: 'pointer', padding: '4px 8px', color: '#ff4d4f' }}
                  >
                    삭제
                  </button>
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