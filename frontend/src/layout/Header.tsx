import { Link } from 'react-router-dom'; // 페이지 이동을 위해 Link 사용 권장
import '../css/main.css'


const Header = () => {
  return (
    <header className="header-container">
      {/* 로고 텍스트 */}
      <div className="nav-logo">CHARCAGE</div>

      {/* 내비게이션 메뉴 */}
      <nav className="nav-links">
        {/* 일반 a 태그 대신 리액트 라우터의 Link를 사용하면 새로고침 없이 이동합니다 */}
        <Link to="/" className="nav-item active">CHARCAGE</Link>
        <Link to="/find" className="nav-item">충전소찾기</Link>
        <Link to="/membership" className="nav-item">멤버십</Link>
        <Link to="/support" className="nav-item">고객지원</Link>
      </nav>

      {/* 마이페이지/로고 이미지 영역 */}
      <div className="nav-mypage">
        {/* 이미지 경로는 public 폴더 기준일 경우 아래와 같이 작성합니다 */}
        <img 
            src="/차카지로고(누끼).png" 
            alt="메인로고(누끼)" 
            width="100" 
        />
      </div>
    </header>
  );
};


export default Header;