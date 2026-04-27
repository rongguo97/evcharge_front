import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // 📍 AuthContext 연결
import '../css/CustomerService.css';
import Footer from '../layout/Footer';

const CustomerCenter: React.FC = () => {
  const { user, isLoggedIn } = useAuth(); // 📍 유저 정보 가져오기

  // 1. 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    inquiry_type: '',
    user_name: '',
    user_email: '',
    subject: '',
    message: ''
  });

  // 2. [추가] 페이지 로드 시 또는 로그인 상태 변경 시 데이터 자동 채우기
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData(prev => ({
        ...prev,
        user_name: user.memberName || '', // 백엔드 필드명에 맞춰 수정 (memberName)
        user_email: user.email || ''
      }));
    }
  }, [user, isLoggedIn]);

  // 3. 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // 4. 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('제출된 데이터:', formData);
    alert(`${formData.user_name}님, 문의가 정상적으로 접수되었습니다.`);
    
    // 제출 후 초기화 (로그인 정보는 유지하고 제목/내용만 비우기)
    setFormData(prev => ({
      ...prev,
      subject: '',
      message: ''
    }));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="customer-center-page">
      <section className="app-hero">
        <div className="container">
          <span className="badge">고객지원센터</span>
          <h1>문제는 빠르게, 해결은 확실하게</h1>
          <p>CHARCAGE는 고객님의 목소리에 항상 귀 기울이고 있습니다.</p>
        </div>
      </section>

      <main className="container">
        {/* Quick Menu Cards */}
        <section className="quick-menu" style={{ display: 'flex', gap: '20px', margin: '40px 0' }}>
          <div className="quick-card" onClick={() => scrollToSection('contact-form-anchor')}>
            <i className="fas fa-edit"></i>
            <h3>1:1 고객문의</h3>
            <p>궁금하신 점을 남겨주시면<br />답변해 드립니다.</p>
          </div>
          <div className="quick-card" onClick={() => {
            scrollToSection('contact-form-anchor');
            setFormData(prev => ({ ...prev, inquiry_type: 'voc' }));
          }}>
            <i className="fas fa-comment-dots"></i>
            <h3>커뮤니케이션</h3>
            <p>칭찬, 불만, 제안 등<br />소중한 의견을 듣습니다.</p>
          </div>
          <div className="quick-card" onClick={() => alert('FAQ 페이지 준비 중입니다.')}>
            <i className="fas fa-question-circle"></i>
            <h3>자주 묻는 질문</h3>
            <p>자주 발생하는 질문들을<br />모아두었습니다.</p>
          </div>
        </section>

        {/* CS Info Section (전화번호 등) */}
        <section className="cs-info-section">
          <div className="cs-info-item">
            <i className="fas fa-phone-alt"></i>
            <p>고객센터 전화상담</p>
            <h2>1588-XXXX</h2>
            <p>평일 09:00 ~ 18:00 (주말/공휴일 휴무)</p>
            <a href="tel:1588-0000" className="btn-call">전화 연결하기</a>
          </div>
          <div className="cs-info-item">
            <i className="fas fa-clock"></i>
            <p>24시간 긴급 출동</p>
            <h2 className="emergency-num">080-XXX-XXXX</h2>
            <p>충전 오류 및 긴급 상황 발생 시</p>
            <a href="tel:080-000-0000" className="btn-call btn-danger">긴급 호출하기</a>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-section" id="contact-form-anchor">
          <h2 className="section-title">1:1 문의 / 고객의 소리</h2>
          <div className="contact-form">
            <form id="csForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="inquiry_type">문의 유형</label>
                <select id="inquiry_type" value={formData.inquiry_type} onChange={handleChange} required>
                  <option value="">유형을 선택해주세요</option>
                  <option value="general">일반 문의</option>
                  <option value="payment">결제/환불</option>
                  <option value="station">충전소 이용</option>
                  <option value="voc">고객의 소리 (칭찬/제안)</option>
                  <option value="error">오류 신고</option>
                </select>
              </div>

              {/* 이름 입력칸: 로그인 시 수정 불가(readOnly) */}
              <div className="form-group">
                <label htmlFor="user_name">이름</label>
                <input 
                  type="text" 
                  id="user_name" 
                  value={formData.user_name} 
                  onChange={handleChange} 
                  placeholder="이름을 입력하세요" 
                  required 
                  readOnly={isLoggedIn} // 📍 로그인 시 읽기 전용
                  className={isLoggedIn ? 'readonly-input' : ''} 
                />
              </div>

              {/* 이메일 입력칸: 로그인 시 수정 불가(readOnly) */}
              <div className="form-group">
                <label htmlFor="user_email">이메일 주소</label>
                <input 
                  type="email" 
                  id="user_email" 
                  value={formData.user_email} 
                  onChange={handleChange} 
                  placeholder="example@email.com" 
                  required 
                  readOnly={isLoggedIn} // 📍 로그인 시 읽기 전용
                  className={isLoggedIn ? 'readonly-input' : ''}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">제목</label>
                <input type="text" id="subject" value={formData.subject} onChange={handleChange} placeholder="제목을 입력하세요" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">내용</label>
                <textarea id="message" value={formData.message} onChange={handleChange} placeholder="문의하실 내용을 상세히 적어주세요" required></textarea>
              </div>

              <button type="submit" className="btn-submit">문의하기 접수</button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerCenter;