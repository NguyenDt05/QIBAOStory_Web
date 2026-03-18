import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getCommentsByStory, submitComment, deleteMyComment } from '../../../api/commentService';
import { getRelativeTime } from '../../../utils/helpers';
import AvatarBase from '../../../components/common/Avatar';
import ConfirmDeleteModal from '../../../components/common/ConfirmDeleteModal';
import '../../../styles/CommentTab.css';

const PAGE_SIZE = 5;

function Avatar({ tenhienthi, avatar, size = 40 }) {
  return <AvatarBase tenhienthi={tenhienthi} avatar={avatar} size={size} className="bl-avatar" />;
}

function AvatarAnon({ size = 40 }) {
  return (
    <div className="bl-avatar--anon" style={{ width: size, height: size }}>
      <i className="bi bi-person-fill" style={{ fontSize: size * 0.55 }} />
    </div>
  );
}

export default function CommentTab({ storyid }) {
  const { currentUser } = useAuth();

  const [comments,   setComments]   = useState([]);
  const [content,    setContent]    = useState('');
  const [page,       setPage]       = useState(1);
  const [isSending,  setIsSending]  = useState(false);
  const [sendError,  setSendError]  = useState('');
  const [isDeleting,  setIsDeleting]  = useState(null); // cmtid đang xóa
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getCommentsByStory(storyid).then(list => {
      if (!cancelled) setComments(list);
    });
    return () => { cancelled = true; };
  }, [storyid]);

  const totalPages = Math.max(1, Math.ceil(comments.length / PAGE_SIZE));
  const pageItems  = comments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageRange = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    return Array.from({ length: 5 }, (_, i) => start + i);
  })();

  const handleSend = async () => {
    if (!content.trim() || isSending || !currentUser) return;
    setIsSending(true);
    setSendError('');
    try {
      const updated = await submitComment({
        storyid,
        content: content.trim(),
      });
      if (Array.isArray(updated)) setComments(updated);
      else {
        // Re-load again
        getCommentsByStory(storyid).then(list => { if (Array.isArray(list)) setComments(list); });
      }
      setContent('');
      setPage(1);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Gửi bình luận thất bại';
      setSendError(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(deleteTarget.cmtid);
    try {
      await deleteMyComment(deleteTarget.cmtid);
      getCommentsByStory(storyid).then(list => {
        if (Array.isArray(list)) setComments(list);
      });
    } catch (err) {
      alert(err?.response?.data?.message || 'Xóa bình luận thất bại');
    } finally {
      setIsDeleting(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="bl-wrap">
      <div className="bl-input-area">
        {currentUser ? <Avatar tenhienthi={currentUser.tenhienthi} avatar={currentUser.avatar} size={42} /> : <AvatarAnon size={42} />}
        {currentUser ? (
          <textarea
            className="bl-textarea"
            rows={3}
            placeholder="Nhập bình luận của bạn..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        ) : (
          <input
            className="bl-input-disabled"
            type="text"
            placeholder="Đăng nhập ngay để bình luận!"
            disabled
            readOnly
          />
        )}
      </div>

      <div className="bl-actions">
        {currentUser ? (
          <button
            className="bl-btn-send"
            disabled={!content.trim() || isSending}
            onClick={handleSend}
          >
            {isSending
              ? <><span className="spinner-border spinner-border-sm" /> Đang gửi...</>
              : 'Gửi bình luận'
            }
          </button>
        ) : (
          <Link to="/login" className="bl-btn-login">Đăng nhập để bình luận</Link>
        )}
        {sendError && (
          <div className="text-danger mt-2" style={{ fontSize: '0.82rem' }}>
            <i className="bi bi-exclamation-circle me-1" />{sendError}
          </div>
        )}
      </div>

      {comments.length === 0 ? (
        <div className="bl-empty">
          <i className="bi bi-chat-dots" />
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </div>
      ) : (
        <>
          <div>
            {pageItems.map(cmt => (
              // cmtid — tên cột PK thật trong bảng comment
              <div key={cmt.cmtid} className="bl-item">
                <Avatar tenhienthi={cmt.tenhienthi} avatar={cmt.avatar} size={40} />
                <div className="bl-item__body">
                  <div className="bl-item__name">
                    {cmt.tenhienthi}
                    {currentUser && String(cmt.userid) === String(currentUser.userid || currentUser.id) && (
                      <button
                        className="btn btn-sm btn-outline-danger ms-auto"
                        title="Xóa bình luận"
                        disabled={isDeleting === cmt.cmtid}
                        onClick={() => setDeleteTarget(cmt)}
                        style={{ padding: '0.15rem 0.4rem', fontSize: '0.8rem' }}
                      >
                        {isDeleting === cmt.cmtid
                          ? <span className="spinner-border spinner-border-sm" />
                          : <i className="bi bi-trash3" />
                        }
                      </button>
                    )}
                  </div>
                  <p className="bl-item__content">{cmt.content}</p>
                  <span className="bl-item__time">
                    <i className="bi bi-clock" />
                    {getRelativeTime(cmt.createdat)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="bl-pagination">
              <button className="bl-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                {'<'}
              </button>
              {pageRange.map(n => (
                <button
                  key={n}
                  className={`bl-page-btn${n === page ? ' bl-page-btn--active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button className="bl-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                {'>'}
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDeleteModal
        show={!!deleteTarget}
        title="Xóa bình luận"
        message="Bạn có chắc muốn xóa bình luận này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
