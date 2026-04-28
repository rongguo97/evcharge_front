import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import '../../../css/notice.css'; 

interface Notice {
    noticeId: number;
    title: string;
    content: string;
    views: number;
    isTop: string;
    insertTime: string;
}

const NoticeManager: React.FC = () => {
    // 1. 'user' is declared but never read 해결: 
    // 실제 저장 로직(handleSave)에서 user.userId를 사용하도록 명시합니다.
    const { user } = useAuth();
    
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [form, setForm] = useState({
        title: '',
        content: '',
        isTop: 'N'
    });

    // --- 함수 정의 시작 ---

    // 1. 목록 불러오기
    const fetchNotices = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/notices');
            const result = response.data;
            
            if (Array.isArray(result)) {
                setNotices(result);
            } else if (result && Array.isArray(result.data)) {
                setNotices(result.data);
            } else {
                setNotices([]);
            }
        } catch (error) {
            console.error("로드 실패:", error);
            setNotices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    // 2. 저장 함수 (Cannot find name 'handleSave' 해결)
    const handleSave = async () => {
        if (!form.title || !form.content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        try {
            await axios.post('/api/admin/notices', {
                ...form,
                adminId: user?.userId // 여기서 user 변수를 사용하여 경고를 해결합니다.
            });
            alert("등록되었습니다.");
            setIsModalOpen(false);
            setForm({ title: '', content: '', isTop: 'N' });
            fetchNotices();
        } catch (error) {
            alert("등록 실패: 관리자 권한이 필요합니다.");
        }
    };

    // 3. 삭제 함수 (handleDelete 빨간 줄 해결)
    const handleDelete = async (id: number) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`/api/admin/notices/${id}`);
            alert("삭제되었습니다.");
            fetchNotices();
        } catch (error) {
            alert("삭제 실패");
        }
    };

    // --- 렌더링 시작 ---

    if (loading) return <div className="p-4">로딩 중...</div>;

    return (
        <div className="notice-manager-container">
            <div className="manager-header">
                <h3>공지사항 관리</h3>
                <button className="add-btn" onClick={() => setIsModalOpen(true)}>새 공지 등록</button>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>유형</th>
                        <th>제목</th>
                        <th>조회수</th>
                        <th>작성일</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.length > 0 ? (
                        notices.map(notice => (
                            <tr key={notice.noticeId} className={notice.isTop === 'Y' ? 'top-notice' : ''}>
                                <td>{notice.isTop === 'Y' ? "중요" : "일반"}</td>
                                <td>{notice.title}</td>
                                <td>{notice.views}</td>
                                <td>{notice.insertTime ? new Date(notice.insertTime).toLocaleDateString() : '-'}</td>
                                <td>
                                    {/* 여기서 handleDelete 호출 */}
                                    <button className="delete-mini-btn" onClick={() => handleDelete(notice.noticeId)}>삭제</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={5}>데이터가 없습니다.</td></tr>
                    )}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="admin-modal">
                    <div className="modal-content">
                        <h4>새 공지 등록</h4>
                        <input 
                            value={form.title} 
                            onChange={e => setForm({...form, title: e.target.value})} 
                            placeholder="제목"
                        />
                        <textarea 
                            value={form.content} 
                            onChange={e => setForm({...form, content: e.target.value})} 
                            placeholder="내용"
                        />
                        {/* 여기서 handleSave 호출 */}
                        <button onClick={handleSave}>저장</button>
                        <button onClick={() => setIsModalOpen(false)}>취소</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticeManager;