
import StationList from '../pages/StationList'; 
import carVideo from '../image/main영상이미지.mp4'
import '../css/main.css';
import heroImg from '../image/충전소.png';
import Footer from '../layout/Footer';



const Home = () => {
  return (
    <div className="home-container">

      {/* 1. 상단: 동영상 섹션 */}
      <section className="hero">
        <div className="video-background">
          <video autoPlay muted loop playsInline className="bg-video">
            <source src={carVideo} type="video/mp4" />
          </video>
        </div>
        <div className="hero-content">
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
        <br />
        {/* 모든 기능(지역 선택, 이동, 마커)이 들어있는 컴포넌트 하나만 띄웁니다. */}
        <StationList />
      </section>

{/* 3번째 section */}
<main className="hero-section">
  {/* 배경 이미지 */}
  <img src={heroImg} alt="" className="hero-bg" />

  <nav className="sidebar">
    <ul>
      <li><a href="#none">충전예약</a></li>
      <li><a href="#none">서비스개요</a></li>
      <li><a href="#none">App서비스</a></li>
      <li><a href="#none">서비스</a></li>
    </ul>
  </nav>
  <div className="main-content">
    <h1>READY TO CHARGE</h1>
  </div>
</main>

  {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;