import React, { useEffect, useState } from 'react';
import apiClient from '../../../api/axios'; 
import { type IMemberExtended } from '../../../types/IMember';
import '../../../css/AdminPage.css';

const WalletManager: React.FC = () => {
  const [members, setMembers] = useState<IMemberExtended[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 데이터 로드
  const fetchMembers = async () => {
    setLoading(true);
    try {
      // 📍 백엔드 /api/admin/members 엔드포인트 호출
      const res = await apiClient.get('/admin/members');
      
      console.log("서버 응답 데이터:", res.data); // 디버깅용: 데이터 구조 확인

      if (Array.isArray(res.data)) {
        setMembers(res.data);
      }
    } catch (err) {
      console.error("지갑 목록 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 2. 예치금(Reserve Fund) 수정 핸들러
  const handleUpdateBalance = async (email: string, currentBalance: number) => {
    const amount = window.prompt(
      `대상: ${email}\n현재 잔액: ${currentBalance.toLocaleString()}P\n새로운 잔액을 입력하세요:`,
      String(currentBalance)
    );

    if (amount !== null && !isNaN(Number(amount))) {
      try {
        // 📍 백엔드 AdminWalletDto.UpdateRequest 구조에 맞춤
        await apiClient.put(`/admin/wallets/${email}/reserve-fund`, {
          amount: Number(amount),
          adminEmail: "admin@example.com", // 필요 시 실제 관리자 이메일로 변경
          adminId: 1 // 필요 시 실제 관리자 ID로 변경
        });

        alert(`수정이 완료되었습니다.`);
        fetchMembers(); 
      } catch (err) {
        console.error("잔액 수정 실패:", err);
        alert("수정 권한이 없거나 오류가 발생했습니다.");
      }
    }
  };

  if (loading) return <div className="p-4 text-white">지갑 정보를 불러오는 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header">
        <h3>지갑 및 잔액 관리</h3>
        <p className="table-desc">회원별 예치금(Reserve Fund)을 실시간으로 관리합니다.</p>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>이메일(이름)</th>
            <th style={{ textAlign: 'right' }}>보유 포인트</th>
            <th style={{ textAlign: 'center' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member) => {
              // 📍 백엔드 DTO 우선순위: reserveFund -> point -> 0 순서로 체크
              const displayBalance = member.reserveFund ?? member.point ?? 0;

              return (
                <tr key={member.email}>
                  <td>
                    <div className="user-info">
                      <strong>{member.email}</strong>
                      <span className="member-name-span">
                        ({member.memberName || '이름 없음'})
                      </span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 'bold', color: '#4caf50', textAlign: 'right' }}>
                    {displayBalance.toLocaleString()} P
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="edit-btn"
                      onClick={() => handleUpdateBalance(member.email, displayBalance)}
                    >
                      잔액 수정
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '40px' }}>
                조회된 회원 정보가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WalletManager;