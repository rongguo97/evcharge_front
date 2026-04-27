import React, { useEffect, useState } from 'react';
import apiClient from '../../../api/axios'; // 📍 공통 axios 인스턴스 사용
import '../../../css/AdminPage.css';

// 1. 백엔드 MemberDto 구조에 맞춘 인터페이스 정의
interface IMember {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
  status: string; // 예: 'ACTIVE', 'BANNED'
}

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. 회원 목록 로드 함수
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 📍 백엔드 API 호출
      const res = await apiClient.get('/admin/members');
      
      // 공통 응답 객체 구조 대응
      const data = Array.isArray(res.data) ? res.data : res.data?.data;
      
      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        setMembers([]);
      }
    } catch (err: any) {
      console.error("회원 목록 로드 실패:", err);
      setError("서버 연결에 실패했습니다. 백엔드 로그를 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 3. 회원 상태 변경 핸들러 (예: 차단/해제)
  const toggleMemberStatus = async (id: number, currentStatus: string) => {
    const action = currentStatus === 'ACTIVE' ? '차단' : '활성화';
    if (!window.confirm(`이 회원을 ${action}하시겠습니까?`)) return;

    try {
      await apiClient.put(`/admin/members/${id}/status`);
      alert(`${action} 처리가 완료되었습니다.`);
      fetchMembers(); // 목록 새로고침
    } catch (err) {
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="p-4 text-white">회원 정보를 불러오는 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="admin-card">
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>회원 관리</h3>
          <p className="table-desc">가입된 전체 회원 정보를 조회하고 관리합니다.</p>
        </div>
        <button onClick={fetchMembers} className="refresh-btn">새로고침</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>권한</th>
            <th>가입일</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td><strong>{member.name}</strong></td>
                <td>{member.email}</td>
                <td>{member.phone || '-'}</td>
                <td>
                  <span className={`role-badge ${member.role?.toLowerCase()}`}>
                    {member.role === 'ROLE_ADMIN' ? '관리자' : '일반'}
                  </span>
                </td>
                <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-dot ${member.status?.toLowerCase()}`}>
                    {member.status === 'ACTIVE' ? '활동중' : '정지'}
                  </span>
                </td>
                <td>
                  <button 
                    className="action-btn-sm"
                    onClick={() => toggleMemberStatus(member.id, member.status)}
                  >
                    {member.status === 'ACTIVE' ? '차단' : '해제'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                가입된 회원이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;