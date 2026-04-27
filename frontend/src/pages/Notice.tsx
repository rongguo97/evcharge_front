import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios'; // 📍 axios 설정 가져오기
import '../css/header.css';
import '../css/notice.css';
import Footer from '../layout/Footer';

interface INotice {
  id: number;
  title: string;
  createdAt: string; // 백엔드 필드명에 맞춤 (보통 createdAt)
  viewCount: number; // 백엔드 필드명에 맞춤
  important: boolean;
}

const NoticePage: React.FC = () => {
  const [notices, setNotices] = useState<INotice[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. [하드코딩 제거] API 데이터 호출
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        // 백엔드 엔드포인트 확인 필요 (예: /api/notices)
        const res = await apiClient.get('/notices'); 
        setNotices(res.data);
      } catch (err) {
        console.error("공지사항 목록 로드 실패:", err);
        // 에러 시 사용자에게 보여줄 안내 (선택사항)
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div className="notice-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-text">
            <p className="sub-title">Notice & Updates</p>
            <h1>차카지의 새로운 소식을<br /><span>확인해 보세요</span></h1>
          </div>
        </div>
      </section>

      <main className="container notice-container">
        <h2 className="board-title">공지사항</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
        ) : (
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
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <tr key={notice.id}>
                    <td>{notice.id}</td>
                    <td className="title">
                      {notice.important && <span className="badge-notice">중요</span>}
                      {/* 📍 상세 페이지 이동 */}
                      <Link to={`/notice/${notice.id}`}>{notice.title}</Link>
                    </td>
                    <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                    <td>{notice.viewCount.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '30px' }}>공지사항이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <button className="page-btn">&lt;</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">&gt;</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NoticePage;