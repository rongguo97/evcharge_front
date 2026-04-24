import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/main.css';

const QuickMenu: React.FC = () => {
  const { user, isLoggedIn } = useAuth();

  // [디버깅] 실제 데이터가 어떻게 들어오는지 콘솔에서 확인 (개발 완료 후 제거)
  useEffect(() => {
    if (isLoggedIn && user) {
      console.log("로그인 유저 상세 데이터:", user);
    }
  }, [user, isLoggedIn]);

  if (!isLoggedIn) return null;

  // 관리자 권한 확인 (대소문자 무시 및 방어적 처리)
  // 엔티티에 "ROLE_USER"가 기본값이므로 보통 "ROLE_ADMIN"으로 들어옵니다.
  const isAdmin = user?.role?.toUpperCase() === "ROLE_ADMIN";

  return (
    <aside className="side-quick-menu">
      {/* 마이페이지: 절대 경로(/main/mypage)를 사용하는 것이 안전합니다 */}
      <Link to="/main/mypage" className="quick-btn my-page">
        마 이 페 이 지
      </Link>
      
      {/* 관리자 페이지 버튼 */}
      {isAdmin && (
        <Link to="/main/adminpage" className="quick-btn admin-page">
          관 리 자 페 이 지
        </Link>
      )}
    </aside>
  );
};

export default QuickMenu;