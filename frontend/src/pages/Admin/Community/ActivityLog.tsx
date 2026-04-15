import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { IActivityLog } from '../../../types/IActivityLog';

const ActivityLog: React.FC = () => {
  // 1. 초기값을 무조건 빈 배열 []로 설정하여 map 에러를 원천 봉쇄합니다.
  const [logs, setLogs] = useState<IActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/admin/logs');
        
        // 2. 백엔드 응답이 배열인지 확인 후 세팅
        if (Array.isArray(res.data)) {
          setLogs(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          // 혹시 res.data.data 안에 배열이 들어있을 경우 대비
          setLogs(res.data.data);
        } else {
          console.error("로그 데이터가 배열 형식이 아닙니다:", res.data);
          setLogs([]); 
        }
      } catch (err) {
        console.error("로그 로드 실패:", err);
        setLogs([]); // 에러 발생 시 빈 배열로 초기화
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="p-4 text-white">로그를 불러오는 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header">
        <h3>관리자 활동 로그 ({logs?.length || 0}건)</h3>
      </div>

      <table className="admin-table log-table">
        <thead>
          <tr>
            <th>일시</th>
            <th>관리자</th>
            <th>메뉴</th>
            <th>작업 유형</th>
            <th>상세 내역</th>
          </tr>
        </thead>
        <tbody>
          {/* 3. logs가 배열이고 데이터가 있을 때만 map 실행 */}
          {Array.isArray(logs) && logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.id}>
                <td className="text-sm">{log.regDate}</td>
                <td><strong>{log.adminName}</strong>({log.adminId})</td>
                <td>{log.targetMenu}</td>
                <td>
                  <span className={`action-badge ${log.actionType?.toLowerCase() || ''}`}>
                    {log.actionType}
                  </span>
                </td>
                <td className="log-desc">{log.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                기록된 활동 로그가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLog;