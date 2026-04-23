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
      // 백엔드 엔드포인트는 실제 환경에 맞춰 수정하세요.
      const res = await axios.get('/api/admin/members');
      if (Array.isArray(res.data)) {
        setMembers(res.data);
      }
    } catch (err) {
      console.error("회원 목록 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // 2. 회원 탈퇴 처리 핸들러 (IS_DELETED를 'Y'로 업데이트)
  const handleDeleteMember = async (_memberCode: number, memberName: string) => {
    if (!window.confirm(`[경고] ${memberName} 회원을 정말로 탈퇴 처리하시겠습니까?`)) return;

    try {
      // 백엔드 API 호출 (예시)
      // await axios.put(`/api/admin/members/${memberCode}/delete`);
      alert(`[성공] ${memberName} 회원이 탈퇴 처리되었습니다.`);
      fetchMembers(); // 리스트 새로고침
    } catch (err) {
      alert("탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="p-4 text-white">데이터를 불러오는 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header">
        <h3>회원 탈퇴 및 계정 관리</h3>
        <p className="table-desc">탈퇴한 회원을 조회하거나, 특정 회원을 탈퇴 처리할 수 있습니다.</p>
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
                    <span className="user-name">({member.memberName})</span>
                  </div>
                </td>
                <td>{member.phoneNumber}</td>
                <td style={{ fontSize: '13px' }}>{member.insertTime}</td>
                <td>
                  {member.isDeleted === 'Y' ? (
                    <span className="status-badge deleted">탈퇴완료</span>
                  ) : (
                    <span className="status-badge active">정상</span>
                  )}
                </td>
                <td>
                  {member.isDeleted === 'N' && (
                    <button 
                      className="delete-btn-sm" 
                      onClick={() => handleDeleteMember(member.memberCode, member.memberName)}
                    >
                      탈퇴처리
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
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