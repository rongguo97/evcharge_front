import React, { useState, useRef } from 'react';
import '../css/wallet.css'; // 기존 wallet.css 내용을 이쪽으로 옮겨주세요.

const Wallet: React.FC = () => {
  // --- 상태 관리 (State) ---
  const MY_POINTS = 20000; // 실제로는 API 등에서 받아올 값
  const [chargeAmount, setChargeAmount] = useState<number>(100000);
  const [usePoint, setUsePoint] = useState<number>(0);
  const [showBank, setShowBank] = useState<boolean>(false);
  const [copyText, setCopyText] = useState<string>("계좌 복사");
  
  const bankDetailRef = useRef<HTMLDivElement>(null);

  // --- 로직 함수 ---

  // 금액 버튼 클릭 시
  const handleSelectAmt = (value: number) => {
    setChargeAmount(value);
    setShowBank(false); // 금액 변경 시 계좌 정보 숨김 (선택사항)
  };

  // 직접 입력 시
  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setChargeAmount(value);
  };

  // 포인트 입력 시
  const handlePointInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value) || 0;
    if (value > MY_POINTS) value = MY_POINTS;
    setUsePoint(value);
  };

  // 전액 사용
  const handleUseAllPoints = () => {
    setUsePoint(MY_POINTS);
  };

  // 계산된 값들
  const bonus = Math.floor(chargeAmount * 0.1);
  const finalPrice = Math.max(0, chargeAmount - usePoint);
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() + 1);

  // 충전하기 버튼 클릭
  const handleShowBankDetail = () => {
    setShowBank(true);
    // 상태 변경 후 렌더링이 완료된 뒤 스크롤 이동
    setTimeout(() => {
      bankDetailRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 계좌 복사
  const handleCopyAccount = () => {
    const accNum = "1234-123-456789";
    navigator.clipboard.writeText(accNum).then(() => {
      alert("계좌번호가 복사되었습니다!");
      setCopyText("복사완료!");
      setTimeout(() => setCopyText("계좌 복사"), 2000);
    });
  };

  return (
    <main className="payment-wrapper">
      <div className="payment-bg-overlay"></div>

      <section className="payment-content">
        <div className="payment-header-text">
          <h2>Charging Wallet</h2>
          <br />
          <p>충전 금액의 10%를 포인트로 돌려드려요!</p>
          <p>행복한 드라이브 되세요.</p>
        </div>
        <br />

        <div className="glass-card status-card">
          <div className="status-box-item">
            <span className="status-label">보유 충전금</span>
            <div className="status-value-group">
              <span className="status-value">0</span>
              <span className="status-unit">원</span>
            </div>
          </div>
          <div className="status-v-line"></div>
          <div className="status-box-item">
            <span className="status-label">포인트 잔액</span>
            <div className="status-value-group">
              <span className="status-value purple">{MY_POINTS.toLocaleString()}</span>
              <span className="status-unit">P</span>
            </div>
          </div>
        </div>

        <div className="glass-card payment-main-card">
          <div className="payment-group center-align">
            <label className="group-title">충전 금액 선택</label>
            <div className="amount-grid">
              {[10000, 30000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className={`amt-btn ${chargeAmount === amt ? 'active' : ''}`}
                  onClick={() => handleSelectAmt(amt)}
                >
                  {amt.toLocaleString()}원
                </button>
              ))}
            </div>
            <br />
            <div className="input-wrapper center-input">
              <input
                type="number"
                className="no-spin"
                value={chargeAmount === 0 ? '' : chargeAmount}
                placeholder="직접 금액 입력"
                onChange={handleManualInput}
              />
            </div>
          </div>

          <div className="calc-section">
            <div className="calc-row bonus">
              <span>적립 예정 보너스 (10%)</span>
              <span>{bonus.toLocaleString()} P</span>
            </div>

            <div className="calc-row use-point-row">
              <label className="group-title">
                보유 포인트 사용 <small>(잔액: {MY_POINTS.toLocaleString()} P)</small>
              </label>
              <div className="point-input-container">
                <input
                  type="number"
                  className="no-spin"
                  placeholder="0"
                  value={usePoint === 0 ? '' : usePoint}
                  onChange={handlePointInput}
                />
                <button type="button" className="inline-use-all-btn" onClick={handleUseAllPoints}>
                  전액사용
                </button>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="final-summary center-align">
            <div className="summary-item">
              <span>최종 입금액</span>
              <h3>{finalPrice.toLocaleString()}원</h3>
            </div>
            <button type="button" className="pay-submit-btn" onClick={handleShowBankDetail}>
              {finalPrice <= 0 ? "포인트로 결제하기" : "충전하기"}
            </button>
          </div>

          {showBank && (
            <div ref={bankDetailRef} className="bank-info-panel">
              <div className="bank-card">
                <p className="bank-name">차카지은행 <span>(주)차카지</span></p>
                <p className="bank-account">1234-123-456789</p>
                <div className="bank-footer">
                  <span>입금 기한: <strong>{limitDate.toLocaleDateString()} 23:59</strong></span>
                  <button type="button" className="premium-copy-btn" onClick={handleCopyAccount}>
                    {copyText}
                  </button>
                </div>
              </div>
              <p className="bank-notice">※ 입금자명과 회원명이 일치해야 빠른 처리가 가능합니다.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Wallet;