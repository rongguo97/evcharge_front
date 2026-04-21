import React, { useState } from 'react';
import "../css/community.css";
import { Link } from 'react-router-dom';

// Community.tsx
const Community: React.FC = () => {
  const [isWriteFormVisible, setIsWriteFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('free');

  const toggleWriteForm = () => setIsWriteFormVisible(!isWriteFormVisible);

  return (
    <>

      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-text-wrap">
            <span className="badge">커뮤니티</span>
            <h1>CHARCARGE 커뮤니티</h1>
            <p>전기차 오너들의 생생한 경험과 정보를 나눠보세요.</p>
          </div>
        </div>
      </section>

      {/* ===== 탭 메뉴 ===== */}
      <section className="tab-section">
        <div className="container">
          <div className="tab-wrap">
            {['free', 'review', 'tip', 'notice'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'free' && '자유게시판'}
                {tab === 'review' && '이용후기'}
                {tab === 'tip' && '충전 팁'}
                {tab === 'notice' && '공지사항'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 메인 콘텐츠 ===== */}
      <main className="community-main">
        <div className="container">
          <div className="community-layout">
            <div className="board-area">
              <div className="board-toolbar">
                <div className="search-box">
                  <input type="text" placeholder="게시글 검색..." />
                  <button className="search-btn">🔍</button>
                </div>
                <button className="write-btn" onClick={toggleWriteForm}>✏️ 글쓰기</button>
              </div>

              {/* 글쓰기 폼 */}
              {isWriteFormVisible && (
                <div className="write-form-wrap">
                  <div className="write-form-card">
                    <h3 className="form-title">새 글 작성</h3>
                    <div className="form-row">
                      <select className="form-select">
                        <option value="자유">자유게시판</option>
                        <option value="후기">이용후기</option>
                        <option value="팁">충전 팁</option>
                      </select>
                      <input type="text" className="form-input" placeholder="제목을 입력하세요" />
                    </div>
                    <textarea className="form-textarea" placeholder="내용을 입력하세요."></textarea>
                    <div className="form-row">
                      <input type="text" className="form-input" placeholder="닉네임" />
                      <div className="form-actions">
                        <button className="btn-cancel" onClick={toggleWriteForm}>취소</button>
                        <button className="btn-submit">등록하기</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 게시글 목록 (샘플) */}
              <div className="post-list">
                <PostCard 
                  category="자유" 
                  title="테슬라 모델3 장거리 여행 후기" 
                  author="테슬라러버" 
                  date="2026.04.20" 
                  likes={24} 
                  comments={5}
                />
                {/* 추가 게시글 카드들... */}
              </div>

              <div className="pagination">
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">›</button>
              </div>
            </div>

            {/* 사이드바 */}
            <aside className="community-sidebar">
              <div className="sidebar-card">
                <h4 className="sidebar-title">🔥 인기 게시글</h4>
                <ul className="popular-list">
                  <li><span className="popular-rank rank-1">1</span> 전국 급속충전소 무료 이용 카드</li>
                </ul>
              </div>
              <div className="sidebar-banner">
                <div className="banner-icon">⚡</div>
                <h4>지금 바로 예약하기</h4>
                <button className="banner-btn">
                  <Link to="/reservation">예약하러 가기</Link>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

// 게시글 카드 컴포넌트 분리
const PostCard: React.FC<any> = ({ category, title, author, date, likes, comments }) => {
  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-meta-left">
          <span className="post-category">{category}</span>
        </div>
        <div className="post-actions-top">
          <button className="like-btn">🤍 {likes}</button>
        </div>
      </div>
      <h3 className="post-title">{title}</h3>
      <div className="post-footer">
        <div className="post-author-info">
          <span className="author-name">{author}</span>
          <span className="post-date">{date}</span>
        </div>
        <div className="post-stats">
          <span>💬 {comments}</span>
        </div>
      </div>
    </div>
  );
};

export default Community;