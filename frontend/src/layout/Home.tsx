import StationList from "../pages/StationList";
import carVideo from "../image/video(fixed).mp4";


const Home = () => {
  // 💡 Home에서는 더 이상 map, stations 상태를 직접 관리하지 않습니다.
  // 모든 로직은 StationList 컴포넌트가 알아서 처리하도록 맡깁니다.

  return (
    <div className="home-container">
      {/* 1. 상단: 동영상 섹션 */}
      <section
        className="hero"
        style={{ position: "relative", height: "60vh", overflow: "hidden" }}
      >
        <div
          className="video-background"
          style={{ width: "100%", height: "100%" }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src={carVideo} type="video/mp4" />
          </video>
        </div>
        <div
          className="hero-content"
          style={{
            position: "absolute",
            top: "100%",
            left: "100%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h1 className="hero-title">친환경 이동을 더 똑똑하게</h1>
          <p className="hero-sub">Save time, Reserve your charge</p>
        </div>
      </section>

      {/* 2. 중간: 지도 섹션 (지역 이동 기능은 StationList 내부에 포함됨) */}
      <section
        className="map-section"
        style={{
          width: "100%",
          height: "90vh",
          backgroundColor: "#f8f9fa",
          padding: "0",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            paddingTop: "50px",
          }}
        >
          내 주변 충전소 찾기
        </h2>
        {/* 💡 모든 기능(지역 선택, 이동, 마커)이 들어있는 컴포넌트 하나만 띄웁니다. */}
        <StationList />
      </section>

      {/* 3. 하단: 사이드바 및 히어로 섹션 추가 */}
      <main
        className="hero-section"
        style={{ display: "flex", minHeight: "80vh", backgroundColor: "#fff" }}
      >
        <nav
          className="sidebar"
          style={{
            width: "250px",
            borderRight: "1px solid #eee",
            padding: "40px 20px",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "20px" }}>
              <a
                href="#none"
                style={{
                  textDecoration: "none",
                  color: "#4a2c73",
                  fontWeight: "bold",
                }}
              >
                충전예약
              </a>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <a
                href="#none"
                style={{
                  textDecoration: "none",
                  color: "#4a2c73",
                  fontWeight: "bold",
                }}
              >
                서비스개요
              </a>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <a
                href="#none"
                style={{
                  textDecoration: "none",
                  color: "#4a2c73",
                  fontWeight: "bold",
                }}
              >
                App서비스
              </a>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <a
                href="#none"
                style={{
                  textDecoration: "none",
                  color: "#4a2c73",
                  fontWeight: "bold",
                }}
              >
                서비스
              </a>
            </li>
          </ul>
        </nav>
        <div
          className="main-content"
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "900",
              color: "#4a2c73",
              letterSpacing: "-2px",
            }}
          >
            READY TO CHARGE
          </h1>
        </div>
      </main>
    </div>
  );
};

export default Home;
