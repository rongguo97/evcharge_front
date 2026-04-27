import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { type IMemberExtended } from '../../../types/IMember';
import apiClient from '../../../api/axios'; 
import '../../../css/AdminPage.css';

const MemberDeletionManager: React.FC = () => {
  const [members, setMembers] = useState<IMemberExtended[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/members'); 
      
      // 콘솔에서 실제 어떤 데이터가 오는지 꼭 확인하세요!
      console.log("서버 데이터 확인:", res.data);

      const data = Array.isArray(res.data) ? res.data : res.data?.data;
      if (Array.isArray(data)) setMembers(data);
    } catch (err: any) {
      console.error("로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // 탈퇴 회원만 필터링
  const deletedMembers = useMemo(() => {
    return members.filter(member => member.isDeleted === 'Y');
  }, [members]);

  if (loading) return <div className="p-4 text-white">데이터 로드 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#fff' }}>탈퇴 회원 전용 관리</h3>
        <p style={{ color: '#ff7875' }}>탈퇴 처리된 회원 {deletedMembers.length}명의 기록입니다.</p>
      </div>

      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ backgroundColor: '#333', color: '#fff' }}>
              <th style={{ width: '80px', padding: '12px' }}>코드</th>
              <th style={{ width: '200px', padding: '12px' }}>회원정보</th>
              <th style={{ width: '150px', padding: '12px' }}>연락처</th>
              <th style={{ width: '150px', padding: '12px' }}>가입날짜</th>
              <th style={{ width: '100px', padding: '12px' }}>상태</th>
              <th style={{ width: '180px', padding: '12px' }}>비고</th>
            </tr>
          </thead>
          <tbody>
            {deletedMembers.length > 0 ? (
              deletedMembers.map((member) => (
                <tr key={member.memberCode} style={{ borderBottom: '1px solid #444', textAlign: 'center' }}>
                  <td style={{ padding: '12px' }}>{member.memberCode}</td>
                  <td style={{ padding: '12px', textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold' }}>{member.email}</div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>{member.memberName}</div>
                  </td>
                  {/* 📍 필드명 확인 필요: member.phone 인지 member.phoneNumber 인지 확인 */}
                  <td style={{ padding: '12px' }}>
                    {member.phoneNumber || member.phone || '번호없음'}
                  </td>
                  {/* 📍 가입날짜 필드명 확인: insertTime, createDate, regDate 등 */}
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    {member.insertTime ? new Date(member.insertTime).toLocaleDateString() : '날짜없음'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '2px 5px', borderRadius: '4px', fontSize: '11px' }}>탈퇴</span>
                  </td>
                  {/* 📍 겹침 방지를 위해 wordBreak 설정 */}
                  <td style={{ padding: '12px', fontSize: '12px', color: '#888', wordBreak: 'keep-all' }}>
                    재가입 불가 유저
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '50px', textAlign: 'center', color: '#777' }}>탈퇴한 회원이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberDeletionManager;