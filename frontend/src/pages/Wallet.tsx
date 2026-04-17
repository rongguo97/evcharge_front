import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/wallet.css';
import '../css/header.css';
import '../css/footer.css';

const Pay: React.FC = () => {
  const navigate = useNavigate();

  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [point, setPoint] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<string>("kakao");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const myTotalPoint = 20000;
  const amounts = [10000, 20000, 30000, 50000];

  const currentTotal = selectedAmount || Number(customAmount) || 0;

  // 보완: 포인트가 결제 금액보다 크지 않도록 제한
  const finalPrice = Math.max(0, currentTotal - point);

  const savedPoint = Math.floor(finalPrice * 0.1);

  const handlePayment = () => {
    if (currentTotal <= 0) {
      alert("충전 금액을 선택하거나 입력해주세요.");
      return;
    }
    setIsCompleted(true);
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

          <button className="go-main-btn" onClick={() => navigate('/')}>
            메인으로 돌아가기
          </button>
        </div>
        <div className="footer-spacer"></div>
      </div>
    );
  }

  return (
    <div>


      <aside className="side-quick-menu">
        <Link to="/mypage" className="quick-btn my-page">
          마 이 페 이 지
        </Link>

        <Link to="#" className="quick-btn admin-page">
          관 리 자 페 이 지
        </Link>
      </aside>

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
                  onClick={() => { setSelectedAmount(amt); setCustomAmount(""); setPoint(0); }} // 금액 변경 시 포인트 초기화 권장
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
            </div>
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
        <div className="footer-spacer">

        </div>
      </div>

      
    </div>


  );
};

export default Pay;