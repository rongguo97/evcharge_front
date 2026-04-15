import React from 'react';
import { Link } from 'react-router-dom';
import '../css/main.css'; // 아래 작성할 CSS 파일 임포트

const QuickMenu: React.FC = () => {
   
  return (
    <aside className="side-quick-menu">
      <Link to="/mypage" className="quick-btn my-page">마 이 페 이 지</Link>
      
      <Link to="/admin" className="quick-btn admin-page">관 리 자 페 이 지</Link>
    </aside>
  );
};

export default QuickMenu;