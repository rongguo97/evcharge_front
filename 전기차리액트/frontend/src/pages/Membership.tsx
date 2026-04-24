import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Membership.css';


const Membership: React.FC = () => {
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

  const handleMembership = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    alert(`${formData.name}님, 차카지 가입을 환영합니다!`);
    navigate('/');
  };

  return (
    <>
          <div className="main-layout">
        <section className="hero-banner mini">
          <div className="overlay"></div>
          <div className="hero-content">
            {/* <h2>JOIN THE MEMBERSHIP</h2>
            <p>차카지의 회원가입을 환영합니다.</p> <br /> */}
          </div>
        </section>

        <div className="profile-container">
          <div className="glass-card profile-card membership-card">
            <div className="profile-header">
              <div className="avatar-large"></div>
              <div className="profile-title">
                <h3>회원가입</h3><br />
                <p>정보를 정확히 입력해주세요.</p>
              </div>
            </div>

            <form onSubmit={handleMembership} className="info-grid memebrship-form">
              <div className="info-item">
                <label>이름</label>
                <input
                  type="text"
                  name="name"
                  className="membership-input"
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
                  className="membership-input"
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
                  className="membership-input"
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
                  className="membership-input"
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
                  className="membership-input"
                  placeholder="예: Tesla Model 3"
                  onChange={handleChange}
                />
              </div>

              <div className="info-item full-width">
                <label>차량번호</label>
                <input
                  type="text"
                  name="carInfo"
                  className="membership-input"
                  placeholder="예: 12가 3456"
                  onChange={handleChange}
                />
              </div>

              <div className="info-item full-width">
                <label>전화번호</label>
                <input
                  type="text"
                  name="carInfo"
                  className="membership-input"
                  placeholder="010-0000-0000"
                  onChange={handleChange}
                />
              </div>

              <div className="profile-actions membership-actions">
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
        <div className="app-wrapper">
    </div>
      </div>
  
    </>
    


  );
};

export default Membership;