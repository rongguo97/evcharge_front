import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { type IMemberExtended } from '../../../types/IMember';
import '../../../css/AdminPage.css';

const WalletManager: React.FC = () => {
  const [members, setMembers] = useState<IMemberExtended[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // 백엔드에서 TB_MEMBER와 TB_WALLET(BALANCE)을 조인한 데이터를 가져옴
        const res = await axios.get('/api/admin/members');
        if (Array.isArray(res.data)) {
          setMembers(res.data);
        }
      } catch (err) {
        console.error("지갑 정보 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // 포인트 수정 핸들러 (예시)
  const handleUpdateBalance = (memberCode: number, currentBalance: number) => {
    const amount = window.prompt(`현재 잔액: ${currentBalance.toLocaleString()}P\n수정할 금액을 입력하세요:`, String(currentBalance));
    
    if (amount !== null && !isNaN(Number(amount))) {
      // axios.put(`/api/admin/wallets/${memberCode}`, { balance: Number(amount) })
      alert(`${memberCode}번 회원의 잔액이 ${Number(amount).toLocaleString()}P로 수정되었습니다.`);
      // 실제 구현 시 fetchMembers()로 재로딩 필요
    }
  };

  if (loading) return <div className="p-4 text-white">지갑 정보를 불러오는 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header">
        <h3>지갑 및 잔액 관리</h3>
        <p className="table-desc">회원별 TB_WALLET의 BALANCE(포인트)를 관리합니다.</p>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>멤버코드</th>
            <th>이메일(이름)</th>
            <th>보유 포인트 (BALANCE)</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member) => (
              <tr key={member.memberCode}>
                {/* IMember.ts의 memberCode 사용 */}
                <td>{member.memberCode}</td>
                <td>
                  <div className="user-info">
                    <strong>{member.email}</strong>
                    <span style={{ fontSize: '0.9em', color: '#ccc', marginLeft: '5px' }}>
                      ({member.memberName})
                    </span>
                  </div>
                </td>
                {/* SQL의 BALANCE 컬럼 값이 담긴 member.point 사용 */}
                <td style={{ fontWeight: 'bold', color: '#4caf50', textAlign: 'right' }}>
                  {(member.point ?? 0).toLocaleString()} P
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleUpdateBalance(member.memberCode, member.point)}
                  >
                    잔액 수정
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
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