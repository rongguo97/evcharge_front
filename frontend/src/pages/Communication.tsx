import React, { useState } from 'react';
import '../css/Communication.css';
import '../layout/Footer';
import Footer from '../layout/Footer';
// import '../css/커뮤니티.css'; // CSS 파일 경로에 맞게 수정하세요

// ===================== 타입 정의 =====================
interface Comment {
  id: number;
  author: string;
  date: string;
  text: string;
  likes: number;
}

interface Post {
  id: number;
  category: '자유' | '후기' | '팁' | '공지';
  badge?: 'NEW' | 'HOT';
  title: string;
  preview: string;
  author: string;
  authorInitial: string;
  date: string;
  views: string;
  likes: number;
  comments: Comment[];
  liked: boolean;
}

// ===================== 초기 게시글 데이터 =====================
const initialPosts: Post[] = [
  {
    id: 1,
    category: '자유',
    badge: 'NEW',
    title: '테슬라 모델3 장거리 여행 후기 - 서울에서 부산까지!',
    preview: '지난 주말 테슬라 모델3로 서울에서 부산까지 왕복 여행을 다녀왔습니다. 고속도로 충전소 위치와 실제 주행거리에 대해 공유하고 싶어서 글을 남깁니다...',
    author: '테슬라러버',
    authorInitial: 'T',
    date: '2026.04.20',
    views: '342',
    likes: 24,
    liked: false,
    comments: [
      { id: 1, author: 'EV초보', date: '2026.04.20', text: '정말 유용한 정보네요! 저도 다음 달에 부산 여행 계획 중인데 많은 도움이 됐습니다 😊', likes: 3 },
      { id: 2, author: '충전왕', date: '2026.04.20', text: '천안 휴게소 충전기 대기 시간이 꽤 길더라고요. 새벽에 출발하시면 좋을 것 같아요!', likes: 7 },
    ],
  },
  {
    id: 2,
    category: '후기',
    title: 'EV DRIVE 앱으로 예약하고 처음 전기차 빌렸어요 🚗',
    preview: '전기차를 처음 빌려봤는데 생각보다 훨씬 편리하더라고요. 앱에서 예약부터 충전 안내까지 한번에 되니까 정말 좋았습니다. 특히 충전소 위치 안내 기능이...',
    author: '초보드라이버',
    authorInitial: '초',
    date: '2026.04.19',
    views: '218',
    likes: 18,
    liked: false,
    comments: [
      { id: 1, author: 'GreenDriver', date: '2026.04.19', text: '저도 처음엔 걱정했는데 생각보다 쉬워요! 앱 UI가 직관적이라서 금방 익숙해지더라고요.', likes: 2 },
    ],
  },
  {
    id: 3,
    category: '팁',
    badge: 'HOT',
    title: '겨울철 전기차 배터리 관리 꿀팁 모음 🔋',
    preview: '겨울에 전기차 타시는 분들 배터리 걱정 많으시죠? 3년간 전기차 타면서 터득한 겨울철 배터리 관리법을 공유합니다. 1. 출발 전 예열 필수 2. 급속충전보다 완속충전 권장...',
    author: '배터리박사',
    authorInitial: '배',
    date: '2026.04.18',
    views: '891',
    likes: 31,
    liked: true,
    comments: [
      { id: 1, author: '아이오닉유저', date: '2026.04.18', text: '예열 기능 정말 중요하더라고요. 출발 30분 전에 미리 켜두면 확실히 주행거리가 달라져요!', likes: 12 },
      { id: 2, author: 'KONA오너', date: '2026.04.18', text: '완속충전이 배터리 수명에 좋다는 건 알았는데 겨울엔 특히 더 중요하군요. 좋은 정보 감사합니다!', likes: 5 },
    ],
  },
  {
    id: 4,
    category: '자유',
    title: '전기차 처음 구매 고민 중인데 조언 부탁드려요',
    preview: '내연기관차에서 전기차로 바꾸려고 하는데 어떤 모델이 좋을까요? 주로 시내 주행 위주고 가끔 고속도로도 타는 편입니다. 예산은 5천만원 내외로 생각하고 있어요...',
    author: '전환고민중',
    authorInitial: '전',
    date: '2026.04.17',
    views: '156',
    likes: 9,
    liked: false,
    comments: [
      { id: 1, author: '배터리박사', date: '2026.04.17', text: '시내 주행 위주라면 아이오닉6 추천드려요! 1회 충전 주행거리도 길고 실내 공간도 넓습니다.', likes: 4 },
    ],
  },
  {
    id: 5,
    category: '팁',
    badge: 'HOT',
    title: '전국 급속충전소 무료 이용 가능한 카드 정리 💳',
    preview: '전기차 충전비용 절감을 위한 카드 혜택 총정리! 현대카드, 신한카드, 롯데카드 등 주요 카드사별 충전 혜택을 비교해봤습니다. 월 최대 3만원까지 절약 가능한 방법...',
    author: '절약왕EV',
    authorInitial: '절',
    date: '2026.04.16',
    views: '1,204',
    likes: 45,
    liked: false,
    comments: [],
  },
  {
    id: 6,
    category: '후기',
    title: '제주도 전기차 여행 3박 4일 완벽 가이드',
    preview: '제주도에서 전기차로 여행하기 정말 최적입니다! 섬 전체에 충전소가 잘 갖춰져 있고, 렌터카도 전기차 비율이 높아서 선택지가 많아요. 일정별 충전 포인트와 추천 드라이브 코스...',
    author: '제주드라이버',
    authorInitial: '제',
    date: '2026.04.15',
    views: '432',
    likes: 7,
    liked: false,
    comments: [],
  },
];

// ===================== 카테고리 클래스 매핑 =====================
const categoryClassMap: Record<string, string> = {
  '자유': 'cat-free',
  '후기': 'cat-review',
  '팁': 'cat-tip',
  '공지': 'cat-notice',
};

// ===================== 메인 컴포넌트 =====================
const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState<string>('free');
  const [openPostId, setOpenPostId] = useState<number | null>(null);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [sortType, setSortType] = useState<'latest' | 'likes' | 'comments'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');

  // 새 글 작성 폼 상태
  const [newPost, setNewPost] = useState({ category: '자유', title: '', content: '', author: '' });

  // 댓글 입력 상태 (postId -> { author, text })
  const [commentInputs, setCommentInputs] = useState<Record<number, { author: string; text: string }>>({});

  // ── 게시글 토글 ──
  const togglePost = (id: number) => {
    setOpenPostId(prev => (prev === id ? null : id));
  };

  // ── 좋아요 토글 ──
  const toggleLike = (id: number) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  // ── 댓글 좋아요 ──
  const toggleCommentLike = (postId: number, commentId: number) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map(c =>
                c.id === commentId ? { ...c, likes: c.likes + 1 } : c
              ),
            }
          : p
      )
    );
  };

  // ── 댓글 등록 ──
  const addComment = (postId: number) => {
    const input = commentInputs[postId];
    if (!input?.text?.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      author: input.author || '익명',
      date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', ''),
      text: input.text,
      likes: 0,
    };
    setPosts(prev =>
      prev.map(p =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    setCommentInputs(prev => ({ ...prev, [postId]: { author: '', text: '' } }));
  };

  // ── 새 글 등록 ──
  const submitPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    const post: Post = {
      id: Date.now(),
      category: newPost.category as Post['category'],
      title: newPost.title,
      preview: newPost.content.slice(0, 80) + '...',
      author: newPost.author || '익명',
      authorInitial: (newPost.author || '익')[0],
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/ /g, ''),
      views: '0',
      likes: 0,
      liked: false,
      comments: [],
    };
    setPosts(prev => [post, ...prev]);
    setNewPost({ category: '자유', title: '', content: '', author: '' });
    setShowWriteForm(false);
  };

  // ── 정렬 ──
  const getSortedPosts = (list: Post[]) => {
    const sorted = [...list];
    if (sortType === 'likes') sorted.sort((a, b) => b.likes - a.likes);
    else if (sortType === 'comments') sorted.sort((a, b) => b.comments.length - a.comments.length);
    else sorted.sort((a, b) => b.id - a.id);
    return sorted;
  };

  // ── 필터링 ──
  const getFilteredPosts = () => {
    let list = posts;
    if (filterCat !== 'all') list = list.filter(p => p.category === filterCat);
    if (searchQuery.trim()) list = list.filter(p => p.title.includes(searchQuery) || p.preview.includes(searchQuery));
    return getSortedPosts(list);
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="community-section">
        <div className="container">
          <div className="community-text-wrap">
            <span className="badge">커뮤니티</span>
            <h1>충전은 빠르게, 소통은 깊이 있게</h1>
            <p>전기차 오너들의 생생한 경험과 정보를 나눠보세요.</p>
          </div>
        </div>
      </section>

      {/* ===== 탭 메뉴 ===== */}
      <section className="tab-section">
        <div className="container">
          <div className="tab-wrap">
            {[
              { key: 'free', label: '자유게시판' },
              { key: 'review', label: '이용후기' },
              { key: 'tip', label: '충전 팁' },
              { key: 'notice', label: '공지사항' },
            ].map(tab => (
              <button
                key={tab.key}
                className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 메인 콘텐츠 ===== */}
      <main className="community-main">
        <div className="container">
          <div className="community-layout">

            {/* 좌측: 게시글 목록 */}
            <div className="board-area">

              {/* 검색 & 글쓰기 바 */}
              <div className="board-toolbar">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="게시글 검색..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <button className="search-btn">🔍</button>
                </div>
                <button className="write-btn" onClick={() => setShowWriteForm(prev => !prev)}>
                  ✏️ 글쓰기
                </button>
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
                        onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}
                      >
                        <option value="자유">자유게시판</option>
                        <option value="후기">이용후기</option>
                        <option value="팁">충전 팁</option>
                      </select>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="제목을 입력하세요"
                        value={newPost.title}
                        onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                      />
                    </div>
                    <textarea
                      className="form-textarea"
                      placeholder="내용을 입력하세요. 전기차 관련 경험, 팁, 질문 등 자유롭게 작성해주세요."
                      value={newPost.content}
                      onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                    />
                    <div className="form-row">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="닉네임"
                        value={newPost.author}
                        onChange={e => setNewPost(p => ({ ...p, author: e.target.value }))}
                      />
                      <div className="form-actions">
                        <button className="btn-cancel" onClick={() => setShowWriteForm(false)}>취소</button>
                        <button className="btn-submit" onClick={submitPost}>등록하기</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 정렬 옵션 */}
              <div className="sort-bar">
                <span className="post-count">
                  전체 <strong>{filteredPosts.length}</strong>개의 게시글
                </span>
                <div className="sort-btns">
                  {(['latest', 'likes', 'comments'] as const).map((type, i) => (
                    <button
                      key={type}
                      className={`sort-btn${sortType === type ? ' active' : ''}`}
                      onClick={() => setSortType(type)}
                    >
                      {['최신순', '인기순', '댓글순'][i]}
                    </button>
                  ))}
                </div>
              </div>

              {/* 게시글 목록 */}
              <div className="post-list">
                {filteredPosts.map(post => (
                  <div key={post.id} className="post-card">
                    <div className="post-header">
                      <div className="post-meta-left">
                        <span className={`post-category ${categoryClassMap[post.category]}`}>{post.category}</span>
                        {post.badge && (
                          <span className={`post-badge ${post.badge === 'HOT' ? 'hot' : 'new'}`}>{post.badge}</span>
                        )}
                      </div>
                      <div className="post-actions-top">
                        <button
                          className={`like-btn${post.liked ? ' liked' : ''}`}
                          onClick={() => toggleLike(post.id)}
                        >
                          <span className="heart">{post.liked ? '❤️' : '🤍'}</span>
                          <span className="like-count">{post.likes}</span>
                        </button>
                      </div>
                    </div>

                    <h3 className="post-title" onClick={() => togglePost(post.id)} style={{ cursor: 'pointer' }}>
                      {post.title}
                    </h3>
                    <p className="post-preview">{post.preview}</p>

                    <div className="post-footer">
                      <div className="post-author-info">
                        <div className="avatar">{post.authorInitial}</div>
                        <span className="author-name">{post.author}</span>
                        <span className="post-date">{post.date}</span>
                      </div>
                      <div className="post-stats">
                        <span>👁 {post.views}</span>
                        <span>💬 {post.comments.length}</span>
                      </div>
                    </div>

                    {/* 댓글 영역 */}
                    {openPostId === post.id && (
                      <div className="comment-section">
                        <div className="comment-list">
                          {post.comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                              <div className="comment-avatar">{comment.author[0]}</div>
                              <div className="comment-body">
                                <div className="comment-author-row">
                                  <span className="comment-author">{comment.author}</span>
                                  <span className="comment-date">{comment.date}</span>
                                </div>
                                <p className="comment-text">{comment.text}</p>
                                <button
                                  className="comment-like-btn"
                                  onClick={() => toggleCommentLike(post.id, comment.id)}
                                >
                                  👍 {comment.likes}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="comment-write">
                          <input
                            type="text"
                            className="comment-author-input"
                            placeholder="닉네임"
                            value={commentInputs[post.id]?.author || ''}
                            onChange={e =>
                              setCommentInputs(prev => ({
                                ...prev,
                                [post.id]: { ...prev[post.id], author: e.target.value },
                              }))
                            }
                          />
                          <div className="comment-input-row">
                            <input
                              type="text"
                              className="comment-input"
                              placeholder="댓글을 입력하세요..."
                              value={commentInputs[post.id]?.text || ''}
                              onChange={e =>
                                setCommentInputs(prev => ({
                                  ...prev,
                                  [post.id]: { ...prev[post.id], text: e.target.value },
                                }))
                              }
                              onKeyPress={e => { if (e.key === 'Enter') addComment(post.id); }}
                            />
                            <button className="comment-submit" onClick={() => addComment(post.id)}>
                              등록
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              <div className="pagination">
                {[1, 2, 3, 4].map(n => (
                  <button key={n} className={`page-btn${n === 1 ? ' active' : ''}`}>{n}</button>
                ))}
                <button className="page-btn">›</button>
              </div>
            </div>
            {/* /board-area */}

            {/* 우측 사이드바 */}
            <aside className="community-sidebar">

              {/* 인기 게시글 */}
              <div className="sidebar-card">
                <h4 className="sidebar-title">🔥 인기 게시글</h4>
                <ul className="popular-list">
                  {[
                    { rank: 1, id: 5, text: '전국 급속충전소 무료 이용 가능한 카드 정리' },
                    { rank: 2, id: 3, text: '겨울철 전기차 배터리 관리 꿀팁 모음' },
                    { rank: 3, id: 1, text: '테슬라 모델3 장거리 여행 후기' },
                    { rank: 4, id: 6, text: '제주도 전기차 여행 3박 4일 완벽 가이드' },
                    { rank: 5, id: 2, text: 'EV DRIVE 앱으로 예약하고 처음 전기차 빌렸어요' },
                  ].map(item => (
                    <li key={item.id} onClick={() => togglePost(item.id)} style={{ cursor: 'pointer' }}>
                      <span className={`popular-rank${item.rank <= 3 ? ` rank-${item.rank}` : ''}`}>{item.rank}</span>
                      <span className="popular-text">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 커뮤니티 통계 */}
              <div className="sidebar-card">
                <h4 className="sidebar-title">📊 커뮤니티 현황</h4>
                <div className="stats-grid">
                  {[
                    { num: '2,847', label: '총 게시글' },
                    { num: '18,392', label: '총 댓글' },
                    { num: '5,621', label: '회원 수' },
                    { num: '143', label: '오늘 방문' },
                  ].map(stat => (
                    <div key={stat.label} className="stat-item">
                      <div className="stat-num">{stat.num}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 카테고리 */}
              <div className="sidebar-card">
                <h4 className="sidebar-title">📂 카테고리</h4>
                <ul className="category-list">
                  {[
                    { key: 'all', label: '전체', count: '2,847' },
                    { key: '자유', label: '🗣 자유게시판', count: '1,203' },
                    { key: '후기', label: '⭐ 이용후기', count: '842' },
                    { key: '팁', label: '💡 충전 팁', count: '521' },
                    { key: '공지', label: '📢 공지사항', count: '281' },
                  ].map(cat => (
                    <li
                      key={cat.key}
                      className={`cat-item${filterCat === cat.key ? ' active-cat' : ''}`}
                      onClick={() => setFilterCat(cat.key)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span>{cat.label}</span>
                      <span className="cat-count">{cat.count}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 빠른 예약 배너 */}
              <div className="sidebar-banner">
                <div className="banner-icon">⚡</div>
                <h4>지금 바로 예약하기</h4>
                <p>전기차 예약은 EV DRIVE 앱에서 간편하게!</p>
                <button className="banner-btn">예약하러 가기</button>
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
