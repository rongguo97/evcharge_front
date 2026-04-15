import { Link, useLocation } from "react-router-dom"; // 페이지 이동을 위해 Link 사용 권장
import "../css/main.css";

const Header = () => {

  const location = useLocation();

  // 1. 헤더를 숨기고 싶은 경로들을 배열에 담습니다.
  const hideHeaderPaths = ["/mypage", "/admin", "/login"];

  // 2. 현재 경로(location.pathname)가 배열에 포함되어 있는지 확인합니다.
  if (hideHeaderPaths.includes(location.pathname)) {
    return null;
  }
  
  return (
    <header className="header-container">
      {/* 로고 텍스트 */}
      <div className="nav-logo">CHARCAGE</div>

      {/* 내비게이션 메뉴 */}
      <nav className="nav-links">
        <li>
          <ul className="Logo">
            <Link to="/" className="nav-item active">
              CHARCAGE
            </Link>
          </ul>
        </li>
        {/* 일반 a 태그 대신 리액트 라우터의 Link를 사용하면 새로고침 없이 이동합니다 */}
        <li>
          <Link to="/find" className="nav-item">
            충전소찾기
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/types">충전소 종류</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/membership" className="nav-item">
            멤버십
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to="/wallet">지갑 충전하기</Link>
            </li>
            <li>
              <Link to="/cash">요금 알아보기</Link>
            </li>
            <li>
              <Link to="/app">APP 소개</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/support" className="nav-item">
          고객지원
        </Link>
        <ul className="sub-menu">
          <li>
            <Link to="/notice">공지사항</Link>
          </li>
          <li>
            <Link to="/news">뉴스</Link>
          </li>
          <li>
            <Link to="/contact">고객센터</Link>
          </li>
        </ul>
        </li>
      </nav>

      {/* 마이페이지/로고 이미지 영역 */}
      <div className="nav-mypage">
        {/* 이미지 경로는 public 폴더 기준일 경우 아래와 같이 작성합니다 */}
        
        <Link to="/login">
          로 그 인
        </Link>
        
      </div>
    </header>
  );
}
export default Header;
