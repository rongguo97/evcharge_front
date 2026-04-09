<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link rel="stylesheet" href="../../css/header.css" />
  <header className="main-header">
    <div className="container nav-wrapper">
      <div className="logo">
        <a href="../webapp/index.html">CHARCAGE</a>
      </div>
      <input type="checkbox" id="menu-trigger" className="menu-trigger" />
      <label htmlFor="menu-trigger" className="menu-btn">
        <span />
        <span />
        <span />
      </label>
      <nav className="gnb">
        <ul className="main-menu">
          <li>
            <a href="#">CHARCAGE</a>
            <ul className="mobile-only-sub">
              <li>
                <a href="#">브랜드 소개</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#">충전소 찾기</a>
            <ul className="mobile-only-sub">
              <li>
                <a href="../webapp/charge-find.html">충전소 찾기</a>
              </li>
              <li>
                <a href="../webapp/charge-kind.html">충전소 종류</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#" className="active">
              서비스
            </a>
            <ul className="mobile-only-sub">
              <li>
                <a href="#">지갑 충전하기</a>
              </li>
              <li>
                <a href="#">요금 알아보기</a>
              </li>
              <li>
                <a href="#">APP 소개</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#">고객지원</a>
            <ul className="mobile-only-sub">
              <li>
                <a href="#">공지사항</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">뉴스</a>
              </li>
              <li>
                <a href="#">고객센터</a>
              </li>
            </ul>
          </li>
        </ul>
        <div className="mega-menu-panel">
          <div className="panel-content">
            <div className="panel-column">
              <ul>
                <li>
                  <a href="#">브랜드 소개</a>
                </li>
              </ul>
            </div>
            <div className="panel-column">
              <ul>
                <li>
                  <a href="../webapp/charge-find.html">충전소 찾기</a>
                </li>
                <li>
                  <a href="../webapp/charge-kind.html">충전소 종류</a>
                </li>
              </ul>
            </div>
            <div className="panel-column">
              <ul>
                <li>
                  <a href="#">지갑 충전하기</a>
                </li>
                <li>
                  <a href="#">요금 알아보기</a>
                </li>
                <li>
                  <a href="#">APP 소개</a>
                </li>
              </ul>
            </div>
            <div className="panel-column">
              <ul>
                <li>
                  <a href="#">공지사항</a>
                </li>
                <li>
                  <a href="#">FAQ</a>
                </li>
                <li>
                  <a href="#">뉴스</a>
                </li>
                <li>
                  <a href="#">고객센터</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {/* 사이드 메뉴 */}
      <aside className="side-quick-menu">
        <a href="#" className="quick-btn my-page">
          마 이 페 이 지
        </a>
        <a href="#" className="quick-btn admin-page">
          관 리 자 페 이 지
        </a>
      </aside>
    </div>
  </header>
</>
