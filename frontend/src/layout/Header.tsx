import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import QuickMenu from "./Quickmenu"; 
import "../css/header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      try {
        await logout();
        alert("로그아웃 되었습니다.");
        navigate("/main/door");
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
          <div className="logo">
            <Link to="/main" style={{ textDecoration: "none", color: "inherit" }}>
              CHARCARGE
            </Link>
          </div>

          <input type="checkbox" id="menu-trigger" className="menu-trigger" />
          <label htmlFor="menu-trigger" className="menu-btn">
            <span></span><span></span><span></span>
          </label>

          <nav className="gnb">
            <ul className="main-menu">
              <li>
                <Link to="/main/brand">CHARCAGE</Link>
                <ul className="mobile-only-sub">
                  <li><Link to="/main/brand">브랜드 소개</Link></li>
                </ul>
              </li>
              <li>
                {/* 라우터 설정에 따라 reservation 혹은 membership으로 맞추세요 */}
                <Link to="/main/reservation">충전소 예약</Link>
                <ul className="mobile-only-sub">
                  <li><Link to="/main/reservation">충전소 예약</Link></li>
                </ul>
              </li>
              <li>
                <a href="#">서비스</a>
                <ul className="mobile-only-sub">
                  {/* 📍 여기 중요: 모두 /main/ 을 붙였습니다. */}
                  <li><Link to="/main/pay">지갑 충전하기</Link></li>
                  <li><Link to="/main/cash">요금 알아보기</Link></li>
                  <li><Link to="/main/app">APP 소개</Link></li>
                </ul>
              </li>
              <li>
                <a href="#">고객지원</a>
                <ul className="mobile-only-sub">
                  <li><Link to="/main/notice">공지사항</Link></li>
                  <li><Link to="/main/faq">자주묻는질문</Link></li>
                  <li><Link to="/main/community">커뮤니티</Link></li>
                  <li><Link to="/main/customer-center">고객센터</Link></li>
                  <li><Link to="/main/door">로그인</Link></li>
                </ul>
              </li>
            </ul>
          </nav>

          <div className="nav-right">
            {isLoggedIn ? (
              <div className="user-info-nav">
                <span className="user-name"><strong>{user?.memberName || user?.name || user?.username || '사용자'}</strong>님</span>
                <button onClick={handleLogout} className="nav-log">log</button>
              </div>
            ) : (
              <Link to= "/main/login" className="nav-log">log</Link>
            )}
          </div>
          <div className="header-util-space"></div>
        </div>

        {/* 메가메뉴 판넬 부분도 똑같이 수정 */}
        <div className={`mega-menu-panel ${menuOpen ? "open" : ""}`}>
          <div className="panel-content">
            <div className="panel-column">
              <ul><li><Link to="/main/brand">브랜드 소개</Link></li></ul>
            </div>
            <div className="panel-column">
              <ul><li><Link to="/main/reservation">충전소 찾기</Link></li></ul>
            </div>
            <div className="panel-column">
              <ul>
                <li><Link to="/main/pay">지갑 충전하기</Link></li>
                <li><Link to="/main/cash">요금 알아보기</Link></li>
                <li><Link to="/main/app">APP 소개</Link></li>
              </ul>
            </div>
            <div className="panel-column">
              <ul>
                <li><Link to="/main/notice">공지사항</Link></li>
                <li><Link to="/main/faq">자주묻는질문</Link></li>
                <li><Link to="/main/community">커뮤니티</Link></li>
                <li><Link to="/main/customer-center">고객센터</Link></li>
               
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