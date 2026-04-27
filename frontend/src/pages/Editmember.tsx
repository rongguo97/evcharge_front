import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios'; 
import '../css/Membership.css';

const Membership: React.FC = () => {
  const navigate = useNavigate();

  // 📍 carModel 제거
  const [formData, setFormData] = useState({
    memberName: '',
    email: '',
    password: '',
    confirmPassword: '',
    carNumber: '',
    phoneNumber: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMembership = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      // 📍 전송 데이터에서 carModel 제외
      const response = await apiClient.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        memberName: formData.memberName,
        carNumber: formData.carNumber,
        phoneNumber: formData.phoneNumber
      });

      if (response.status === 200 || response.status === 201) {
        alert(`${formData.memberName}님, 가입을 환영합니다!`);
        navigate('/'); 
      }
    } catch (error: any) {
      console.error('회원가입 에러 상세:', error.response?.data || error);
      const serverMessage = error.response?.data?.message || "회원가입에 실패했습니다.";
      alert(`가입 실패: ${serverMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="main-layout">
        <section className="hero-banner mini">
          <div className="overlay"></div>
          <div className="hero-content"></div>
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
                  name="memberName"
                  className="membership-input"
                  placeholder="성함을 입력하세요"
                  required
                  value={formData.memberName}
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
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
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
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

              {/* 차종(carModel) 입력창 제거 완료 */}

              <div className="info-item full-width">
                <label>차량번호</label>
                <input
                  type="text"
                  name="carNumber"
                  className="membership-input"
                  placeholder="예: 12가 3456"
                  required
                  value={formData.carNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="info-item full-width">
                <label>전화번호</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="membership-input"
                  placeholder="010-0000-0000"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-actions membership-actions">
                <button type="submit" className="edit-btn" disabled={isLoading}>
                  {isLoading ? "처리 중..." : "정보변경하기"}
                </button>
                <br />
                <p className="login-link">
                  이미 계정이 있으신가요? <Link to="/">로그인하기</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className="app-wrapper"></div>
      </div>
    </>
  );
};

export default Membership;