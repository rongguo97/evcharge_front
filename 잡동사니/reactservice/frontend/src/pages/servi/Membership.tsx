import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import '../../assets/css/membership.css';


const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    carInfo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    alert(`${formData.name}님, 차카지 가입을 환영합니다!`);
    navigate('/');
  };

  return (
    <div className="app-wrapper">
      <header className="top-nav">
        <div className="logo">JOIN THE MEMBERSHIP</div>
        <nav className="menu">
          <Link to="/"><span>메인으로</span></Link>
        </nav>
      </header>

      <div className="main-layout">
        <section className="hero-banner mini">
          <div className="overlay"></div>
          <div className="hero-content">
            <h2>JOIN THE MEMBERSHIP</h2>
            <p>차카지의 회원가입을 환영합니다.</p> <br />
          </div>
        </section>

        <div className="profile-container">
          <div className="glass-card profile-card register-card">
            <div className="profile-header">
              <div className="avatar-large"></div>
              <div className="profile-title">
                <h3>회원가입</h3><br />
                <p>정보를 정확히 입력해주세요.</p>
              </div>
            </div>

            <form onSubmit={handleRegister} className="info-grid register-form">
              <div className="info-item">
                <label>이름</label>
                <input
                  type="text"
                  name="name"
                  className="register-input"
                  placeholder="성함을 입력하세요"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="info-item">
                <label>이메일 주소</label>
                <input
                  type="email"
                  name="email"
                  className="register-input"
                  placeholder="example@mail.com"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="info-item">
                <label>비밀번호</label>
                <input
                  type="password"
                  name="password"
                  className="register-input"
                  placeholder="8자 이상 입력"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="info-item">
                <label>비밀번호 확인</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="register-input"
                  placeholder="다시 한번 입력하세요"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="info-item full-width">
                <label>차종</label>
                <input
                  type="text"
                  name="carInfo"
                  className="register-input"
                  placeholder="예: Tesla Model 3"
                  onChange={handleChange}
                />
              </div>

              <div className="info-item full-width">
                <label>차량번호</label>
                <input
                  type="text"
                  name="carInfo"
                  className="register-input"
                  placeholder="예: 12가 3456"
                  onChange={handleChange}
                />
              </div>

              <div className="info-item full-width">
                <label>전화번호</label>
                <input
                  type="text"
                  name="carInfo"
                  className="register-input"
                  placeholder="010-0000-0000"
                  onChange={handleChange}
                />
              </div>

              <div className="profile-actions register-actions">
                <button type="submit" className="edit-btn">
                  가입 신청하기
                </button>
                <br />
                <p className="login-link">
                  이미 계정이 있으신가요? <Link to="/">로그인하기</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
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
            <p>E-mail : help@charcage.com</p>
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

export default Register;