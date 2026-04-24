import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import QuickMenu from "./Quickmenu"; // 분리된 퀵메뉴 컴포넌트 임포트
import "../css/header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      await logout();
      localStorage.removeItem('accessToken');
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

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

          {/* 햄버거 메뉴 (생략 가능) */}
          <input type="checkbox" id="menu-trigger" className="menu-trigger" />
          <label htmlFor="menu-trigger" className="menu-btn">
            <span></span><span></span><span></span>
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
                  <li><Link to="community">커뮤니티</Link></li>
                  <li><Link to="customer-center">고객센터</Link></li>
                </ul>
              </li>
            </ul>
          </nav>

          {/* 로그인/로그아웃 버튼 세션 */}
          <div className="nav-right">
            {isLoggedIn ? (
              <div className="user-info-nav">
                <span className="user-name">{user?.memberName}님</span>
                <button onClick={handleLogout} className="nav-log">logout</button>
              </div>
            ) : (
              <Link to="login" className="nav-log">login</Link>
            )}
          </div>
          <div className="header-util-space"></div>
        </div>

        {/* 메가메뉴 판넬 (구조 유지) */}
        <div className={`mega-menu-panel ${menuOpen ? "open" : ""}`}>
          <div className="panel-content">
            {/* ... 판넬 컬럼들 (기존 코드와 동일) ... */}
            <div className="panel-column"><ul><li><Link to="brand">브랜드 소개</Link></li></ul></div>
            <div className="panel-column"><ul><li><Link to="membership">충전소 찾기</Link></li></ul></div>
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

      {/* 하드코딩된 side-quick-menu 대신 컴포넌트 호출 */}
      <QuickMenu /> 
    </div>
  );
}

export default Header;