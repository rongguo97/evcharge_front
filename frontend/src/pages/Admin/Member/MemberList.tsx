import React, { useEffect, useState } from 'react';
// 📍 인증 정보가 담긴 apiClient 사용
import apiClient from '../../../api/axios'; 
import { type IMemberExtended } from '../../../types/IMember';
import '../../../css/AdminPage.css';

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<IMemberExtended[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 회원 목록 로드 (GET /api/admin/members)
  const fetchMembers = async () => {
    try {
      setLoading(true);
      // apiClient의 baseURL(/api)이 적용되어 호출 경로는 /admin/members가 됨
      const res = await apiClient.get('/admin/members');
      
      const memberData = Array.isArray(res.data) ? res.data : res.data?.data;
      setMembers(Array.isArray(memberData) ? memberData : []);
    } catch (err) {
      console.error("회원 목록 로드 실패:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 2. 회원 상태 변경 함수 (PUT /api/admin/members/{email}/status)
  // 백엔드 컨트롤러의 updateMemberStatus API와 연동
  const handleStatusChange = async (email: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Y' ? 'N' : 'Y';
    const statusText = nextStatus === 'Y' ? '탈퇴' : '복구';

    if (!window.confirm(`해당 회원을 ${statusText} 처리하시겠습니까?`)) return;

    try {
      // 백엔드: @PathVariable String email, @RequestParam String status
      await apiClient.put(`/admin/members/${email}/status`, null, {
        params: { status: nextStatus }
      });
      
      alert(`${statusText} 처리가 완료되었습니다.`);
      
      // 로컬 상태 즉시 업데이트 (사용자 경험 향상)
      setMembers(prev => 
        prev.map(m => m.email === email ? { ...m, isDeleted: nextStatus } : m)
      );
    } catch (err) {
      console.error("상태 변경 에러:", err);
      alert("변경 처리에 실패했습니다.");
    }
  };

  if (loading) return <div className="p-4 text-white">회원 정보를 불러오는 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>회원 및 상태 관리</h3>
        <button onClick={fetchMembers} className="refresh-btn">새로고침</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>이메일(이름)</th>
            <th>연락처 / 차량번호</th>
            <th>등급</th>
            <th>권한</th>
            <th>예치금</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member) => {
              const isActive = member.isDeleted === 'N' || !member.isDeleted;

              return (
                <tr key={member.email}>
                  <td>
                    <strong>{member.email}</strong><br/>
                    <small style={{ color: '#888' }}>({member.memberName})</small>
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    {member.phoneNumber}<br/>
                    <span style={{ color: '#aaa' }}>{member.carNumber}</span>
                  </td>
                  <td>
                    <span className={`grade-badge ${(member.grade || 'BRONZE').toLowerCase()}`}>
                      {member.grade || 'BRONZE'}
                    </span>
                  </td>
                  <td>
                    <span className={`role-badge ${member.role?.toLowerCase()}`}>
                      {member.role}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    {/* 📍 point 대신 reserveFund 컬럼 대응 */}
                    {(member.reserveFund ?? 0).toLocaleString()} P
                  </td>
                  <td>
                    {member.isDeleted === 'Y' ? (
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>탈퇴</span>
                    ) : (
                      <span style={{ color: '#52c41a', fontWeight: 'bold' }}>정상</span>
                    )}
                  </td>
                  <td>
                    {/* 📍 관리 버튼을 탈퇴/복구 기능으로 연결 */}
                    <button 
                      className={`status-btn-sm ${member.isDeleted === 'Y' ? 'restore' : 'delete'}`}
                      onClick={() => handleStatusChange(member.email, member.isDeleted)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: '1px solid #ccc',
                        backgroundColor: member.isDeleted === 'Y' ? '#e6f7ff' : '#fff1f0',
                        color: member.isDeleted === 'Y' ? '#1890ff' : '#ff4d4f'
                      }}
                    >
                      {member.isDeleted === 'Y' ? '복구' : '탈퇴'}
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#aaa' }}>
                회원 데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;