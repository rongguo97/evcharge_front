import React, { useEffect, useState } from 'react';
import axios from 'axios';

// 백엔드 AdminLog 엔티티/DTO 구조와 일치시킵니다.
interface IActivityLog {
  logId: number;       // PK
  createdAt: string;   // 일시
  adminEmail: string;  // 관리자 이메일
  adminId: number;     // 관리자 ID
  action: string;      // 작업 유형
  targetType: string;  // 대상 메뉴/유형
  description?: string; // 상세 내역 (추가했다면)
}

const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<IActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // 우리가 만든 백엔드 API 엔드포인트 호출
        const res = await axios.get('/api/admin/logs'); 
        
        if (Array.isArray(res.data)) {
          setLogs(res.data);
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error("로그 로드 실패:", err);
        setLogs([]);
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
        <h3>관리자 활동 로그 ({logs.length}건)</h3>
      </div>

      <table className="admin-table log-table">
        <thead>
          <tr>
            <th>일시</th>
            <th>관리자(ID)</th>
            <th>대상 메뉴</th>
            <th>작업</th>
            <th>상세 내역</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.logId}> {/* key를 logId로 변경 */}
                <td className="text-sm">
                  {/* 날짜 포맷팅: 2024-05-20T... -> 2024-05-20 14:30 */}
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td>
                  <strong>{log.adminEmail}</strong> 
                  <span style={{fontSize: '0.85em', color: '#ccc', marginLeft: '5px'}}>({log.adminId})</span>
                </td>
                <td>{log.targetType}</td> {/* targetMenu 대신 targetType 사용 */}
                <td>
                  <span className={`action-badge ${log.action?.toLowerCase() || ''}`}>
                    {log.action}
                  </span>
                </td>
                <td className="log-desc">{log.description || '-'}</td>
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