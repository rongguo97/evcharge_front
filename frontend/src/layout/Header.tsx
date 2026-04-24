  import { useState } from "react";
  import { Link } from "react-router-dom";
  import "../css/header.css";
  import { useAuth } from "../context/AuthContext"; // 1. useAuth 임포트

  function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, isLoggedIn, logout } = useAuth(); // 2. 로그인 정보 및 로그아웃 함수 가져오기

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
              <Link to="/main" style={{ textDecoration: "none", color: "inherit" }}>
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
                    <li><Link to="reservation">충전소 찾기</Link></li>
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
                    <li><Link to="community">커뮤니티</Link></li>
                    <li><Link to="customer-center">고객센터</Link></li>
                    
                    {/* 모바일 메뉴 로그인/로그아웃 대응 */}
                    <li className="mobile-login-item">
                      {isLoggedIn ? (
                        <span onClick={logout} style={{cursor:'pointer'}}>로그아웃</span>
                      ) : (
                        <Link to="login">로그인</Link>
                      )}
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>

            {/* 3. 로그인/로그아웃 버튼 (우측 상단) */}
            <div className="nav-right">
              {isLoggedIn ? (
                <div className="user-info-area" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span className="user-name" style={{ fontSize: '14px', color: '#333' }}>
                    <strong>{user?.memberName || '사용자'}</strong>님
                  </span>
                  <button 
                    onClick={logout} 
                    className="nav-log" 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="login" className="nav-log">
                  log
                </Link>
              )}
            </div>

            <div className="header-util-space"></div>
          </div>

          {/* 메가메뉴 */}
          <div className={`mega-menu-panel ${menuOpen ? "open" : ""}`}>
            <div className="panel-content">
              <div className="panel-column">
                <ul><li><Link to="brand">브랜드 소개</Link></li></ul>
              </div>
              <div className="panel-column">
                <ul><li><Link to="reservation">충전소 찾기</Link></li></ul>
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