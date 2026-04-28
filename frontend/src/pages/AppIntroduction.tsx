import "../css/app.css";
import "../css/header.css";
import appwindow from "../image/appwindow.png";


function App() {
  return (

    <div>
      
      <div className="App">
        {/* Hero Section */}
        <section className="app-hero">
          <div className="container app-hero-flex">
            <div className="hero-text">
              <span className="badge">CHARCAGE APP</span>
              <h1>
                충전의 시작부터 끝까지
                <br />
                <span>하나의 앱으로 간편하게</span>
              </h1>
              <p>
                전국 충전소 검색부터 예약, 결제까지
                <br />
                차카지 앱 하나면 충분합니다.
              </p>
              <div className="download-btns">
                <a href="#" className="btn-store">
                  App Store
                </a>
                <a href="#" className="btn-store">
                  Google Play
                </a>
              </div>
            </div>
            <div className="hero-image">
              <div className="phone-mockup">
                <img src={appwindow} alt="앱 화면" />
              </div>
            </div>
          </div>
        </section>

        <section className="app-features container">
          <div className="section-title">
            <br />
            <br />
            <h2>주요 기능</h2>
            <div className="bar"></div>
          </div>

          <div className="feature-grid">
            <div className="feature-item">
              <div className="icon"></div>
              <h3>실시간 위치 기반 찾기</h3>
              <p>
                내 주변 가장 가까운 충전소와
                <br />
                실시간 가동 현황을 확인하세요.
              </p>
            </div>
            <div className="feature-item">
              <div className="icon"></div>
              <h3>스마트 예약 시스템</h3>
              <p>
                대기 시간 없이 원하는 시간에
                <br />
                미리 충전기를 예약하세요.
              </p>
            </div>
            <div className="feature-item">
              <div className="icon"></div>
              <h3>차카지 간편 결제 서비스</h3>
              <p>
                간편결제로 간단하게
                <br />
                결제하고 포인트를 적립하세요.
              </p>
            </div>
          </div>
        </section>
      </div>
      <br />
      <br />
    </div>
  );
}

export default App;
