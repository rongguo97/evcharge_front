import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { type IMemberExtended } from '../../../types/IMember';
import '../../../css/AdminPage.css'; // 스타일링을 위한 CSS 파일 (생성 필요)

// ... 상단 import 생략

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<IMemberExtended[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
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

  const handleRoleChange = (_memberCode: number, currentRole: string) => {
    const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';
    if (window.confirm(`권한을 ${newRole}로 변경하시겠습니까?`)) {
      // axios.put(`/api/admin/members/${memberCode}/role`, { role: newRole })
      alert("권한이 변경되었습니다.");
    }
  };

  if (loading) return <div className="p-4 text-white">회원 정보를 불러오는 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header">
        <h3>회원 및 권한 관리</h3>
        <p className="table-desc">회원 데이터와 권한을 통합 관리합니다.</p>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>코드</th>
            <th>이메일(이름)</th>
            <th>연락처 / 차량번호</th>
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
              <tr key={member.memberCode}>
                <td>{member.memberCode}</td>
                <td>
                  <div className="user-info">
                    <span className="user-id" style={{ fontWeight: 'bold' }}>{member.email}</span>
                    <span className="user-name">({member.memberName})</span>
                  </div>
                </td>
                <td style={{ fontSize: '12px' }}>
                  {member.phoneNumber}<br/>
                  <span style={{ color: '#aaa' }}>{member.carNumber}</span>
                </td>
                <td>
                  <span className={`grade-badge ${member.grade.toLowerCase()}`}>
                    {member.grade}
                  </span>
                </td>
                <td>
                  <select 
                    value={member.role} 
                    onChange={() => handleRoleChange(member.memberCode, member.role)}
                    className="role-select"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="text-right">
                  {member.point?.toLocaleString() ?? 0} P
                </td>
                <td>
                  {member.isDeleted === 'Y' ? 
                    <span className="status-deleted">탈퇴</span> : 
                    <span className="status-active">정상</span>
                  }
                </td>
                <td>
                  <button className="edit-btn-sm">수정</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center p-10">조회된 회원이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;