import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { type IMemberExtended } from '../../../types/IMember';
import '../../../css/AdminPage.css';

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<IMemberExtended[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/members');
      // 백엔드 응답 구조에 맞게 데이터 추출
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

  // 1. 권한 변경 함수 (인터페이스 타입 'USER' | 'ADMIN'에 맞춤)
  const handleRoleChange = async (memberCode: number, currentRole: IMemberExtended['role']) => {
    // IMemberExtended['role'] 타입을 사용하여 newRole의 타입 에러 해결
    const newRole: IMemberExtended['role'] = currentRole === 'USER' ? 'ADMIN' : 'USER';
    
    if (!window.confirm(`회원의 권한을 ${newRole}로 변경하시겠습니까?`)) return;

    try {
      // 백엔드 API 호출 (DB에도 ROLE_ 없이 저장되는 경우)
      await axios.put(`/api/admin/members/${memberCode}/role`, { role: newRole });
      alert("권한이 변경되었습니다.");
      
      // 로컬 상태 업데이트
      setMembers(prev => 
        prev.map(m => m.memberCode === memberCode ? { ...m, role: newRole } : m)
      );
    } catch (err) {
      console.error("권한 변경 에러:", err);
      alert("변경 실패");
    }
  };

  // 2. 스타일 함수 (React.CSSProperties 타입 명시)
  const getSelectStyle = (isAdmin: boolean): React.CSSProperties => ({
    padding: '4px',
    borderRadius: '4px',
    border: `1px solid ${isAdmin ? '#ff7300' : '#d9d9d9'}`,
    backgroundColor: isAdmin ? '#fff7e6' : '#fff',
    color: isAdmin ? '#ff7300' : '#333',
    fontWeight: isAdmin ? 'bold' : 'normal'
  });

  if (loading) return <div className="p-4 text-white">로딩 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>회원 및 권한 관리</h3>
        <button onClick={fetchMembers} className="refresh-btn">새로고침</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>코드</th>
            <th>이메일(이름)</th>
            <th>연락처</th>
            <th>등급</th>
            <th>권한</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member) => {
              // 📍 'ROLE_ADMIN'이 아닌 'ADMIN'으로 비교 (인터페이스와 일치)
              const isAdmin = member.role === 'ADMIN';

              return (
                <tr key={member.memberCode}>
                  <td>{member.memberCode}</td>
                  <td>
                    <strong>{member.email}</strong><br/>
                    <small style={{ color: '#888' }}>({member.memberName})</small>
                  </td>
                  <td style={{ fontSize: '12px' }}>{member.phoneNumber}</td>
                  <td>
                    <span className={`grade-badge ${(member.grade || 'BRONZE').toLowerCase()}`}>
                      {member.grade || 'BRONZE'}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={member.role} 
                      onChange={(e) => handleRoleChange(member.memberCode, e.target.value as IMemberExtended['role'])}
                      className={`role-select ${isAdmin ? 'admin-select' : ''}`}
                      style={getSelectStyle(isAdmin)}
                    >
                      {/* 📍 value 값을 'USER', 'ADMIN'으로 수정 */}
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>
                    {member.isDeleted === 'Y' ? (
                      <span style={{ color: '#ff4d4f' }}>탈퇴</span>
                    ) : (
                      <span style={{ color: '#52c41a' }}>정상</span>
                    )}
                  </td>
                  <td>
                    <button className="edit-btn-sm">수정</button>
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