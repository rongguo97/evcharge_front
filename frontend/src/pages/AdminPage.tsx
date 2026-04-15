import React, { useState } from 'react';
import '../css/AdminPage.css'; // 스타일링을 위한 CSS 파일 (생성 필요)

// 컴포넌트들을 모두 import (생성 전이라면 임시로 div로 대체 가능)
import MemberList from '../pages/Admin/Member/MemberList';
import WalletManager from '../pages/Admin/Member/WalletManager';
import WithdrawManager from '../pages/Admin/Member/WithdrawManager';
import Monitor from '../pages/Admin/Service/ReservationMonitor';
// ... 나머지 컴포넌트들도 같은 방식으로 import

const AdminPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  
  // 각 대메뉴의 열림/닫힘 상태 관리
  const [openMenus, setOpenMenus] = useState({
    member: false,
    operation: false,
    payment: false,
    stats: false,
    security: false
  });

  // 메뉴 토글 함수
  const toggleMenu = (menuName: keyof typeof openMenus) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  // 우측 화면에 보여줄 컴포넌트 결정 함수
  const renderContent = () => {
    switch (activeMenu) {
      /* 1. 회원 및 권한 */
      case "member-list": return <MemberList />;
      case "wallet": return <WalletManager />;
      case "withdraw": return <WithdrawManager />;
      
      /* 2. 서비스 운영 */
      case "monitor": return <Monitor />;
      case "error-res": return <div className="p-4">비정상 예약 처리 화면</div>;

      /* 3. 매출 및 결제 */
      case "audit": return <div className="p-4">결제 내역 감사 화면</div>;
      case "refund": return <div className="p-4">환불 처리 화면</div>;

      /* 4. 대시보드 및 통계 */
      case "charts": return <div className="p-4">시각화 차트 화면</div>;
      case "analysis": return <div className="p-4">운영 지표 분석 화면</div>;

      /* 5. 커뮤니티 및 보안 */
      case "notice": return <div className="p-4">공지사항 및 게시글 관리 화면</div>;
      case "log": return <div className="p-4">관리자 활동 로그 화면</div>;

      default: return <div className="p-4">메뉴를 선택해주세요.</div>;
    }
  };

  return (
    <div className="admin-layout">
      {/* 사이드바 영역 */}
      <aside className="admin-sidebar">
        <div className="admin-logo">차카지 관리자 메뉴</div>
        <nav className="admin-nav">
          <ul>
            {/* 1. 회원 관리 */}
            <li className={`has-sub ${openMenus.member ? 'open' : ''}`}>
              <div className="menu-title" onClick={() => toggleMenu('member')}>👥 회원 및 권한 관리</div>
              {openMenus.member && (
                <ul className="sub-menu-list">
                  <li onClick={() => setActiveMenu("member-list")}>회원 목록 조회/수정</li>
                  <li onClick={() => setActiveMenu("wallet")}>지갑 및 포인트 관리</li>
                  <li onClick={() => setActiveMenu("withdraw")}>탈퇴 관리</li>
                </ul>
              )}
            </li>

            {/* 2. 서비스 운영 */}
            <li className={`has-sub ${openMenus.operation ? 'open' : ''}`}>
              <div className="menu-title" onClick={() => toggleMenu('operation')}>🔌 서비스 운영 관리</div>
              {openMenus.operation && (
                <ul className="sub-menu-list">
                  <li onClick={() => setActiveMenu("monitor")}>실시간 예약 모니터링</li>
                  <li onClick={() => setActiveMenu("error-res")}>비정상 예약 처리</li>
                </ul>
              )}
            </li>

            {/* 3. 매출 관리 */}
            <li className={`has-sub ${openMenus.payment ? 'open' : ''}`}>
              <div className="menu-title" onClick={() => toggleMenu('payment')}>💰 매출 및 결제 관리</div>
              {openMenus.payment && (
                <ul className="sub-menu-list">
                  <li onClick={() => setActiveMenu("audit")}>결제 내역 감사</li>
                  <li onClick={() => setActiveMenu("refund")}>환불 처리</li>
                </ul>
              )}
            </li>

            {/* ... 4, 5번 메뉴도 동일한 방식으로 추가 ... */}
            <li className={`has-sub ${openMenus.stats ? 'open' : ''}`}>
              <div className="menu-title" onClick={() => toggleMenu('stats')}>📊 대시보드 및 통계</div>
              {openMenus.stats && (
                <ul className="sub-menu-list">
                  <li onClick={() => setActiveMenu("charts")}>시각화 차트</li>
                  <li onClick={() => setActiveMenu("analysis")}>운영 지표 분석</li>
                </ul>
              )}
            </li>

            <li className={`has-sub ${openMenus.security ? 'open' : ''}`}>
              <div className="menu-title" onClick={() => toggleMenu('security')}>🔒 커뮤니티 및 보안 관리</div>
              {openMenus.security && (
                <ul className="sub-menu-list">
                  <li onClick={() => setActiveMenu("notice")}>공지사항 및 게시글 관리</li>
                  <li onClick={() => setActiveMenu("log")}>관리자 활동 로그</li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <main className="admin-main">
        <header className="admin-header">
          <h2>{activeMenu.replace('-', ' ').toUpperCase()}</h2>
        </header>
        <div className="admin-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;