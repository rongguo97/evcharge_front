import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Communication.css';
import Footer from '../layout/Footer';
import { createPost, fetchAllPosts } from '../api/communityApi';
import { useAuth } from '../context/AuthContext';

interface Post {
  id: number | string;
  category: '자유' | '후기' | '팁' | '공지';
  badge?: 'NEW' | 'HOT';
  title: string;
  preview: string;
  author: string;
  authorInitial: string;
  date: string;
  views: string;
  commentCount: number;
  liked: boolean;
}

const categoryClassMap: Record<string, string> = {
  '자유': 'cat-free',
  '후기': 'cat-review',
  '팁': 'cat-tip',
  '공지': 'cat-notice',
};

// ── ✅ DB에서 받은 데이터를 프론트 카테고리로 변환 (유지 로직 핵심) ──
const resolveCategory = (p: any): Post['category'] => {
  // 1. 공지사항 여부 우선 체크
  if (p.isNotice === 1 || p.is_notice === 1) return '공지';
  
  // 2. DB에 저장된 category 값이 유효한지 체크
  const valid = ['자유', '후기', '팁', '공지'];
  if (p.category && valid.includes(p.category)) {
    return p.category as Post['category'];
  }
  
  // 3. 기본값
  return '자유';
};

const Community: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filterCat, setFilterCat] = useState<string>('all');
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPost, setNewPost] = useState({ category: '자유', title: '', content: '', author: '' });

  // ── 페이지네이션 state ──
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 3;
  const PAGE_GROUP = 10;

  const getRandomAnonymousName = () => {
    const animals = ['사자', '호랑이', '토끼', '다람쥐', '곰', '여우', '판다', '코알라', '펭귄', '하마', '수달', '너구리', '고래', '햄스터', '강아지', '고양이'];
    return `익명의 ${animals[Math.floor(Math.random() * animals.length)]}`;
  };

  // ── 게시글 목록 로딩 ──
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const data = await fetchAllPosts();
        const formatted: Post[] = data.map((p: any) => {
          const anonName = getRandomAnonymousName();
          return {
            id: p.cUuid ?? p.cuuid ?? p.C_UUID,
            category: resolveCategory(p),   // ✅ DB의 category 컬럼 값을 최우선 반영
            title: p.title,
            preview: p.content || "",
            author: anonName,
            authorInitial: anonName.split(' ')[1][0],
            date: p.insertTime ? p.insertTime.split('T')[0].replace(/-/g, '.') : "2026.04.28",
            views: p.viewCount || "0",
            commentCount: p.commentCount || 0,
            liked: false,
          };
        });
        setPosts(formatted);
      } catch (err) {
        console.error("목록 로딩 실패:", err);
      }
    };
    loadAllData();
  }, []);

  // ── 탭/검색 변경 시 1페이지로 초기화 ──
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCat, searchQuery]);

  // ── 게시글 등록 ──
  const handleWritePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      return alert("제목과 내용을 모두 입력하세요.");
    }
    const postData = {
      email: user?.email || "anonymous@test.com",
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,                         
      isNotice: newPost.category === '공지' ? 1 : 0,       
    };
    try {
      const res = await createPost(postData);
      alert("글이 성공적으로 등록되었습니다.");

      const anonName = getRandomAnonymousName();
      const addedPost: Post = {
        id: res.cUuid ?? res.cuuid ?? res.C_UUID,
        category: resolveCategory({ ...res, category: newPost.category }),  
        title: res.title,
        preview: res.content,
        author: anonName,
        authorInitial: anonName.split(' ')[1][0],
        date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').slice(0, -1),
        views: '0',
        commentCount: 0,
        liked: false,
      };
      setPosts(prev => [addedPost, ...prev]);
      setNewPost({ category: '자유', title: '', content: '', author: '' });
      setShowWriteForm(false);
      setCurrentPage(1);
    } catch (err: any) {
      alert(`저장 실패: ${err.message}`);
    }
  };

  // ── 필터링 ──
  const filteredPosts = posts.filter(p =>
    (filterCat === 'all' || p.category === filterCat) &&
    (p.title.includes(searchQuery) || p.preview.includes(searchQuery))
  );

  // ── 페이지네이션 계산 ──
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  const pageGroupStart = Math.floor((currentPage - 1) / PAGE_GROUP) * PAGE_GROUP + 1;
  const pageGroupEnd = Math.min(pageGroupStart + PAGE_GROUP - 1, totalPages);
  const pageNumbers = Array.from(
    { length: pageGroupEnd - pageGroupStart + 1 },
    (_, i) => pageGroupStart + i
  );

  return (
    <div className="community-page-root">
      <section className="community-section">
        <div className="container">
          <div className="community-text-wrap">
            <span className="badge">COMMUNITY</span>
            <h1>차카지 커뮤니티</h1>
            <p>전기차 사용자들과 유용한 정보를 나누어 보세요.</p>
          </div>
        </div>
      </section>

      {/* 탭 메뉴 */}
      <section className="tab-section" style={{ transform: 'translateY(-50px)' }}>
        <div className="container">
          <div className="tab-wrap" style={{ display: 'flex', width: '100%', justifyContent: 'center', flexWrap: 'nowrap', margin: 0, padding: 0 }}>
            {['all', '자유', '후기', '팁', '공지'].map(cat => (
              <button
                key={cat}
                className={`tab-btn${filterCat === cat ? ' active' : ''}`}
                onClick={() => setFilterCat(cat)}
                style={{ flex: 1, whiteSpace: 'nowrap', marginLeft: 0, padding: '18px 0', textAlign: 'center' }}
              >
                {cat === 'all' ? '전체' : cat === '자유' ? '자유게시판' : cat === '후기' ? '이용후기' : cat === '팁' ? '충전 팁' : '공지사항'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="community-main">
        <div className="container">
          <div className="community-layout">
            <div className="board-area">

              {/* 검색 & 글쓰기 */}
              <div className="board-toolbar">
                <div className="search-box">
                  <input type="text" placeholder="게시글 검색..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  <button className="search-btn"></button>
                </div>
                <button className="write-btn" onClick={() => setShowWriteForm(prev => !prev)}>글쓰기</button>
              </div>

              {/* 글쓰기 폼 */}
              {showWriteForm && (
                <div className="write-form-wrap">
                  <div className="write-form-card">
                    <h3 className="form-title">새 글 작성</h3>
                    <div className="form-row">
                      <select
                        className="form-select"
                        value={newPost.category}
                        onChange={e => setNewPost(p => ({ ...p, category: e.target.value as any }))}
                      >
                        <option value="자유">자유게시판</option>
                        <option value="후기">이용후기</option>
                        <option value="팁">충전 팁</option>
                        <option value="공지">공지사항</option>
                      </select>
                      <input
                        type="text" className="form-input" placeholder="제목을 입력하세요"
                        value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                      />
                    </div>
                    <textarea
                      className="form-textarea" placeholder="내용을 입력하세요."
                      value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                    />
                    <div className="form-row">
                      <input type="text" className="form-input" placeholder="작성자" value="익명 작성자" disabled />
                      <div className="form-actions">
                        <button className="btn-cancel" onClick={() => setShowWriteForm(false)}>취소</button>
                        <button className="btn-submit" onClick={handleWritePost}>등록하기</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 게시글 목록 - 페이지당 3개 */}
              <div className="post-list">
                {paginatedPosts.map(post => (
                  <div key={post.id} className="post-card">
                    <div className="post-header">
                      <span className={`post-category ${categoryClassMap[post.category]}`}>{post.category}</span>
                    </div>
                    <h3 className="post-title" onClick={() => navigate(`/main/community/${post.id}`)}>{post.title}</h3>
                    <p className="post-preview">{post.preview}</p>
                    <div className="post-footer">
                      <div className="post-author-info">
                        <div className="avatar">{post.authorInitial}</div>
                        <span className="author-name">{post.author}</span>
                        <span className="post-date">{post.date}</span>
                      </div>
                      <div className="post-stats">👁 {post.views} 💬 {post.commentCount}</div>
                    </div>
                  </div>
                ))}

                {paginatedPosts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                    게시글이 없습니다.
                  </div>
                )}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 0 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>‹</button>

                  {pageGroupStart > 1 && (
                    <><button className="page-btn" onClick={() => setCurrentPage(1)}>1</button><span className="page-ellipsis">...</span></>
                  )}

                  {pageNumbers.map(n => (
                    <button key={n} className={`page-btn${currentPage === n ? ' active' : ''}`} onClick={() => setCurrentPage(n)}>{n}</button>
                  ))}

                  {pageGroupEnd < totalPages && (
                    <><span className="page-ellipsis">...</span><button className="page-btn" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button></>
                  )}

                  <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>›</button>
                </div>
              )}

            </div>

            {/* 사이드바 */}
            <aside className="community-sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-title">커뮤니티 통계</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-num">{posts.length}</div>
                    <div className="stat-label">전체 게시글</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-num">{posts.filter(p => p.category === '공지').length}</div>
                    <div className="stat-label">공지사항</div>
                  </div>
                </div>
              </div>
              <div className="sidebar-banner">
                <div className="banner-icon">⚡</div>
                <h4>차카지 꿀팁</h4>
                <p>급속 충전기 사용 시 배터리 수명을 지키는 방법을 알아보세요!</p>
                <button className="banner-btn">자세히 보기</button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community; 