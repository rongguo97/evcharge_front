import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { type IMemberExtended } from '../../../types/IMember';
import '../../../css/AdminPage.css'; // 스타일링을 위한 CSS 파일 (생성 필요)

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<IMemberExtended[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // 백엔드에서 TB_MEMBER와 TB_WALLET을 조인한 데이터를 가져온다고 가정
        const res = await axios.get('/api/admin/members');
        if (Array.isArray(res.data)) {
          setMembers(res.data);
        }
      } catch (err) {
        console.error("회원 목록 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // 권한 변경 핸들러 (예시)
  const handleRoleChange = (_id: number, currentRole: string) => {
    const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';
    if (window.confirm(`권한을 ${newRole}로 변경하시겠습니까?`)) {
      // axios.put(`/api/admin/members/${id}/role`, { role: newRole })...
      alert("권한이 변경되었습니다.");
    }
  };

  if (loading) return <div className="p-4 text-white">회원 정보를 불러오는 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header">
        <h3>회원 및 권한 관리</h3>
        <p className="table-desc">회원과 지갑 및 권한 데이터를 통합 관리합니다.</p>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>아이디(이름)</th>
            <th>등급(GRADE)</th>
            <th>권한(ROLE)</th>
            <th>보유 포인트</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>
                  <div className="user-info">
                    <span className="user-id">{member.userId}</span>
                    <span className="user-name">({member.userName})</span>
                  </div>
                </td>
                <td>
                  <span className={`grade-badge ${member.grade.toLowerCase()}`}>
                    {member.grade}
                  </span>
                </td>
                <td>
                  <select 
                    value={member.role} 
                    onChange={() => handleRoleChange(member.id, member.role)}
                    className="role-select"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="text-right">
                  {member.point.toLocaleString()} P
                </td>
                <td>
                  {member.isDeleted ? 
                    <span className="status-deleted">탈퇴</span> : 
                    <span className="status-active">정상</span>
                  }
                </td>
                <td>
                  <button className="edit-btn-sm">수정</button>
                  <button className="log-btn-sm">로그</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center p-10">조회된 회원이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;