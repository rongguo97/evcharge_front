import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "../css/header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // 💡 AuthContext에 추가한 logout 함수를 호출합니다.
    if (logout) {
      await logout();
      localStorage.removeItem('accessToken'); // JWT 토큰도 삭제
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  return (
    <header
      className="main-header"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <div className="container nav-wrapper">
        <div className="logo">
          <Link to="/main" style={{ textDecoration: "none", color: "inherit" }}>
            CHARCAGE
          </Link>
        </div>

        <input type="checkbox" id="menu-trigger" className="menu-trigger" />
        <label htmlFor="menu-trigger" className="menu-btn">
          <span></span><span></span><span></span>
        </label>

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

        <div className="nav-right">
          {/* 로그인 상태에 따라 이름과 로그아웃 버튼 노출 */}
          {isLoggedIn ? (
            <div className="user-info-nav">
              <span className="user-name" style={{ marginRight: '10px', color: '#333' }}>
                {user?.memberName || '사용자'}님
              </span>
              <button onClick={handleLogout} className="nav-log" style={{ cursor: 'pointer' }}>
                logout
              </button>
            </div>
          ) : (
            <Link to="login" className="nav-log">login</Link>
          )}
        </div>
        <div className="header-util-space"></div>
      </div>

      <div className={`mega-menu-panel ${menuOpen ? "open" : ""}`}>
        <div className="panel-content">
          <div className="panel-column">
            <ul><li><Link to="brand">브랜드 소개</Link></li></ul>
          </div>
          <div className="panel-column">
            <ul><li><Link to="membership">충전소 찾기</Link></li></ul>
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
  );
}

export default Header;