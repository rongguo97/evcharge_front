import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { type IMemberExtended } from '../../../types/IMember';
import '../../../css/AdminPage.css'; // 스타일링을 위한 CSS 파일 (생성 필요)


const WalletManager: React.FC = () => {
  const [members, setMembers] = useState<IMemberExtended[]>([]);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
    const fetchMembers = async () => {
        try {
        // 백엔드에서 TB_MEMBER와 TB_WALLET을 조인한 데이터를 가져온다고 가정
        const res = await axios.get('/api/admin/members');
        if (Array.isArray(res.data)) {
            setMembers(res.data);
        }

        } catch (err) {
        console.error("회원 목록 로드 실패:", err);
        } finally {
        setLoading(false);
        }
    };
    fetchMembers();
    }, []);

  if (loading) return <div className="p-4 text-white">회원 정보를 불러오는 중...</div>;
    return (
    <div className="admin-card">
        <div className="table-header">
        <h3>지갑 관리</h3>
        <p className="table-desc">회원의 지갑 정보를 관리합니다.</p>
        </div>
        <table className="admin-table">
        <thead>
            <tr>
            <th>ID</th>
            <th>아이디(이름)</th>
            <th>보유 포인트</th>
            <th>관리</th>
            </tr>
        </thead>
        <tbody>
            {members.length > 0 ? (
            members.map((member) => (
                <tr key={member.id}>
                <td>{member.id}</td>
                <td>
                    <strong>{String(member.userName)}</strong>
                </td>
                <td>{member.wallet?.point || 0} P</td>
                <td>
                    <button
                    className="edit-btn"
                    onClick={() => alert(`회원 ${member.userName}의 지갑을 관리합니다.`)}
                    >
                    관리
                    </button>
                </td>
                </tr>
            ))
            ) : (
            <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
                등록된 회원이 없습니다.
                </td>
            </tr>
            )}
        </tbody>
        </table>
    </div>
    );
};

export default WalletManager;
