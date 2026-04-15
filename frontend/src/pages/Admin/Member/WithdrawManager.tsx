import React from 'react';
import axios from 'axios';

const WithdrawManager: React.FC = () => {

  // 복구 함수
  const handleRestore = async (id: number, userId: string) => {
    if (window.confirm(`${userId} 사용자의 계정을 복구하시겠습니까?`)) {
      try {
        // 백엔드에서 IS_DELETED = false, DELETED_DATE = null 처리
        await axios.put(`/api/admin/members/restore/${id}`);
        alert("계정이 성공적으로 복구되었습니다.");
        // 목록 새로고침 로직
      } catch (err) {
        alert("복구 처리 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="admin-card">
      <div className="table-header">
        <h3>탈퇴 및 계정 복구 관리</h3>
        <p className="status-tip">탈퇴 후 30일 이내의 데이터만 복구가 가능하도록 정책을 설정하는 것이 좋습니다.</p>
      </div>

      <table className="admin-table withdraw-table">
        <thead>
          <tr>
            <th>탈퇴 일시</th>
            <th>사용자 정보</th>
            <th>탈퇴 사유</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2026-04-14 10:20</td>
            <td>
              <div className="user-info">
                <strong>test_user</strong>
                <span>(홍길동)</span>
              </div>
            </td>
            <td>앱 사용이 불편함</td>
            <td><span className="badge-red">탈퇴완료</span></td>
            <td>
              <button className="restore-btn" onClick={() => handleRestore(1, 'test_user')}>계정 복구</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawManager;