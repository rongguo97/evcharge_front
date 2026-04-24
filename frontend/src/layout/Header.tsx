import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import QuickMenu from "./Quickmenu"; 
import "../css/header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth(); // Context에서 logout 가져옴
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      try {
        await logout(); // AuthContext의 로그아웃 로직 실행
        // localStorage.removeItem('accessToken'); // 보통 logout 함수 내부에 포함시키는 것이 좋으나, 확실히 하기 위해 유지
        alert("로그아웃 되었습니다.");
        navigate("/");
      } catch (error) {
        console.error("로그아웃 중 오류 발생:", error);
      }
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
          {/* 1. 로고 */}
          <div className="logo">
            <Link to="/main" style={{ textDecoration: "none", color: "inherit" }}>
              CHARCAGE
            </Link>
          </div>

          {/* 2. 햄버거 메뉴 (모바일 전용) */}
          <input type="checkbox" id="menu-trigger" className="menu-trigger" />
          <label htmlFor="menu-trigger" className="menu-btn">
            <span></span><span></span><span></span>
          </label>

          {/* 3. GNB (메인 네비게이션) */}
          <nav className="gnb">
            <ul className="main-menu">
              <li>
                <Link to="/brand">CHARCAGE</Link>
                <ul className="mobile-only-sub">
                  <li><Link to="/brand">브랜드 소개</Link></li>
                </ul>
              </li>
              <li>
                <Link to="/membership">충전소 찾기</Link>
                <ul className="mobile-only-sub">
                  <li><Link to="/membership">충전소 찾기</Link></li>
                </ul>
              </li>
              <li>
                <a href="#">서비스</a>
                <ul className="mobile-only-sub">
                  <li><Link to="/pay">지갑 충전하기</Link></li>
                  <li><Link to="/cash">요금 알아보기</Link></li>
                  <li><Link to="/app">APP 소개</Link></li>
                </ul>
              </li>
              <li>
                <a href="#">고객지원</a>
                <ul className="mobile-only-sub">
                  <li><Link to="/notice">공지사항</Link></li>
                  <li><Link to="/faq">자주묻는질문</Link></li>
                  <li><Link to="/community">커뮤니티</Link></li>
                  <li><Link to="/customer-center">고객센터</Link></li>
                </ul>
              </li>
            </ul>
          </nav>

          {/* 4. 로그인/로그아웃 버튼 (우측 상단) */}
          <div className="nav-right">
            {isLoggedIn ? (
              <div className="user-info-nav">
                <span className="user-name"><strong>{user?.memberName || '사용자'}</strong>님</span>
                <button onClick={handleLogout} className="nav-log">logout</button>
              </div>
            ) : (
              // 로그인 페이지가 "/" 라면 "/"로 설정
              <Link to="/" className="nav-log">login</Link>
            )}
          </div>
          <div className="header-util-space"></div>
        </div>

        {/* 5. 메가메뉴 판넬 */}
        <div className={`mega-menu-panel ${menuOpen ? "open" : ""}`}>
          <div className="panel-content">
            <div className="panel-column">
              <ul><li><Link to="/brand">브랜드 소개</Link></li></ul>
            </div>
            <div className="panel-column">
              <ul><li><Link to="/membership">충전소 찾기</Link></li></ul>
            </div>
            <div className="panel-column">
              <ul>
                <li><Link to="/pay">지갑 충전하기</Link></li>
                <li><Link to="/cash">요금 알아보기</Link></li>
                <li><Link to="/app">APP 소개</Link></li>
              </ul>
            </div>
            <div className="panel-column">
              <ul>
                <li><Link to="/notice">공지사항</Link></li>
                <li><Link to="/faq">자주묻는질문</Link></li>
                <li><Link to="/community">커뮤니티</Link></li>
                <li><Link to="/customer-center">고객센터</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="menu-overlay"></div>
      </header>

      <QuickMenu /> 
    </div>
  );
}

export default Header;