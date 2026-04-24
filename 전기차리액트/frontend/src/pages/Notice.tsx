import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';
import '../css/notice.css';
import Footer from '../layout/Footer';

interface INotice {
  id: number | string;
  title: string;
  date: string;
  views: number;
  isImportant?: boolean;
}

const NoticePage: React.FC = () => {
  // 실제로는 API에서 가져오겠지만, 일단 상수로 데이터를 정의합니다.
  const [notices] = useState<INotice[]>([
    { id: '공지', title: '차카지 서비스 시스템 점검 안내 (2026.04.20)', date: '2026.04.15', views: 1245, isImportant: true },
    { id: 5, title: '신규 급속 충전소 오픈 안내 (부산 범내골점)', date: '2026.04.12', views: 856 },
    { id: 4, title: '차카지 앱 버전 2.1 업데이트 공지', date: '2026.04.08', views: 2102 },
    { id: 3, title: '봄맞이 충전 요금 할인 이벤트 당첨자 발표', date: '2026.04.01', views: 3421 },
    { id: 2, title: '개인정보 처리방침 개정 안내', date: '2026.03.25', views: 512 },
    { id: 1, title: '차카지 서비스 런칭 안내', date: '2026.03.20', views: 10542 },
  ]);

  return (
    <div className="notice-page">
      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-text">
            <p className="sub-title">Notice & Updates</p>
            <h1>차카지의 새로운 소식을<br /><span>확인해 보세요</span></h1>
          </div>
        </div>
      </section>

      {/* 메인 공지사항 게시판 */}
      <main className="container notice-container">
        <h2 className="board-title">공지사항</h2>
        
        <table className="notice-table">
          <colgroup>
            <col style={{ width: '10%' }} />
            <col style={{ width: 'auto' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice, index) => (
              <tr key={index}>
                <td>{notice.id}</td>
                <td className="title">
                  {notice.isImportant && <span className="badge-notice">중요</span>}
                  <Link to={`/notice/${notice.id}`}>{notice.title}</Link>
                </td>
                <td>{notice.date}</td>
                <td>{notice.views.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="pagination">
          <button className="page-btn">&lt;</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">&gt;</button>
        </div>
      </main>
      < Footer />
    </div>
  );
};

export default NoticePage;