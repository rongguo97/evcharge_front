// Header.tsx : 머리말
// 리액트 단축키 : rfce
//  <Link to="/인터넷 주소 : 아무거나 하면됨 ">반복문</Link> |

import { Link } from "react-router-dom"
import '../css/header.css'

function Header() {
  return (

    <div>
        <header className="main-header">
      <div className="container nav-wrapper">
        <div className="logo">CHARCAGE</div>
        
        {/* 체크박스와 라벨의 연결은 htmlFor를 사용합니다 */}
        <input type="checkbox" id="menu-trigger" className="menu-trigger" />
        <label htmlFor="menu-trigger" className="menu-btn">
          <span></span><span></span><span></span>
        </label>

        <nav className="gnb">
          <ul className="main-menu">
            <li>
              <a href="#">CHARCAGE</a>
              <ul className="mobile-only-sub">
                <li><a href="#">브랜드 소개</a></li>
                <li><Link to ="membership">회원가입</Link></li>
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
                <li><Link to ="pay">지갑 충전하기</Link></li>
                <li><Link to ="cash">요금 알아보기</Link></li>
                <li><Link to = "app">APP 소개</Link></li>
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
              <div className="panel-column"><ul><li><a href="#">브랜드 소개</a></li><li><Link to ="membership">회원가입</Link></li></ul></div>
              <div className="panel-column"><ul><li><a href="#">충전소 찾기</a></li><li><a href="#">충전소 종류</a></li></ul></div>
              <div className="panel-column"><ul><li><Link to ="pay">지갑 충전하기</Link></li><li><Link to ="cash">요금 알아보기</Link></li><li><Link to = "app">APP 소개</Link></li></ul></div>
              <div className="panel-column"><ul><li><Link to="notice">공지사항</Link></li><li><Link to="faq">FAQ</Link></li><li><a href="#">뉴스</a></li><li><Link to="customer-center">고객센터</Link></li></ul></div>

            </div>
          </div>
        </nav>
        <div className="header-util-space"></div>
      </div>
      <div className="menu-overlay"></div>
    </header>
     <aside className="side-quick-menu">
      {/* 1. 외부 파일(html)이 아닌 라우팅 경로(/mypage)로 연결합니다. */}
      <Link to="/mypage" className="quick-btn my-page">
        마 이 페 이 지
      </Link>
      
      {/* 2. 관리자 페이지 경로가 정해졌다면 to="/admin" 등으로 수정하세요. */}
      <Link to="#" className="quick-btn admin-page">
        관 리 자 페 이 지
      </Link>
    </aside>
    </div>

   

  );
}

export default Header;