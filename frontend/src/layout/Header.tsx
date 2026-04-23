import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <header
        className="main-header"
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <div className="container nav-wrapper">

          {/* 로고 */}
          <div className="logo">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              CHARCAGE
            </Link>
          </div>

          {/* 햄버거 (모바일) */}
          <input type="checkbox" id="menu-trigger" className="menu-trigger" />
          <label htmlFor="menu-trigger" className="menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </label>

          {/* GNB */}
          <nav className="gnb">
            <ul className="main-menu">
              <li>
                <a href="#">CHARCAGE</a>
                <ul className="mobile-only-sub">
                  <li><Link to="brand">브랜드 소개</Link></li>
                </ul>
              </li>
              <li>
                <a href="#">충전소 찾기</a>
                <ul className="mobile-only-sub">
                  <li><Link to="membership">충전소 찾기</Link></li>                 
                </ul>
              </li>
              <li>
                <a href="#">서비스</a>
                <ul className="mobile-only-sub">
                  <li><Link to="pay">지갑 충전하기</Link></li>
                  <li><Link to="cash">요금 알아보기</Link></li>
                  <li><Link to="app">APP 소개</Link></li>
                </ul>
              </li>
              <li>
                <a href="#">고객지원</a>
                <ul className="mobile-only-sub">
                  <li><Link to="notice">공지사항</Link></li>
                  <li><Link to="faq">자주묻는질문</Link></li>
                  <li><Link to="communication">커뮤니티</Link></li>
                  <li><Link to="customer-center">고객센터</Link></li>
                </ul>
              </li>
            </ul>
          </nav>

          {/* 로그인 */}
          <div className="nav-right">
            <Link to="login" className="nav-log">log</Link>
          </div>

          <div className="header-util-space"></div>
        </div>

        {/* ✅ 메가메뉴: open 클래스로 제어 */}
        <div className={`mega-menu-panel ${menuOpen ? "open" : ""}`}>
          <div className="panel-content">
            <div className="panel-column">
              <ul>
                <li><Link to="brand">브랜드 소개</Link></li>
              </ul>
            </div>
            <div className="panel-column">
              <ul>
                <li><Link to="membership">충전소 찾기</Link></li>              
              </ul>
            </div>
            <div className="panel-column">
              <ul>
                <li><Link to="pay">지갑 충전하기</Link></li>
                <li><Link to="cash">요금 알아보기</Link></li>
                <li><Link to="app">APP 소개</Link></li>
              </ul>
            </div>
            <div className="panel-column">
              <ul>
                <li><Link to="notice">공지사항</Link></li>
                <li><Link to="faq">자주묻는질문</Link></li>
                <li><Link to="community">커뮤니티</Link></li>
                <li><Link to="customer-center">고객센터</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="menu-overlay"></div>
      </header>

      {/* 사이드 퀵메뉴 */}
      <aside className="side-quick-menu">
        <Link to="mypage" className="quick-btn my-page">마 이 페 이 지</Link>
        <Link to="adminpage" className="quick-btn admin-page">관 리 자 페 이 지</Link>
      </aside>
    </div>
  );
}

export default Header;