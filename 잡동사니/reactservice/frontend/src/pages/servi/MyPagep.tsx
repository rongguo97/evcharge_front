import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/mypagep.css';
import logo from '../../assets/images/logo.png';


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

const AccountSettings: React.FC = () => {
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
    <div className="app-wrapper">
      <header className="top-nav">
        <div className="logo">Account</div>
        <nav className="menu">
          <Link to="/"><span>메인으로</span></Link>
          <Link to="/mypage"><span>마이페이지</span></Link>
          <Link to="/pay"><span className="active">지갑 충전하기</span></Link>
        </nav>
      </header>

      <div className="main-layout">
        <section className="hero-banner mini">
          <div className="overlay"></div>
          <div className="hero-content">
            <h2>Account Settings</h2>
            <p>회원님의 소중한 정보를 안전하게 관리하세요.</p><br />
          </div>
        </section>

        <div className="profile-container">
          <div className="glass-card profile-card">
            <div className="profile-header">
              <div className="avatarr-large">{userData.name.charAt(0)}</div>
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
        </div>
      </div>


      <footer className="white-footer">
        <div className="container footer-flex">
          <div className="footer-logo">
            <img src={logo} alt="차카지 로고" />
          </div>
          <div className="footer-info">
            <p>회사이름 : 차카지</p>
            <p>대표이사 : 이팀이지</p>
            <p>사업자번호 : 123-45-67890</p>
            <p>주소 : 부산광역시 진구 범내골로</p>
            <p>E-mail : help00charcage.com</p>
            <p className="copy">&copy; 2026 CHARCAGE. All Rights Reserved.</p>
          </div>
          <div className="footer-contact">
            <p>영업 및 협력문의 <strong>1577-1234</strong></p>
            <p>비즈니스 투자문의 <strong>1577-1234</strong></p>
            <p>고객센터 <strong>1577-1234</strong></p>
          </div>
        </div>
      </footer>
    </div>



  );
};

export default AccountSettings;