import React from 'react';
import { Link } from 'react-router-dom';
import '../css/mypageP.css';



interface UserProfile {
  name: string;
  grade: string;
  joinDate: string;
  email: string;
  userCode: string;
  carInfo: string;
  role: string;
  membership: string;
  fullJoinDate: string;
}

const MyPagep: React.FC = () => {
  const userData: UserProfile = {
    name: "차카지",
    grade: "VIP 등급",
    joinDate: "2024.08.01",
    email: "chakaji_user@example.com",
    userCode: "#CKJ-9982-X",
    carInfo: "Tesla Model 3 (12가 3456)",
    role: "회원",
    membership: "VIP PREMIUM",
    fullJoinDate: "2024년 08월 01일"
  };

  return (
    <>
      <div className="main-layout">
        <section className="hero-banner mini">
          <div className="overlay"></div>
          <div className="hero-content">
            
            {/* <h2>Account Settings</h2>
            <p>회원님의 소중한 정보를 안전하게 관리하세요.</p><br /> */}
            
          </div>
        </section>

        <div className="profile-container">
          <div className="glass-card profile-card">
            <div className="profile-header">
              {/* <div className="avatarr-large">{userData.name.charAt(0)}</div> */}
              <div className="profile-title">
                <h3>{userData.name} <span className="badge-gold">{userData.grade}</span></h3>
                <p>가입일: {userData.joinDate}</p>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>이메일 주소</label>
                <div className="value">{userData.email}</div>
              </div>
              <div className="info-item">
                <label>회원 고유 코드</label>
                <div className="value">{userData.userCode}</div>
              </div>
              <div className="info-item">
                <label>등록 차량 정보</label>
                <div className="value">{userData.carInfo}</div>
              </div>
              <div className="info-item">
                <label>계정 권한</label>
                <div className="value">{userData.role}</div>
              </div>
              <div className="info-item">
                <label>현재 멤버십 등급</label>
                <div className="value-highlight">{userData.membership}</div>
              </div>
              <div className="info-item">
                <label>최초 가입일</label>
                <div className="value">{userData.fullJoinDate}</div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="edit-btn" onClick={() => alert('정보 수정 페이지로 이동합니다.')}>
                정보 수정하기
              </button>
            </div>
          </div>
          <footer className="top-nav">
        <div className="logoo"><Link to="/main/mypage"><span>마이페이지</span></Link></div>
      </footer>
        </div>
       <br /><br /><br /><br /><br /><br /><br /><br />
      </div>
   

    </>

  );
};

export default MyPagep;