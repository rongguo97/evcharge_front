import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/header.css";
import { useAuth } from '../context/AuthContext';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

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

          {/* 로그인 상태에 따른 조건부 렌더링: 동일한 디자인 적용 */}
          {/* 로그인 상태에 따른 조건부 렌더링: 디자인 교정 버전 */}
          <div className="nav-right" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' // 버튼 사이 간격
          }}>
            {isLoggedIn && user ? (
              <>
                {/* 사용자 이름 표시: 너비를 자동으로 조절하고 한 줄로 유지 */}
                <span className="nav-log" style={{ 
                  cursor: 'default', 
                  width: 'auto',          // 고정 너비 해제
                  minWidth: 'fit-content', // 내용물에 맞춤
                  padding: '0 12px',      // 좌우 여백 추가
                  whiteSpace: 'nowrap',   // 줄바꿈 방지
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '20px'    // 알약 모양으로 예쁘게
                }}>
                  {user.memberName}님
                </span>

                {/* 로그아웃 버튼: out 텍스트에 맞게 너비 조절 */}
                <span className="nav-log" onClick={logout} style={{ 
                  cursor: 'pointer', 
                  width: 'auto',
                  minWidth: '50px',
                  padding: '0 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '20px'
                }}>
                  out
                </span>
              </>
            ) : (
              <Link to="login" className="nav-log">log</Link>
            )}
          </div>

          <div className="header-util-space"></div>
        </div>

        {/* 메가메뉴 (생략 - 기존 코드와 동일) */}
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

      {/* 사이드 퀵메뉴 (생략 - 기존 코드와 동일) */}
      <aside className="side-quick-menu">
        <Link to="mypage" className="quick-btn my-page">마 이 페 이 지</Link>
        <Link to="adminpage" className="quick-btn admin-page">관 리 자 페 이 지</Link>
      </aside>
    </div>
  );
}

export default Header;