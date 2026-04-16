import React from 'react';
import '../../assets/css/Footer.css'
import '../../assets/css/Headercss.css'
import '../../assets/css/cash.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

interface PricePlan {
  type: 'FAST' | 'SLOW';
  title: string;
  basePrice: number;
  memberPrice: string;
  nightPrice: string;
  competitors: { name: string; price: number }[];
  isHighlight?: boolean;
}

const PriceCard: React.FC<PricePlan> = ({ type, title, basePrice, memberPrice, nightPrice, competitors, isHighlight }) => (
  <div className={`price-card ${isHighlight ? 'highlight' : ''}`}>
    <div className="card-badge">{type}</div>
    <h3><span className="cw">{title}</span></h3>
    <br />
    <div className="main-amount">{basePrice}<span>원/kWh</span></div>
    <div className="detail-box">
      <div className="detail-row"><span>차카지 회원</span><strong>💜 {memberPrice}</strong></div>
      <div className="detail-row"><span>심야 할인</span><strong className="purple-text">{nightPrice}</strong></div>
      <br />
      <h2 className="text-PP">요금 비교 해보기 🔎</h2><br />
      {competitors.map((comp, idx) => (
        <p key={idx} className="text-P">{comp.name} &nbsp;&nbsp; {comp.price}원</p>
      ))}
    </div>
  </div>
);

const Pricing: React.FC = () => {
  const plans: PricePlan[] = [
    {
      type: 'FAST',
      title: '급속 충전 요금',
      basePrice: 450,
      memberPrice: '320원',
      nightPrice: '290원',
      competitors: [
        { name: 'A사', price: 450 },
        { name: 'B사', price: 480 },
        { name: 'C사', price: 475 },
        { name: 'D사', price: 460 },
        { name: 'E사', price: 450 },
      ]
    },
    {
      type: 'SLOW',
      title: '완속 충전 요금',
      basePrice: 250,
      memberPrice: '190원',
      nightPrice: '150원',
      isHighlight: true,
      competitors: [
        { name: 'A사', price: 250 },
        { name: 'B사', price: 275 },
        { name: 'C사', price: 250 },
        { name: 'D사', price: 280 },
        { name: 'E사', price: 260 },
      ]
    }
  ];

  return (
    <>
      <header className="main-header">
        <div className="container nav-wrapper">
          <div className="logo">CHACARGE</div>


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

      <div className="pricing-page">
        <section className="hero-section">
          <div className="container">
            <div className="hero-text">
              <br /><br />
              <p className="sub-title">Save time. Reserve your charge</p>
              <h1>친환경 이동을 더 똑똑하게<br /><span>차카지 충전 요금 안내</span></h1>
              <h3>복잡한 요금제는 잊으세요. 차카지는 합리적입니다.</h3>
              <br />
              <h3>
                <span className="cpp">차카지 회원</span>은 <span className="cpk">더 저렴하게</span> 이용가능합니다.
                <br />
                <span className="cpk">급속, 완속</span> 요금제 확인하고 <span className="cpk">심야</span> 요금까지 확인하세요.
              </h3>
            </div>
          </div>
        </section>
        <br /><br />
        <main className="container price-content">
          <div className="price-grid">
            {plans.map((plan, index) => (
              <PriceCard key={index} {...plan} />
            ))}
          </div>
        </main>
        <br /><br />
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
    </>
  );
};

export default Pricing;