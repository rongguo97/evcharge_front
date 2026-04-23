import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios.ts'; // apiClient 대신 api로 이름을 맞춤
import '../css/Membership.css';

const Membership: React.FC = () => {
  const navigate = useNavigate();

  // 1. 상태 변수를 백엔드 MemberDto 구조에 맞게 초기화
  const [formData, setFormData] = useState({
    memberName: '',    // name에서 변경
    email: '',
    password: '',
    confirmPassword: '',
    carNumber: '',     // carInfo에서 변경
    phoneNumber: '',   // carInfo에서 변경
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. 비동기 통신(async) 적용
  const handleMembership = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 3. 백엔드로 데이터 전송
      await apiClient.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        memberName: formData.memberName,
        carNumber: formData.carNumber,
        phoneNumber: formData.phoneNumber
      });

      alert(`${formData.memberName}님, 차카지 가입을 환영합니다!`);
      navigate('/'); // 가입 성공 후 로그인 페이지로 이동
    } catch (error: any) {
      console.error('회원가입 에러:', error);
      // 백엔드에서 보낸 에러 메시지가 있으면 출력, 없으면 기본 메시지
      alert(error.response?.data?.message || "회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
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
                  name="memberName" // name -> memberName
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
                />
              </div>

              {/* 차종은 DTO에 없으므로 필요한 경우 추가하거나, carNumber 등에 통합해서 보내야 합니다. 
                  일단 디자인 유지를 위해 남겨두되 데이터 바인딩은 제외했습니다. */}
              <div className="info-item full-width">
                <label>차종</label>
                <input
                  type="text"
                  className="membership-input"
                  placeholder="예: Tesla Model 3"
                />
              </div>

              <div className="info-item full-width">
                <label>차량번호</label>
                <input
                  type="text"
                  name="carNumber" // carInfo -> carNumber
                  className="membership-input"
                  placeholder="예: 12가 3456"
                  value={formData.carNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="info-item full-width">
                <label>전화번호</label>
                <input
                  type="text"
                  name="phoneNumber" // carInfo -> phoneNumber
                  className="membership-input"
                  placeholder="010-0000-0000"
                  value={formData.phoneNumber}
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
        <div className="app-wrapper"></div>
      </div>
    </>
  );
};

export default Membership;