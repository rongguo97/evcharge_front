import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostByUuid, updatePost, deletePost } from '../api/communityApi'; 
import Footer from '../layout/Footer';
import '../css/Communication.css';
import { useAuth } from '../context/AuthContext';

const CommunityDetail: React.FC = () => {
  const { cUuid } = useParams<{ cUuid: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [commentInput, setCommentInput] = useState('');
  
  const [comments, setComments] = useState<any[]>(() => {
    const saved = localStorage.getItem(`comments_${cUuid}`);
    return saved ? JSON.parse(saved) : [];
  });

  const getAnonymousName = (email: string) => {
    const animals = ['사자', '호랑이', '토끼', '다람쥐', '곰', '여우', '판다', '코알라', '펭귄', '하마', '수달', '너구리', '고래', '햄스터', '강아지', '고양이'];
    let hash = 0;
    for (let i = 0; i < (email || "anon").length; i++) {
      hash = (email || "anon").charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % animals.length;
    return `익명의 ${animals[index]}`;
  };

  useEffect(() => {
    if (cUuid) {
      setLoading(true);
      fetchPostByUuid(cUuid)
        .then(data => {
          setPost(data);
          setLikeCount(data.likeCount || 0);
          setEditTitle(data.title);
          setEditContent(data.content);
          setLoading(false);
        })
        .catch(err => {
          console.error("데이터 로드 에러:", err);
          alert("존재하지 않는 게시글입니다.");
          navigate('/main/community');
        });
    }
  }, [cUuid, navigate]);

  useEffect(() => {
    if (cUuid) {
      localStorage.setItem(`comments_${cUuid}`, JSON.stringify(comments));
    }
  }, [comments, cUuid]);

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return alert("댓글 내용을 입력해주세요.");
    const anonName = getAnonymousName(user?.email || "anonymous@test.com");
    const newComment = {
      author: anonName,
      authorInitial: anonName.split(' ')[1][0],
      content: commentInput,
      date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').slice(0, -1),
    };
    setComments(prev => [...prev, newComment]);
    setCommentInput('');
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    try {
      await deletePost(post.id || cUuid);
      localStorage.removeItem(`comments_${cUuid}`);
      alert("삭제되었습니다.");
      navigate('/main/community');
    } catch (err) {
      alert("삭제에 실패했습니다.");
    }
  };

  const handleUpdateSubmit = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    try {
      const updatedData = await updatePost(post.id || cUuid, { 
        title: editTitle, 
        content: editContent,
        category: post.category, 
        isNotice: post.isNotice 
      });
      setPost(updatedData); 
      setIsEditing(false);
      alert("수정되었습니다.");
    } catch (err) {
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="loading-container">데이터를 불러오는 중...</div>;
  if (!post) return null;

  const getDisplayCategory = () => {
    if (post.isNotice === 1 || post.is_notice === 1) return '공지';
    const valid = ['자유', '후기', '팁'];
    if (post.category && valid.includes(post.category)) return post.category;
    return '자유';
  };

  const displayCategory = getDisplayCategory();

  return (
    <div className="community-page-root">
      <section className="community-section">
        <div className="container">
          <div className="community-text-wrap">
            <span className="badge">COMMUNITY</span>
            <h1>충전은 빠르게, 소통은 깊이 있게</h1>
            <p>전기차 오너들의 생생한 경험과 정보를 나눠보세요.</p>
          </div>
        </div>
      </section>

      <main className="community-main" style={{ marginTop: '50px', marginBottom: '100px' }}>
        <div className="container">
          <div className="community-layout">
            <div className="board-area">
              <div className="post-card detail-view" style={{ padding: '40px', borderRadius: '20px', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <button className="back-btn" onClick={() => navigate('/main/community')} style={{ background: 'none', border: 'none', color: '#9b72cf', fontWeight: '600', cursor: 'pointer' }}>
                    ← 목록으로 돌아가기
                  </button>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {!isEditing ? (
                      <>
                        <button onClick={() => setIsEditing(true)} className="sort-btn">수정</button>
                        <button onClick={handleDelete} className="sort-btn" style={{ color: '#ff4d4f' }}>삭제</button>
                      </>
                    ) : (
                      <>
                        <button onClick={handleUpdateSubmit} className="write-btn">저장</button>
                        <button onClick={() => setIsEditing(false)} className="sort-btn">취소</button>
                      </>
                    )}
                  </div>
                </div>

                <div className="detail-header" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '25px' }}>
                  <span className={`post-category ${displayCategory === '공지' ? 'cat-notice' : 
                                   displayCategory === '후기' ? 'cat-review' : 
                                   displayCategory === '팁' ? 'cat-tip' : 'cat-free'}`} 
                        style={{ marginBottom: '15px', display: 'inline-block' }}>
                    {displayCategory}
                  </span>
                  
                  {isEditing ? (
                    <input className="form-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ width: '100%', fontSize: '1.8rem', fontWeight: 'bold', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  ) : (
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '20px', color: '#1a1a1a' }}>{post.title}</h2>
                  )}

                  <div className="post-author-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#9b72cf', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {post.email?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="author-name" style={{ fontWeight: '600', color: '#333' }}>{getAnonymousName(post.email)}</span>
                      <span className="post-date" style={{ fontSize: '0.85rem', color: '#999' }}>{post.insertTime?.split('T')[0]}</span>
                    </div>

                    {/* ✅ 하트 아이콘 및 색상 변경 (보라색 테마) */}
                    <button onClick={() => { setLiked(!liked); setLikeCount(prev => liked ? prev - 1 : prev + 1); }} 
                            className={`like-btn ${liked ? 'liked' : ''}`} 
                            style={{ marginLeft: '20px', border: `1px solid ${liked ? '#9b72cf' : '#eee'}`, padding: '6px 15px', borderRadius: '20px', backgroundColor: liked ? '#faf5ff' : '#fff', cursor: 'pointer', transition: '0.3s' }}>
                      <span>💜</span>
                      <span style={{ marginLeft: '6px', fontWeight: 'bold', color: liked ? '#9b72cf' : '#666' }}>{likeCount}</span>
                    </button>

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', color: '#666', fontSize: '0.9rem' }}>
                      <span>👁 {post.viewCount || 0}</span>
                      <span>💬 {comments.length}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-content" style={{ padding: '50px 0', minHeight: '400px' }}>
                  {isEditing ? (
                    <textarea className="form-textarea" value={editContent} onChange={(e) => setEditContent(e.target.value)} style={{ width: '100%', minHeight: '450px', padding: '20px', fontSize: '1rem', lineHeight: '1.6', border: '1px solid #ddd', borderRadius: '10px' }} />
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.15rem', color: '#333', wordBreak: 'break-all' }}>{post.content}</div>
                  )}
                </div>

                <div className="comment-section" style={{ borderTop: '1px solid #f0f0f0', paddingTop: '30px' }}>
                  <h3 className="sidebar-title" style={{ marginBottom: '25px', fontSize: '1.3rem' }}>댓글 {comments.length}</h3>
                  <div className="comment-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {comments.map((c, idx) => (
                      <div key={idx} className="comment-item" style={{ display: 'flex', gap: '15px' }}>
                        <div className="comment-avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#f3e8ff', color: '#9b72cf', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>{c.authorInitial}</div>
                        <div className="comment-body" style={{ flex: 1 }}>
                          <div className="comment-author-row" style={{ marginBottom: '5px' }}>
                            <span className="comment-author" style={{ fontWeight: '600', marginRight: '10px' }}>{c.author}</span>
                            <span className="comment-date" style={{ fontSize: '0.8rem', color: '#bbb' }}>{c.date}</span>
                          </div>
                          <p className="comment-text" style={{ lineHeight: '1.5', color: '#444' }}>{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="comment-write" style={{ marginTop: '30px' }}>
                    <div className="comment-input-row" style={{ display: 'flex', gap: '10px' }}>
                      <input className="comment-input" placeholder="따뜻한 댓글을 남겨주세요..." value={commentInput} onChange={(e) => setCommentInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()} style={{ flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #eee' }} />
                      <button className="comment-submit" onClick={handleCommentSubmit} style={{ padding: '0 25px', borderRadius: '25px', backgroundColor: '#9b72cf', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>등록</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="community-sidebar">
              <div className="sidebar-card">
                <h4 className="sidebar-title">🔥 인기 게시글</h4>
                <ul className="popular-list">
                  <li><span className="popular-rank rank-1">1</span> <span className="popular-text">전국 급속충전소 무료 카드 정리</span></li>
                  <li><span className="popular-rank rank-2">2</span> <span className="popular-text">겨울철 배터리 관리 꿀팁</span></li>
                  <li><span className="popular-rank rank-3">3</span> <span className="popular-text">테슬라 모델3 장거리 후기</span></li>
                </ul>
              </div>
              <div className="sidebar-banner">
                <div className="banner-icon">⚡</div>
                <h4>지금 바로 예약하기</h4>
                <button className="banner-btn" onClick={() => navigate('/main/reservation')}>예약하러 가기</button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityDetail;