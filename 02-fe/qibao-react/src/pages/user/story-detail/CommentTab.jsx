import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getCommentsByStory, submitComment } from '../../../api/commentService';
import { getAvatarColor, getRelativeTime } from '../../../utils/helpers';
import './CommentTab.css';

const PAGE_SIZE = 5;

function Avatar({ tenhienthi, size = 40 }) {
  return (
    <div
      className="bl-avatar"
      style={{ width: size, height: size, backgroundColor: getAvatarColor(tenhienthi), fontSize: size * 0.42 }}
    >
      {tenhienthi?.charAt(0)?.toUpperCase() ?? '?'}
    </div>
  );
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
    try {
      const updated = await submitComment({
        storyid,
        username:    currentUser.username,
        tenhienthi:  currentUser.tenhienthi,
        content:     content.trim(),
      });
      setComments(updated);
      setContent('');
      setPage(1);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bl-wrap">
      <div className="bl-input-area">
        {currentUser ? <Avatar tenhienthi={currentUser.tenhienthi} size={42} /> : <AvatarAnon size={42} />}
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
              <div key={cmt.cmtid} className="bl-item">
                <Avatar tenhienthi={cmt.tenhienthi} size={40} />
                <div className="bl-item__body">
                  <div className="bl-item__name">{cmt.tenhienthi}</div>
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
    </div>
  );
}
