import React, { useState, useEffect } from 'react'; // 📍 useEffect 추가
import { useNavigate } from 'react-router-dom';
import WalletService from '../services/WalletService'; 
import '../css/wallet.css';
import '../css/header.css';
import '../css/footer.css';

const Wallet: React.FC = () => {
  const navigate = useNavigate();

  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [point, setPoint] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<string>("kakao");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // 📍 [변경] 고정값이 아니라 상태값으로 관리
  const [myTotalPoint, setMyTotalPoint] = useState<number>(0); 
  const amounts = [10000, 20000, 30000, 50000];

  const currentTotal = selectedAmount || Number(customAmount) || 0;
  const finalPrice = Math.max(0, currentTotal - point);
  const savedPoint = Math.floor(finalPrice * 0.1);

  // 📍 1. 페이지 로드 시 실제 내 포인트 가져오기
  useEffect(() => {
    const fetchPoint = async () => {
      try {
        const res = await WalletService.getMyWallet();
        if (res.data.success) {
          setMyTotalPoint(res.data.result.point); // 서버에서 받은 진짜 포인트 세팅
        }
      } catch (e) {
        console.error("포인트 정보를 가져오는데 실패했습니다.", e);
      }
    };
    fetchPoint();
  }, []);

  // 📍 2. 결제 버튼 클릭 시 실행되는 서버 연동 로직
  const handlePayment = async () => {
    if (currentTotal <= 0) {
      alert("충전 금액을 선택하거나 입력해주세요.");
      return;
    }

    try {
      // 서버에 "충전할 금액"을 보냅니다.
      // (참고: 백엔드 로직에 따라 currentTotal 혹은 finalPrice 중 무엇을 보낼지 결정합니다. 
      // 여기서는 유저가 선택한 원금인 currentTotal을 충전한다고 가정합니다.)
      const response = await WalletService.chargeWallet(currentTotal);

      if (response.data.success) {
        setIsCompleted(true); // 성공 시 완료 화면으로 전환
      }
    } catch (error: any) {
      console.error("충전 실패:", error);
      if (error.response?.status === 403) {
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        alert("결제 처리 중 오류가 발생했습니다.");
      }
    }
  };

  if (isCompleted) {
    return (
      <div className="payment-page-bg">
        <div className="header-spacer"></div>
        <div className="payment-container completed-box">
          <div className="status-icon">✔️</div>
          <h2 className="complete-title">결제가 완료되었습니다</h2>
          <p className="complete-desc">포인트 10% 적립완료</p>

          <div className="receipt-box large">
            <div className="receipt-row">
              <span>충전 금액</span>
              <span>{currentTotal.toLocaleString()}원</span>
            </div>
            <div className="receipt-row">
              <span>포인트 사용</span>
              <span className="used-point">-{point.toLocaleString()}P</span>
            </div>
            <div className="receipt-row total-row">
              <span>최종 결제 금액</span>
              <span className="final-amt">{finalPrice.toLocaleString()}원</span>
            </div>

            <div className="point-reward-card">
              <div className="reward-label">적립된 포인트</div>
              <div className="reward-value">
                <strong>{savedPoint.toLocaleString()}P</strong> 적립
              </div>
              <p className="reward-info">현금처럼 결제 시 사용하세요</p>
            </div>
          </div>

          <button className="go-main-btn" onClick={() => navigate('/main')}>
            메인으로 돌아가기
          </button>
        </div>
        <div className="footer-spacer"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="payment-page-bg">
        <div className="header-spacer"></div>
        <div className="payment-container">
          <h2 className="title">차카지 간편결제</h2>
          <section className="section">
            <label className="section-label">금액 선택</label>
            <div className="amount-grid">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  className={`amount-btn ${selectedAmount === amt ? 'active' : ''}`}
                  onClick={() => { setSelectedAmount(amt); setCustomAmount(""); setPoint(0); }}
                >
                  {amt.toLocaleString()}원
                </button>
              ))}
            </div>
            <input
              type="number"
              className="custom-input no-spinner"
              placeholder="직접 입력하기 (원)"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); setPoint(0); }}
            />
          </section>
          <br /><br />
          <section className="section">
            <div className="flex-between">
              <label className="section-label">포인트 사용</label>
              <span className="my-point">보유 {myTotalPoint.toLocaleString()}P</span>
            </div>
            <div className="point-input-wrapper">
              <input
                type="number"
                className="no-spinner"
                value={point || ""}
                onChange={(e) => setPoint(Math.min(currentTotal, myTotalPoint, Number(e.target.value)))}
                placeholder="0"
              />
              <button className="all-use-btn" onClick={() => setPoint(Math.min(currentTotal, myTotalPoint))}>
                전액사용
              </button>
            </div>
          </section>
          <br /><br />
          <section className="section">
            <label className="section-label">간편결제 선택</label>
            <div className="pay-methods">
              <button className={`pay-btn ${payMethod === 'kakao' ? 'active kakao' : ''}`} onClick={() => setPayMethod('kakao')}>카카오페이</button>
              <button className={`pay-btn ${payMethod === 'toss' ? 'active toss' : ''}`} onClick={() => setPayMethod('toss')}>토스페이</button>
              <button className={`pay-btn ${payMethod === 'naver' ? 'active naver' : ''}`} onClick={() => setPayMethod('naver')}>네이버페이</button>
            </div><br /><br /><br /><br />
          </section>

          <div className="bottom-sticky">
            <div className="price-summary">
              <span className="summary-label">최종 결제 금액   </span>
              <span className="total-price">{finalPrice.toLocaleString()}원</span>
            </div>
            <button className="pay-submit-btn" onClick={handlePayment}>
              {finalPrice.toLocaleString()}원 결제하기
            </button>
          </div>
        </div>
        <div className="footer-spacer"></div>
      </div>
    </div>
  );
};

export default Wallet;