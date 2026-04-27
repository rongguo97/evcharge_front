import React from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 임포트 유지
import { useAuth } from "../context/AuthContext"; 
import "../css/mypageP.css";

const MyPagep: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate(); // 1. 여기서 navigate 함수를 선언해야 합니다.

  if (loading) {
    return (
      <div className="loading-container">
        <p>사용자 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-layout">
        <div className="glass-card error-card">
          <h2>접근 권한이 없습니다.</h2>
          <p>로그인이 필요합니다.</p>
          <Link to="/auth/login" className="login-link">로그인 하러가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-layout">
      <section className="hero-banner mini">
        <div className="overlay"></div>
        <div className="hero-content"></div>
      </section>

      <div className="profile-container">
        <div className="glass-card profile-card">
          <div className="profile-header">
            <div className="profile-title">
              <h3>
                {user.memberName}{" "}
                <span className="badge-gold">
                  {user.role === "ROLE_ADMIN" ? "관리자" : "유저"}
                </span>
              </h3>
              <p>가입일: {user.insertTime || "정보 없음"}</p>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label>이름</label>
              <div className="value">{user.memberName}</div>
            </div>
            <div className="info-item">
              <label>이메일주소</label>
              <div className="value">{user.email}</div>
            </div>
            <div className="info-item">
              <label>차량번호</label>
              <div className="value">{user.carNumber || "미등록"}</div>
            </div>
            <div className="info-item">
              <label>계정권한</label>
              <div className="value">
                {user.role === "ROLE_ADMIN" ? "관리자" : "유저"}
              </div>
            </div>
            <div className="info-item">
              <label>전화번호</label>
              <div className="value">{user.phoneNumber || "미등록"}</div>
            </div>
            <div className="info-item">
              <label>최초 가입일</label>
              <div className="value">{user.insertTime || "정보 없음"}</div>
            </div>
          </div>

          <div className="profile-actions">
            <button
              className="edit-btn"
              onClick={() => navigate("/main/edit")} // 2. 선언한 navigate 변수를 사용합니다.
            >
              정보 수정하기
            </button>
          </div>
        </div>
        
        <footer className="top-nav">
          <div className="logoo02">
            <Link to="/main/mypage">
              <span>마이페이지</span>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MyPagep;