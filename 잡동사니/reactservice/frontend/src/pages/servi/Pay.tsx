import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/wellet.css';
import '../../assets/css/Headercss.css';
import '../../assets/css/Footer.css';
import logo from '../../assets/images/logo.png';

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
      <header className="main-header">
        <div className="container nav-wrapper">
          <div className="logo">CHACARGE</div>

          {/* 체크박스와 라벨의 연결은 htmlFor를 사용합니다 */}
          <input type="checkbox" id="menu-trigger" className="menu-trigger" />
          <label htmlFor="menu-trigger" className="menu-btn">
            <span></span><span></span><span></span>
          </label>

          <nav className="gnb">
            <ul className="main-menu">
              <li>
                <a href="#">CHACARGE</a>
                <ul className="mobile-only-sub">
                  <li><a href="#">브랜드 소개</a></li>
                  <li><Link to="membership">회원가입</Link></li>
                </ul>
              </li>
              <li>
                <a href="#">충전소 찾기</a>
                <ul className="mobile-only-sub">
                  <li><a href="#">충전소 찾기</a></li>
                  <li><a href="#">충전소 종류</a></li>
                </ul>
              </li>
              <li>
                <a href="#" className="active">서비스</a>
                <ul className="mobile-only-sub">
                  <li><Link to="/pay">지갑 충전하기</Link></li>
                  <li><Link to="/cash">요금 알아보기</Link></li>
                  <li><Link to="/app">APP 소개</Link></li>
                </ul>
              </li>
              <li>
                <a href="#">고객지원</a>
                <ul className="mobile-only-sub">
                  <li><a href="#">공지사항</a></li>
                  <li><a href="#">FAQ</a></li>
                  <li><a href="#">뉴스</a></li>
                  <li><a href="#">고객센터</a></li>
                </ul>
              </li>

            </ul>

            <div className="mega-menu-panel">
              <div className="panel-content">
                <div className="panel-column"><ul><li><a href="#">브랜드 소개</a></li><li><Link to="membership">회원가입</Link></li></ul></div>
                <div className="panel-column"><ul><li><a href="#">충전소 찾기</a></li><li><a href="#">충전소 종류</a></li></ul></div>
                <div className="panel-column"><ul><li><Link to="/pay">지갑 충전하기</Link></li><li><Link to="/cash">요금 알아보기</Link></li><li><Link to="/app">APP 소개</Link></li></ul></div>
                <div className="panel-column"><ul><li><a href="#">공지사항</a></li><li><a href="#">FAQ</a></li><li><a href="#">뉴스</a></li><li><a href="#">고객센터</a></li></ul></div>

              </div>
            </div>
          </nav>
          <div className="header-util-space"></div>
        </div>
        <div className="menu-overlay"></div>
      </header>


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

      <footer className="white-footer">
        <div className="container footer-flex">
          <div className="footer-logo">
            <img src={logo} alt="차카지 로고" />
          </div>
          <div className="footer-info">
            <p>회사이름 : 차카지</p>
            <p>대표이사 : 이팀이지</p>
            <p>사업자번호 : 123-45-67890</p>
            <p>주소 : 부산광역시 진구 범내골로</p>
            <p>E-mail : help00charcage.com</p>
            <p className="copy">&copy; 2026 CHARCAGE. All Rights Reserved.</p>
          </div>
          <div className="footer-contact">
            <p>영업 및 협력문의 <strong>1577-1234</strong></p>
            <p>비즈니스 투자문의 <strong>1577-1234</strong></p>
            <p>고객센터 <strong>1577-1234</strong></p>
          </div>
        </div>
      </footer>
    </div>


  );
};

export default Pay;