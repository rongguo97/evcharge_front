import StationList from '../pages/StationList'; // 1. 지도 컴포넌트 임포트
import carVideo from '../image/carvideo.mp4'; 

const Home = () => {
  return (
    <div className="home-container">
      {/* 2. 상단: 동영상 섹션 */}
      <section className="hero">
        <div className="video-background">
          <video autoPlay muted loop playsInline>
            <source src={carVideo} type="video/mp4" />
          </video>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">친환경 이동을 더 똑똑하게</h1>
          <p className="hero-sub">Save time, Reserve your charge</p>
        </div>
      </section>

      {/* 3. 하단: 지도 섹션 (동영상 아래로 배치) */}
      <section className="map-section" style={{ padding: "50px 0" }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>📍 주변 충전소 찾기</h2>
        <StationList />
      </section>
    </div>
  );
};

export default Home;