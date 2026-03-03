import { createContext, useContext, useState } from 'react';

const ReaderContext = createContext(null);

const KEY_HISTORY = 'qibao_reading_history';
const KEY_LIBRARY = 'qibao_library';
const MAX_HISTORY = 5;

function loadStorage(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

function saveStorage(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export function ReaderProvider({ children }) {
  const [readingHistory, setReadingHistory] = useState(() => loadStorage(KEY_HISTORY, []));
  const [library, setLibrary] = useState(() => loadStorage(KEY_LIBRARY, []));

  const addToHistory = (item) => {
    setReadingHistory(prev => {
      const filtered = prev.filter(i => i.storyid !== item.storyid);
      const next = [item, ...filtered].slice(0, MAX_HISTORY);
      saveStorage(KEY_HISTORY, next);
      return next;
    });
  };

  const removeFromHistory = (id) => {
    setReadingHistory(prev => {
      const next = prev.filter(i => i.id !== id);
      saveStorage(KEY_HISTORY, next);
      return next;
    });
  };

  const isInLibrary = (storyid) => library.some(s => s.storyid === storyid);

  const addToLibrary = (story) => {
    if (isInLibrary(story.storyid)) return;
    setLibrary(prev => {
      const next = [{ ...story, savedat: Date.now() }, ...prev];
      saveStorage(KEY_LIBRARY, next);
      return next;
    });
  };

  const removeFromLibrary = (storyid) => {
    setLibrary(prev => {
      const next = prev.filter(s => s.storyid !== storyid);
      saveStorage(KEY_LIBRARY, next);
      return next;
    });
  };

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
