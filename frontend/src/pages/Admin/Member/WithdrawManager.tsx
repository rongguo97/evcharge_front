import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { type IMemberExtended } from '../../../types/IMember';
import '../../../css/AdminPage.css';

const MemberDeletionManager: React.FC = () => {
  const [members, setMembers] = useState<IMemberExtended[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 회원 데이터 로드 (백엔드 연동)
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      // 백엔드 엔드포인트 호출
      const res = await axios.get('/api/admin/members');
      
      // 응답 데이터가 res.data 또는 res.data.data인지 확인하여 처리
      const data = Array.isArray(res.data) ? res.data : res.data?.data;
      
      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error("회원 목록 로드 실패:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // 2. 회원 탈퇴 처리 핸들러 (실제 백엔드 API 호출)
  const handleDeleteMember = async (memberCode: number, memberName: string) => {
    if (!window.confirm(`[경고] ${memberName} 회원을 정말로 탈퇴 처리하시겠습니까?`)) return;

    try {
      // 📍 백엔드 엔드포인트: IS_DELETED 필드를 'Y'로 바꾸는 API 호출
      // 백엔드 컨트롤러 주소에 맞춰 수정하세요 (예: /api/admin/members/{code}/delete)
      await axios.put(`/api/admin/members/${memberCode}/delete`);
      
      alert(`[성공] ${memberName} 회원이 탈퇴 처리되었습니다.`);
      
      // 📍 상태 업데이트: 다시 fetch하거나 로컬 state를 직접 변경
      // 여기서는 확실한 데이터 정합성을 위해 다시 불러오기를 권장합니다.
      fetchMembers(); 
      
    } catch (err) {
      console.error("탈퇴 처리 중 오류:", err);
      alert("탈퇴 처리 중 오류가 발생했습니다. 권한을 확인하세요.");
    }
  };

  if (loading) return <div className="p-4 text-white">데이터를 불러오는 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>회원 탈퇴 및 계정 관리</h3>
          <p className="table-desc">탈퇴한 회원을 조회하거나, 특정 회원을 탈퇴 처리할 수 있습니다.</p>
        </div>
        <button onClick={fetchMembers} className="refresh-btn">새로고침</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>멤버코드</th>
            <th>이메일 / 이름</th>
            <th>전화번호</th>
            <th>등록일시</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member) => (
              <tr key={member.memberCode} className={member.isDeleted === 'Y' ? 'row-deleted' : ''}>
                <td>{member.memberCode}</td>
                <td>
                  <div className="user-info">
                    <strong>{member.email}</strong>
                    <span className="user-name" style={{ marginLeft: '5px', fontSize: '0.9em', color: '#888' }}>
                      ({member.memberName})
                    </span>
                  </div>
                </td>
                <td>{member.phoneNumber}</td>
                <td style={{ fontSize: '13px' }}>
                  {member.insertTime ? new Date(member.insertTime).toLocaleString() : '-'}
                </td>
                <td>
                  {member.isDeleted === 'Y' ? (
                    <span className="status-badge deleted" style={{ color: '#ff4d4f', fontWeight: 'bold' }}>탈퇴완료</span>
                  ) : (
                    <span className="status-badge active" style={{ color: '#52c41a', fontWeight: 'bold' }}>정상</span>
                  )}
                </td>
                <td>
                  {/* 탈퇴하지 않은 회원에게만 탈퇴 버튼 노출 */}
                  {member.isDeleted === 'N' ? (
                    <button 
                      className="delete-btn-sm" 
                      onClick={() => handleDeleteMember(member.memberCode, member.memberName)}
                      style={{ padding: '4px 8px', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                    >
                      탈퇴처리
                    </button>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#aaa' }}>-</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                회원 데이터가 존재하지 않습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MemberDeletionManager;