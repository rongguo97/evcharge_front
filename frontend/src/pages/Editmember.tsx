import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import '../css/Membership.css';

const Editmember: React.FC = () => {
  const navigate = useNavigate();
  // AuthContext에서 loading 상태를 반드시 함께 가져와야 합니다.
  const { user, updateMember, loading } = useAuth(); 

  const [formData, setFormData] = useState({
    memberName: '',
    email: '',
    password: '',
    confirmPassword: '',
    carNumber: '',
    phoneNumber: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // 📍 [중요 수정] loading이 false가 되고 user가 존재할 때만 데이터를 세팅합니다.
  useEffect(() => {
    if (!loading && user) {
      setFormData({
        memberName: user.memberName || '',
        email: user.email || '',
        password: '', 
        confirmPassword: '',
        carNumber: user.carNumber || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user, loading]); // loading 상태를 의존성 배열에 추가

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호를 입력한 경우에만 유효성 검사 실행
    if (formData.password.trim() !== "") {
      if (formData.password !== formData.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      if (formData.password.length < 8) {
        alert("비밀번호는 8자 이상이어야 합니다.");
        return;
      }
    }

    setIsLoading(true);

    try {
      // 4. AuthContext의 updateMember 호출
      const result = await updateMember({
        email: formData.email,
        // 비밀번호가 비어있으면 null을 보내 백엔드에서 수정을 건너뛰게 합니다.
        password: formData.password.trim() === "" ? null : formData.password, 
        memberName: formData.memberName,
        carNumber: formData.carNumber,
        phoneNumber: formData.phoneNumber
      });

      if (result.success) {
        alert("정보가 성공적으로 변경되었습니다.");
        navigate('/main/mypage'); 
      } else {
        alert("정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error('수정 에러:', error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 📍 로딩 중일 때는 화면에 아무것도 그리지 않거나 로딩 메시지를 보여줍니다.
  // 이 처리가 없으면 빈 input 창이 먼저 보여서 정보가 사라진 것처럼 느껴집니다.
  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontWeight: 'bold' }}>
      사용자 정보를 불러오는 중입니다...
    </div>
  );

  return (
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
              <h3>회원정보 수정</h3><br />
              <p>변경하실 정보를 입력해주세요.</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="info-grid memebrship-form">
            <div className="info-item">
              <label>이름</label>
              <input
                type="text"
                name="memberName"
                className="membership-input"
                required
                value={formData.memberName}
                onChange={handleChange}
              />
            </div>

            <div className="info-item">
              <label>이메일 주소 (수정 불가)</label>
              <input
                type="email"
                name="email"
                className="membership-input"
                style={{ backgroundColor: '#f0f0f0', color: '#888', cursor: 'not-allowed' }}
                readOnly
                value={formData.email}
              />
            </div>

            <div className="info-item">
              <label>새 비밀번호 (변경 시에만 입력)</label>
              <input
                type="password"
                name="password"
                className="membership-input"
                placeholder="변경하지 않으려면 비워두세요"
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
                placeholder="비밀번호 확인"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="info-item full-width">
              <label>차량번호</label>
              <input
                type="text"
                name="carNumber"
                className="membership-input"
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
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="profile-actions membership-actions">
              <button type="submit" className="edit-btn" disabled={isLoading}>
                {isLoading ? "처리 중..." : "정보 수정 완료"}
              </button>
              <button 
                type="button" 
                className="edit-btn" 
                style={{ backgroundColor: '#666', marginTop: '10px' }}
                onClick={() => navigate(-1)}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Editmember;