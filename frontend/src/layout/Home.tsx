import StationList from '../pages/StationList'; 
import carVideo from '../image/carvideo.mp4'; 

const Home = () => {
  // 💡 Home에서는 더 이상 map, stations 상태를 직접 관리하지 않습니다.
  // 모든 로직은 StationList 컴포넌트가 알아서 처리하도록 맡깁니다.

  return (
    <div className="home-container">
      {/* 1. 상단: 동영상 섹션 */}
      <section className="hero" style={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
        <div className="video-background" style={{ width: '100%', height: '100%' }}>
          <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
            <source src={carVideo} type="video/mp4" />
          </video>
        </div>
        <div className="hero-content" style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center', color: '#fff'
        }}>
          <h1 className="hero-title">친환경 이동을 더 똑똑하게</h1>
          <p className="hero-sub">Save time, Reserve your charge</p>
        </div>
      </section>

      {/* 2. 하단: 지도 섹션 (지역 이동 기능은 StationList 내부에 포함됨) */}
      <section className="map-section" style={{ padding: "50px 20px", backgroundColor: "#f8f9fa" }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>내 주변 충전소 찾기</h2>
          
          {/* 💡 모든 기능(지역 선택, 이동, 마커)이 들어있는 컴포넌트 하나만 띄웁니다. */}
          <StationList />
        </div>
      </section>
    </div>
  );
};

export default Home;