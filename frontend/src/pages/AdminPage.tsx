import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 권한 확인을 위해 추가
import '../css/AdminPage.css';

// 관리자용 서브 컴포넌트들
import MemberList from '../pages/Admin/Member/MemberList';
import WalletManager from '../pages/Admin/Member/WalletManager';
import WithdrawManager from '../pages/Admin/Member/WithdrawManager';
import Monitor from '../pages/Admin/Service/ReservationMonitor';
import Log from '../pages/Admin/Community/ActivityLog';
import AdminChart from '../pages/Admin/DashBoard/AdminChart';
import StatsAnalysis from '../pages/Admin/DashBoard/StatsAnalysis';
import PaymentAudit from '../pages/Admin/Payment/PaymentAudit';

const AdminPage: React.FC = () => {
  const { user, loading } = useAuth(); //  유저 정보와 로딩 상태 가져오기
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("charts"); // 기본 화면: 차트
  
  const [openMenus, setOpenMenus] = useState({
    member: true, // 기본으로 첫 메뉴는 열어둠
    operation: false,
    payment: false,
    stats: true,
    security: false
  });

  // 🔒 보안 로직: 관리자 권한 확인
  useEffect(() => {
    if (!loading) {
      // 1. 로그인이 안 되어 있거나
      // 2. 역할(Role)이 ADMIN이 아니면 메인으로 튕겨냄
      if (!user || user.role !== 'ROLE_ADMIN') {
        alert("관리자 권한이 없습니다.");
        navigate('/main'); 
      }
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="admin-loading">권한 확인 중...</div>;
  if (!user || user.role !== 'ROLE_ADMIN') return null;

  const toggleMenu = (menuName: keyof typeof openMenus) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "member-list": return <MemberList />;
      case "wallet": return <WalletManager />;
      case "withdraw": return <WithdrawManager />;
      case "monitor": return <Monitor />;
      case "audit": return <PaymentAudit />;
      case "charts": return <AdminChart />;
      case "analysis": return <StatsAnalysis />;
      case "log": return <Log />;
      default: return <AdminChart />;
    }
  };

  return (
    <div className="admin-layout">
      {/* 사이드바 영역 */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          CHACARGE <br />
          <span>Admin System</span>
        </div>
        
        {/* 관리자 프로필 표시 (DB 데이터) */}
        <div className="admin-profile-summary">
          <p className="admin-name">{user.memberName} 관리자님</p>
          <p className="admin-email">{user.email}</p>
        </div>

        <nav className="admin-nav">
          <ul>
            <li className={`has-sub ${openMenus.member ? 'open' : ''}`}>
              <div className="menu-title" onClick={() => toggleMenu('member')}>회원 및 권한 관리</div>
              {openMenus.member && (
                <ul className="sub-menu-list">
                  <li className={activeMenu === "member-list" ? "active" : ""} onClick={() => setActiveMenu("member-list")}>회원 목록 조회</li>
                  <li className={activeMenu === "wallet" ? "active" : ""} onClick={() => setActiveMenu("wallet")}>지갑/포인트 관리</li>
                  <li className={activeMenu === "withdraw" ? "active" : ""} onClick={() => setActiveMenu("withdraw")}>탈퇴 회원 관리</li>
                </ul>
              )}
            </li>

            <li className={`has-sub ${openMenus.operation ? 'open' : ''}`}>
              <div className="menu-title" onClick={() => toggleMenu('operation')}>서비스 운영 관리</div>
              {openMenus.operation && (
                <ul className="sub-menu-list">
                  <li className={activeMenu === "monitor" ? "active" : ""} onClick={() => setActiveMenu("monitor")}>예약 모니터링</li>
                </ul>
              )}
            </li>

            <li className={`has-sub ${openMenus.payment ? 'open' : ''}`}>
              <div className="menu-title" onClick={() => toggleMenu('payment')}>매출 및 결제 관리</div>
              {openMenus.payment && (
                <ul className="sub-menu-list">
                  <li className={activeMenu === "audit" ? "active" : ""} onClick={() => setActiveMenu("audit")}>결제 내역 감사</li>
                </ul>
              )}
            </li>

            <li className={`has-sub ${openMenus.stats ? 'open' : ''}`}>
              <div className="menu-title" onClick={() => toggleMenu('stats')}>통계 분석</div>
              {openMenus.stats && (
                <ul className="sub-menu-list">
                  <li className={activeMenu === "charts" ? "active" : ""} onClick={() => setActiveMenu("charts")}>대시보드 차트</li>
                  <li className={activeMenu === "analysis" ? "active" : ""} onClick={() => setActiveMenu("analysis")}>운영 지표 분석</li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h2>{activeMenu.replace('-', ' ').toUpperCase()}</h2>
          </div>
          <div className="header-right">
             <button onClick={() => navigate('/main')} className="exit-btn">나가기</button>
          </div>
        </header>
        <div className="admin-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;