import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 인증 정보 가져오기
import '../css/main.css';

const QuickMenu: React.FC = () => {
  const { user, isLoggedIn } = useAuth(); // 로그인 상태와 유저 정보 정보 추출

  // 만약 로그인조차 안 되어 있다면 아무것도 렌더링하지 않음 (선택 사항)
  if (!isLoggedIn) return null;

  return (
    <aside className="side-quick-menu">
      {/* 1. 로그인한 모든 사용자에게 노출 */}
      <Link to="mypage" className="quick-btn my-page">
        마 이 페 이 지
      </Link>
      
      {/* 2. 관리자(ROLE_ADMIN) 권한이 있는 사용자에게만 노출 */}
      {user?.role === "ROLE_ADMIN" && (
        <Link to="adminpage" className="quick-btn admin-page">
          관 리 자 페 이 지
        </Link>
      )}
    </aside>
  );
};

export default QuickMenu;