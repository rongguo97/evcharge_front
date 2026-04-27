import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { type IMemberExtended } from '../../../types/IMember';
import '../../../css/AdminPage.css';

const WalletManager: React.FC = () => {
  const [members, setMembers] = useState<IMemberExtended[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 지갑(멤버 및 포인트) 정보 로드
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/members');
      // 백엔드 응답 구조에 대응 (배열인지 확인)
      const data = Array.isArray(res.data) ? res.data : res.data?.data;
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("지갑 정보 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 2. 포인트 수정 핸들러 (실제 백엔드 PUT 요청)
  const handleUpdateBalance = async (memberCode: number, currentBalance: number) => {
    const amountStr = window.prompt(
      `현재 잔액: ${currentBalance.toLocaleString()}P\n수정할 금액을 입력하세요:`, 
      String(currentBalance)
    );
    
    // 취소 버튼을 눌렀거나 빈 값인 경우 종료
    if (amountStr === null || amountStr.trim() === '') return;

    const newBalance = Number(amountStr);

    if (isNaN(newBalance)) {
      alert("숫자만 입력 가능합니다.");
      return;
    }

    try {
      // 📍 백엔드 엔드포인트: 지갑 정보를 업데이트하는 API 호출
      // DTO 구조에 맞춰 balance 또는 point로 전달
      await axios.put(`/api/admin/wallets/${memberCode}`, { 
        balance: newBalance 
      });

      alert("잔액이 성공적으로 수정되었습니다.");
      
      // 📍 방법 1: 전체 다시 불러오기 (안전함)
      // fetchMembers(); 

      // 📍 방법 2: 로컬 상태만 즉시 업데이트 (사용자 경험이 좋음)
      setMembers(prev => 
        prev.map(m => m.memberCode === memberCode ? { ...m, point: newBalance } : m)
      );
    } catch (err) {
      console.error("잔액 수정 실패:", err);
      alert("잔액 수정에 실패했습니다. 관리자 권한을 확인하세요.");
    }
  };

  if (loading) return <div className="p-4 text-white">지갑 정보를 불러오는 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>지갑 및 잔액 관리</h3>
          <p className="table-desc">회원별 TB_WALLET의 BALANCE(포인트)를 관리합니다.</p>
        </div>
        <button onClick={fetchMembers} className="refresh-btn">새로고침</button>
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
                <td>{member.memberCode}</td>
                <td>
                  <div className="user-info">
                    <strong>{member.email}</strong>
                    <span style={{ fontSize: '0.9em', color: '#aaa', marginLeft: '5px' }}>
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
                    onClick={() => handleUpdateBalance(member.memberCode, member.point ?? 0)}
                  >
                    잔액 수정
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
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