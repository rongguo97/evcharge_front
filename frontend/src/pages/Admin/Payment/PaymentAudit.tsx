import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import type { IPayment } from '../../../types/IPayment';
import '../../../css/AdminPage.css'; // 기존 스타일 유지

const PaymentAudit: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 결제 내역 로드 (백엔드 연동)
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/payments');
      
      // 공통 응답 객체 구조 대응 (res.data 혹은 res.data.data)
      const data = Array.isArray(res.data) ? res.data : res.data?.data;
      
      if (Array.isArray(data)) {
        setPayments(data);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error("결제 내역 로드 실패:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // 2. 환불 처리 핸들러 (실제 백엔드 POST/PUT 요청)
  const handleRefund = async (id: number, amount: number) => {
    if (!window.confirm(`${amount.toLocaleString()}원을 환불 처리하시겠습니까?`)) return;

    try {
      // 📍 백엔드 엔드포인트: 특정 결제 ID에 대해 환불 상태로 변경
      await axios.post(`/api/admin/payments/refund/${id}`);
      
      alert(`[성공] ${id}번 결제 건에 대한 환불이 완료되었습니다.`);
      
      // 📍 리스트 갱신: 전체를 다시 불러오거나 해당 항목만 상태 변경
      setPayments(prev => 
        prev.map(pay => pay.id === id ? { ...pay, status: 'REFUNDED' } : pay)
      );
    } catch (err) {
      console.error("환불 처리 실패:", err);
      alert("환불 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) return <div className="p-4 text-white">결제 내역을 불러오는 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>결제 내역 감사</h3>
          <div className="table-summary" style={{ color: '#888', marginBottom: '15px' }}>
            총 결제 건수: <strong>{payments.length}</strong>건
          </div>
        </div>
        <button onClick={fetchPayments} className="refresh-btn">내역 새로고침</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>결제일시</th>
            <th>예약번호</th>
            <th>사용자</th>
            <th>결제수단</th>
            <th>결제금액</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((pay) => (
              <tr key={pay.id}>
                <td style={{ fontSize: '13px' }}>
                  {pay.payDate ? new Date(pay.payDate).toLocaleString() : '-'}
                </td>
                <td style={{ fontWeight: '500' }}>{pay.reservId}</td>
                <td>{pay.userName}({pay.userId})</td>
                <td>
                  <span className={`method-badge ${(pay.method || 'unknown').toLowerCase()}`}>
                    {pay.method}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  {pay.amount.toLocaleString()}원
                </td>
                <td>
                  {/* 상태값에 따른 뱃지 처리 */}
                  <span className={`status-badge ${(pay.status || 'unknown').toLowerCase()}`}>
                    {pay.status === 'PAID' ? '결제완료' : pay.status === 'REFUNDED' ? '환불완료' : '취소됨'}
                  </span>
                </td>
                <td>
                  {/* 결제 완료 상태인 경우에만 환불 버튼 노출 */}
                  {pay.status === 'PAID' ? (
                    <button 
                      className="refund-btn" 
                      onClick={() => handleRefund(pay.id, pay.amount)}
                      style={{ padding: '4px 8px', backgroundColor: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      환불
                    </button>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#aaa' }}>-</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                결제 내역이 존재하지 않습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentAudit;