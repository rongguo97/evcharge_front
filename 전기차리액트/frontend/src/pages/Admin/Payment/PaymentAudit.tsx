import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { IPayment } from '../../../types/IPayment';

const PaymentAudit: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('/api/admin/payments');
        if (Array.isArray(res.data)) {
          setPayments(res.data);
        }
      } catch (err) {
        console.error("결제 내역 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // 환불 처리 핸들러 (환불 처리 탭으로 연결하거나 직접 처리)
  const handleRefund = (id: number, amount: number) => {
    if (window.confirm(`${amount.toLocaleString()}원을 환불 처리하시겠습니까?`)) {
      alert(`${id}번 결제 건에 대한 환불 요청이 접수되었습니다.`);
      // 실제 구현 시: axios.post(`/api/admin/payments/refund/${id}`)
    }
  };

  if (loading) return <div className="p-4 text-white">결제 내역을 불러오는 중...</div>;

  return (
    <div className="admin-card">
      <div className="table-header">
        <h3>결제 내역 감사</h3>
        <div className="table-summary" style={{ color: '#888', marginBottom: '15px' }}>
          총 결제 건수: <strong>{payments.length}</strong>건
        </div>
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
                <td style={{ fontSize: '13px' }}>{pay.payDate}</td>
                <td style={{ fontWeight: '500' }}>{pay.reservId}</td>
                <td>{pay.userName}({pay.userId})</td>
                <td>
                  <span className={`method-badge ${pay.method.toLowerCase()}`}>
                    {pay.method}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  {pay.amount.toLocaleString()}원
                </td>
                <td>
                  <span className={`status-badge ${pay.status.toLowerCase()}`}>
                    {pay.status === 'PAID' ? '결제완료' : pay.status === 'REFUNDED' ? '환불완료' : '취소됨'}
                  </span>
                </td>
                <td>
                  {pay.status === 'PAID' && (
                    <button className="refund-btn" onClick={() => handleRefund(pay.id, pay.amount)}>
                      환불
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>결제 내역이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentAudit;