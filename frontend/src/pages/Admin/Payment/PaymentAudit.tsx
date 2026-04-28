import React, { useEffect, useState, useCallback } from 'react';
// 📍 인증 및 URL 중복 방지를 위해 apiClient 사용
import apiClient from '../../../api/axios'; 
import '../../../css/AdminPage.css';

// 1. 백엔드 AdminPaymentDto.Response 구조와 100% 일치하도록 인터페이스 수정
interface IPayment {
  payId: number;         // 기존 id -> payId
  email: string;         // 사용자 ID 대용
  reservationId: number; // 기존 reservId -> reservationId
  paymentType: string;   // 기존 method -> paymentType
  amount: number;
  createdAt: string;     // 기존 payDate -> createdAt
  status?: string;       // 백엔드 DTO에 status가 없다면 추가 확인 필요 (현재 임시 유지)
}

const PaymentAudit: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 결제 내역 로드 (백엔드 GET /api/admin/payments 연동)
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      // apiClient 사용 시 baseURL(/api)이 이미 붙어있으므로 /admin/payments로 호출
      const res = await apiClient.get('/admin/payments');
      
      const data = Array.isArray(res.data) ? res.data : res.data?.data;
      setPayments(Array.isArray(data) ? data : []);
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

  // 2. 환불 처리 핸들러 (향후 백엔드 구현 시 연동)
  const handleRefund = async (payId: number, amount: number) => {
    if (!window.confirm(`${amount.toLocaleString()}원을 환불 처리하시겠습니까?`)) return;

    try {
      // 📍 백엔드 AdminPaymentController에 환불 로직이 추가되면 아래 주소 활성화
      await apiClient.post(`/admin/payments/refund/${payId}`);
      
      alert(`[성공] ${payId}번 결제 건에 대한 환불이 완료되었습니다.`);
      fetchPayments(); // 전체 리로드
    } catch (err) {
      console.error("환불 처리 실패:", err);
      alert("환불 처리 중 오류가 발생했습니다. (백엔드 API 구현 확인 필요)");
    }
  };

  if (loading) return <div className="p-4 text-white">결제 데이터를 분석 중...</div>;

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
            <th>사용자 계정</th>
            <th>결제수단</th>
            <th>결제금액</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((pay) => (
              <tr key={pay.payId}>
                <td style={{ fontSize: '13px' }}>
                  {pay.createdAt ? new Date(pay.createdAt).toLocaleString() : '-'}
                </td>
                <td style={{ fontWeight: '500' }}>#{pay.reservationId}</td>
                <td>{pay.email}</td>
                <td>
                  <span className={`method-badge ${(pay.paymentType || 'unknown').toLowerCase()}`}>
                    {pay.paymentType}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  {pay.amount.toLocaleString()}원
                </td>
                <td>
                  {/* 백엔드 DTO에 status가 추가될 경우를 대비한 뱃지 */}
                  <span className={`status-badge ${(pay.status || 'paid').toLowerCase()}`}>
                    {pay.status === 'REFUNDED' ? '환불완료' : '결제완료'}
                  </span>
                </td>
                <td>
                  {/* 환불 로직 테스트용 (현재는 PAID 상태가 기본이라고 가정) */}
                  {pay.status !== 'REFUNDED' ? (
                    <button 
                      className="refund-btn" 
                      onClick={() => handleRefund(pay.payId, pay.amount)}
                      style={{ padding: '4px 8px', backgroundColor: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      환불
                    </button>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#aaa' }}>처리완료</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                조회된 결제 내역이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentAudit;