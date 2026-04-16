
import { Link } from 'react-router-dom';
import '../../assets/css/App.css'
import '../../assets/css/Footer.css';
import '../../assets/css/Headercss.css'
import appwindow from "../../assets/images/appwindow.png"
import logo from "../../assets/images/logo.png"



function App() {
  return (
    <div>
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


      <div className="App">
        {/* Hero Section */}
        <section className="app-hero">
          <div className="container app-hero-flex">
            <div className="hero-text">
              <span className="badge">CHARCAGE APP</span>
              <h1>충전의 시작부터 끝까지<br /><span>하나의 앱으로 간편하게</span></h1>
              <p>전국 충전소 검색부터 예약, 결제까지<br />차카지 앱 하나면 충분합니다.</p>
              <div className="download-btns">
                <a href="#" className="btn-store">
                  App Store
                </a>
                <a href="#" className="btn-store">
                  Google Play
                </a>
              </div>
            </div>
            <div className="hero-image">
              <div className="phone-mockup">

                <img src={appwindow} alt="앱 화면" />
              </div>
            </div>
          </div>
        </section>


        <section className="app-features container">
          <div className="section-title">
            <br /><br />
            <h2>주요 기능</h2>
            <div className="bar"></div>
          </div>

          <div className="feature-grid">
            <div className="feature-item">
              <div className="icon">📍</div>
              <h3>실시간 위치 기반 찾기</h3>
              <p>내 주변 가장 가까운 충전소와<br />실시간 가동 현황을 확인하세요.</p>
            </div>
            <div className="feature-item">
              <div className="icon">📅</div>
              <h3>스마트 예약 시스템</h3>
              <p>대기 시간 없이 원하는 시간에<br />미리 충전기를 예약하세요.</p>
            </div>
            <div className="feature-item">
              <div className="icon"></div>
              <h3>차카지 간편 결제 서비스</h3>
              <p>간편결제로 간단하게<br />결제하고 포인트를 적립하세요.</p>
            </div>
          </div>
        </section>
      </div>
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
  )
}

export default App;