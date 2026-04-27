import React, { useState } from 'react';
import '../css/Communication.css';
import Footer from '../layout/Footer';
import { createPost } from '../api/communityApi';
import { useAuth } from '../context/AuthContext';

// ===================== 타입 정의 =====================
interface Comment {
  id: number;
  author: string;
  date: string;
  text: string;
  likes: number;
}

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
  likes: number;
  comments: Comment[];
  liked: boolean;
}

const initialPosts: Post[] = [
  {
    id: 1,
    category: '자유',
    badge: 'NEW',
    title: '테슬라 모델3 장거리 여행 후기 - 서울에서 부산까지!',
    preview: '지난 주말 테슬라 모델3로 서울에서 부산까지 왕복 여행을 다녀왔습니다...',
    author: '테슬라러버',
    authorInitial: 'T',
    date: '2026.04.20',
    views: '342',
    likes: 24,
    liked: false,
    comments: [{ id: 1, author: 'EV초보', date: '2026.04.20', text: '정말 유용한 정보네요!', likes: 3 }],
  },
  {
    id: 2,
    category: '후기',
    title: 'EV DRIVE 앱으로 예약하고 처음 전기차 빌렸어요 🚗',
    preview: '전기차를 처음 빌려봤는데 생각보다 훨씬 편리하더라고요...',
    author: '초보드라이버',
    authorInitial: '초',
    date: '2026.04.19',
    views: '218',
    likes: 18,
    liked: false,
    comments: [],
  },
  {
    id: 3,
    category: '팁',
    badge: 'HOT',
    title: '겨울철 전기차 배터리 관리 꿀팁 모음 🔋',
    preview: '겨울에 전기차 타시는 분들 배터리 걱정 많으시죠? 3년간 터득한 관리법...',
    author: '배터리박사',
    authorInitial: '배',
    date: '2026.04.18',
    views: '891',
    likes: 31,
    liked: true,
    comments: [],
  },
];

const categoryClassMap: Record<string, string> = {
  '자유': 'cat-free',
  '후기': 'cat-review',
  '팁': 'cat-tip',
  '공지': 'cat-notice',
};

// ===================== 메인 컴포넌트 =====================
const Community: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState<string>('free');
  const [openPostId, setOpenPostId] = useState<number | string | null>(null);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [sortType, setSortType] = useState<'latest' | 'likes' | 'comments'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');

  const [newPost, setNewPost] = useState({ category: '자유', title: '', content: '', author: '' });
  const [commentInputs, setCommentInputs] = useState<Record<number | string, { author: string; text: string }>>({});

  const togglePost = (id: number | string) => setOpenPostId(prev => (prev === id ? null : id));

  const toggleLike = (id: number | string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const toggleCommentLike = (postId: number | string, commentId: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c) } : p));
  };

  const addComment = (postId: number | string) => {
    const input = commentInputs[postId];
    if (!input?.text?.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      author: input.author || user?.name || '익명',
      date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').slice(0, -1),
      text: input.text,
      likes: 0,
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
    setCommentInputs(prev => ({ ...prev, [postId]: { author: '', text: '' } }));
  };

  // ── 🚀 핵심: 새 글 등록 (ORA-01722 해결 및 UI 최적화) ──
  const handleWritePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      return alert("제목과 내용을 모두 입력하세요.");
    }

    // [수정] 백엔드 Integer 타입 기대에 맞춰 "Y" 대신 1 전송
    const postData = {
      email: user?.email || "anonymous@test.com",
      title: newPost.title,
      content: newPost.content,
      isNotice: newPost.category === '공지' ? 1 : 0 
    };

    try {
      // 1. API 호출
      const responseData = await createPost(postData); 
      alert("글이 성공적으로 등록되었습니다.");

      // 2. 서버에서 받은 실제 cUuid를 활용하여 목록 업데이트
      const post: Post = {
        id: responseData.cUuid || Date.now(), 
        category: newPost.category as Post['category'],
        title: responseData.title || newPost.title,
        preview: (responseData.content || newPost.content).slice(0, 80) + '...',
        author: user?.name || responseData.email?.split('@')[0] || '익명',
        authorInitial: (user?.name || responseData.email || '익')[0].toUpperCase(),
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/ /g, '').slice(0, -1),
        views: '0',
        likes: 0,
        liked: false,
        comments: [],
      };

      setPosts(prev => [post, ...prev]);
      setNewPost({ category: '자유', title: '', content: '', author: '' });
      setShowWriteForm(false);
    } catch (err: any) {
      console.error("❌ 저장 실패:", err);
      // 서버 에러 메시지를 사용자에게 보여줌
      alert(`저장에 실패했습니다.\n사유: ${err.message || '서버 응답 오류'}`);
    }
  };

  const getSortedPosts = (list: Post[]) => {
    const sorted = [...list];
    if (sortType === 'likes') sorted.sort((a, b) => b.likes - a.likes);
    else if (sortType === 'comments') sorted.sort((a, b) => b.comments.length - a.comments.length);
    else sorted.sort((a, b) => {
        if (typeof b.id === 'string' || typeof a.id === 'string') return 0;
        return (b.id as number) - (a.id as number);
    });
    return sorted;
  };

  const filteredPosts = getSortedPosts(
    posts.filter(p => (filterCat === 'all' || p.category === filterCat) && 
    (p.title.includes(searchQuery) || p.preview.includes(searchQuery)))
  );

  return (
    <div className="community-page-root">
      <section className="community-section">
        <div className="container">
          <div className="community-text-wrap">
            <span className="badge">커뮤니티</span>
            <h1>충전은 빠르게, 소통은 깊이 있게</h1>
            <p>전기차 오너들의 생생한 경험과 정보를 나눠보세요.</p>
          </div>
        </div>
      </section>

      <section className="tab-section">
        <div className="container">
          <div className="tab-wrap">
            {[{ key: 'free', label: '자유게시판', val: '자유' }, { key: 'review', label: '이용후기', val: '후기' }, { key: 'tip', label: '충전 팁', val: '팁' }, { key: 'notice', label: '공지사항', val: '공지' }].map(tab => (
              <button key={tab.key} className={`tab-btn${filterCat === tab.val ? ' active' : ''}`} onClick={() => setFilterCat(tab.val)}>{tab.label}</button>
            ))}
          </div>
        </div>
      </section>

      <main className="community-main">
        <div className="container">
          <div className="community-layout">
            <div className="board-area">
              <div className="board-toolbar">
                <div className="search-box">
                  <input type="text" placeholder="게시글 검색..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  <button className="search-btn">🔍</button>
                </div>
                <button className="write-btn" onClick={() => setShowWriteForm(prev => !prev)}>✏️ 글쓰기</button>
              </div>

              {showWriteForm && (
                <div className="write-form-wrap">
                  <div className="write-form-card">
                    <h3 className="form-title">새 글 작성</h3>
                    <div className="form-row">
                      <select className="form-select" value={newPost.category} onChange={e => setNewPost(p => ({ ...p, category: e.target.value as any }))}>
                        <option value="자유">자유게시판</option>
                        <option value="후기">이용후기</option>
                        <option value="팁">충전 팁</option>
                        <option value="공지">공지사항</option>
                      </select>
                      <input type="text" className="form-input" placeholder="제목을 입력하세요" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <textarea className="form-textarea" placeholder="내용을 입력하세요." value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} />
                    <div className="form-row">
                      <input type="text" className="form-input" placeholder="닉네임 (로그인 시 자동 적용)" value={user ? user.name : newPost.author} onChange={e => setNewPost(p => ({ ...p, author: e.target.value }))} disabled={!!user} />
                      <div className="form-actions">
                        <button className="btn-cancel" onClick={() => setShowWriteForm(false)}>취소</button>
                        <button className="btn-submit" onClick={handleWritePost}>등록하기</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="sort-bar">
                <span className="post-count">전체 <strong>{filteredPosts.length}</strong>개</span>
                <div className="sort-btns">
                  {['latest', 'likes', 'comments'].map((type, i) => (
                    <button key={type} className={`sort-btn${sortType === type ? ' active' : ''}`} onClick={() => setSortType(type as any)}>{['최신순', '인기순', '댓글순'][i]}</button>
                  ))}
                </div>
              </div>

              <div className="post-list">
                {filteredPosts.map(post => (
                  <div key={post.id} className="post-card">
                    <div className="post-header">
                      <span className={`post-category ${categoryClassMap[post.category]}`}>{post.category}</span>
                      <button className={`like-btn${post.liked ? ' liked' : ''}`} onClick={() => toggleLike(post.id)}>
                        <span>{post.liked ? '❤️' : '🤍'}</span> {post.likes}
                      </button>
                    </div>
                    <h3 className="post-title" onClick={() => togglePost(post.id)}>{post.title}</h3>
                    <p className="post-preview">{post.preview}</p>
                    <div className="post-footer">
                      <div className="avatar">{post.authorInitial}</div>
                      <span className="author-name">{post.author}</span>
                      <span className="post-date">{post.date}</span>
                      <div className="post-stats">👁 {post.views} 💬 {post.comments.length}</div>
                    </div>
                    {openPostId === post.id && (
                      <div className="comment-section">
                        {post.comments.map(c => (
                          <div key={c.id} className="comment-item">
                            <div className="comment-body">
                              <strong>{c.author}</strong> <span>{c.text}</span>
                              <button onClick={() => toggleCommentLike(post.id, c.id)}>👍 {c.likes}</button>
                            </div>
                          </div>
                        ))}
                        <div className="comment-write">
                          <input type="text" placeholder="댓글 내용" value={commentInputs[post.id]?.text || ''} 
                            onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: { ...prev[post.id], text: e.target.value } }))} 
                            onKeyPress={e => e.key === 'Enter' && addComment(post.id)} />
                          <button onClick={() => addComment(post.id)}>등록</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <aside className="community-sidebar">
              <div className="sidebar-card">
                <h4>🔥 인기 게시글</h4>
                <ul className="popular-list">
                  {posts.slice(0, 5).sort((a, b) => b.likes - a.likes).map((p, idx) => (
                    <li key={p.id} onClick={() => togglePost(p.id)}>{idx + 1}. {p.title}</li>
                  ))}
                </ul>
              </div>
              <div className="sidebar-card">
                <h4>📂 카테고리</h4>
                <ul className="category-list">
                  {['all', '자유', '후기', '팁', '공지'].map(cat => (
                    <li key={cat} className={filterCat === cat ? 'active-cat' : ''} onClick={() => setFilterCat(cat)}>{cat === 'all' ? '전체' : cat}</li>
                  ))}
                </ul>
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