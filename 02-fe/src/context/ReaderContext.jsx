import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getLibrary as apiGetLibrary,
  addToLibraryAPI,
  removeFromLibraryAPI,
} from '../api/userService';
import {
  getHistory as apiGetHistory,
  saveHistory as apiSaveHistory,
  removeFromHistory as apiRemoveHistory,
} from '../api/historyService';

const ReaderContext = createContext(null);

// Fallback keys cho localStorage (chỉ dùng khi chưa đăng nhập)
const KEY_HISTORY = 'qibao_reading_history';
const KEY_LIBRARY = 'qibao_library';

function loadStorage(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

export function ReaderProvider({ children }) {
  const { currentUser } = useAuth();
  const isLoggedIn = !!currentUser?.userid;

  // State — có thể khởi tạo từ localStorage để tránh flash
  const [readingHistory, setReadingHistory] = useState(() => loadStorage(KEY_HISTORY, []));
  const [library,        setLibrary]        = useState(() => loadStorage(KEY_LIBRARY, []));

  // Khi đăng nhập, load dữ liệu từ server
  useEffect(() => {
    if (!isLoggedIn) return;
    const userid = currentUser.userid;

    apiGetLibrary(userid).then(data => {
      if (Array.isArray(data)) setLibrary(data);
    }).catch(() => {});

    apiGetHistory(userid).then(data => {
      if (Array.isArray(data)) setReadingHistory(data);
    }).catch(() => {});
  }, [isLoggedIn, currentUser?.userid]);

  // ── HISTORY ──────────────────────────────────────────────────────

  /**
   * Ghi lịch sử đọc (gọi khi user mở 1 chương)
   * item: { storyid, chapterid, storyTitle, storyCover, chaptername }
   */
  const addToHistory = useCallback(async (item) => {
    if (isLoggedIn) {
      try {
        await apiSaveHistory(currentUser.userid, {
          storyid:   item.storyid,
          chapterid: item.chapterid,
        });
        // Reload lịch sử từ server để có data đầy đủ
        const fresh = await apiGetHistory(currentUser.userid);
        if (Array.isArray(fresh)) setReadingHistory(fresh);
      } catch (e) { console.warn('Không thể lưu lịch sử:', e); }
    } else {
      // Chưa đăng nhập: lưu localStorage như cũ
      setReadingHistory(prev => {
        const filtered = prev.filter(i => i.storyid !== item.storyid);
        const next = [{ ...item, id: Date.now() }, ...filtered].slice(0, 10);
        try { localStorage.setItem(KEY_HISTORY, JSON.stringify(next)); } catch {}
        return next;
      });
    }
  }, [isLoggedIn, currentUser?.userid]);

  const removeFromHistory = useCallback(async (storyid) => {
    if (isLoggedIn) {
      try {
        const updated = await apiRemoveHistory(currentUser.userid, storyid);
        if (Array.isArray(updated)) setReadingHistory(updated);
      } catch {}
    } else {
      setReadingHistory(prev => {
        const next = prev.filter(i => i.storyid !== storyid && i.id !== storyid);
        try { localStorage.setItem(KEY_HISTORY, JSON.stringify(next)); } catch {}
        return next;
      });
    }
  }, [isLoggedIn, currentUser?.userid]);

  // ── LIBRARY ───────────────────────────────────────────────────────

  const isInLibrary = useCallback((storyid) => {
    return library.some(s => Number(s.storyid) === Number(storyid));
  }, [library]);

  const addToLibrary = useCallback(async (story) => {
    if (isInLibrary(story.storyid)) return;
    if (isLoggedIn) {
      try {
        await addToLibraryAPI(currentUser.userid, story.storyid);
        const fresh = await apiGetLibrary(currentUser.userid);
        if (Array.isArray(fresh)) setLibrary(fresh);
      } catch {}
    } else {
      setLibrary(prev => {
        const next = [{ ...story, savedat: new Date().toISOString() }, ...prev];
        try { localStorage.setItem(KEY_LIBRARY, JSON.stringify(next)); } catch {}
        return next;
      });
    }
  }, [isLoggedIn, currentUser?.userid, isInLibrary]);

  const removeFromLibrary = useCallback(async (storyid) => {
    if (isLoggedIn) {
      try {
        await removeFromLibraryAPI(currentUser.userid, storyid);
        const fresh = await apiGetLibrary(currentUser.userid);
        if (Array.isArray(fresh)) setLibrary(fresh);
      } catch {}
    } else {
      setLibrary(prev => {
        const next = prev.filter(s => Number(s.storyid) !== Number(storyid));
        try { localStorage.setItem(KEY_LIBRARY, JSON.stringify(next)); } catch {}
        return next;
      });
    }
  }, [isLoggedIn, currentUser?.userid]);

  return (
    <ReaderContext.Provider value={{
      readingHistory, library,
      addToHistory, removeFromHistory,
      isInLibrary, addToLibrary, removeFromLibrary,
    }}>
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error('useReader must be used inside <ReaderProvider>');
  return ctx;
}
