import React, { useEffect, useState } from 'react';
import apiClient from '../../../api/axios'; // 📍 AuthContext와 동일한 인스턴스 사용
import { type IMemberExtended } from '../../../types/IMember';
import '../../../css/AdminPage.css';

const WalletManager: React.FC = () => {
  const [members, setMembers] = useState<IMemberExtended[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 초기 데이터 로드 (회원 목록을 가져와서 지갑 정보를 표시)
  const fetchMembers = async () => {
    setLoading(true);
    try {
      // baseURL이 /api라고 가정하면, 호출 경로는 /admin/members가 됩니다.
      const res = await apiClient.get('/admin/members');
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
      `현재 잔액: ${currentBalance.toLocaleString()}P\n수정할 금액을 입력하세요:`,
      String(currentBalance)
    );

    // 취소 버튼을 누르지 않았고, 숫자인 경우에만 실행
    if (amount !== null && !isNaN(Number(amount))) {
      try {
        // 백엔드: @PutMapping("/{email}/reserve-fund")
        // @RequestBody AdminWalletDto.UpdateRequest 구조에 맞게 데이터 전송
        await apiClient.put(`/admin/wallets/${email}/reserve-fund`, {
          amount: Number(amount),
          // 만약 DTO에 관리자 정보가 필수라면 여기에 추가 (예: adminId: 'admin')
        });

        alert(`${email} 회원의 잔액이 수정되었습니다.`);
        fetchMembers(); // 수정 후 목록 새로고침
      } catch (err) {
        console.error("잔액 수정 실패:", err);
        alert("잔액 수정 중 오류가 발생했습니다.");
      }
    }
  };

  if (loading) return <div className="p-4 text-white">지갑 정보를 불러오는 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header">
        <h3>지갑 및 잔액 관리</h3>
        <p className="table-desc">회원별 예치금(BALANCE)을 관리합니다.</p>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>이메일(이름)</th>
            <th>보유 포인트 (BALANCE)</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member) => (
              <tr key={member.email}>
                <td>
                  <div className="user-info">
                    <strong>{member.email}</strong>
                    <span style={{ fontSize: '0.9em', color: '#ccc', marginLeft: '5px' }}>
                      ({member.memberName})
                    </span>
                  </div>
                </td>
                <td style={{ fontWeight: 'bold', color: '#4caf50', textAlign: 'right' }}>
                  {(member.point ?? 0).toLocaleString()} P
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleUpdateBalance(member.email, member.point)}
                  >
                    잔액 수정
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '40px' }}>
                등록된 지갑 정보가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WalletManager;