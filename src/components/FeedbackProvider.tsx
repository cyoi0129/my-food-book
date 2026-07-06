'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import Loading from './Loading';
import Notice from './Notice';

type NoticeType = 'success' | 'error';

interface FeedbackValue {
  // 非同期処理を実行し、実行中はローディング、完了時に通知を表示する。
  // 例外時はエラー通知に切り替える（要件: エラーを Notice へ集約）。
  run: (task: () => Promise<void>, options?: { message?: string; silent?: boolean }) => Promise<void>;
  notify: (message?: string, type?: NoticeType) => void;
}

const FeedbackContext = createContext<FeedbackValue | null>(null);

const NOTICE_DURATION = 1500;

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ message?: string; type: NoticeType } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((message?: string, type: NoticeType = 'success') => {
    if (timer.current) clearTimeout(timer.current);
    setNotice({ message, type });
    timer.current = setTimeout(() => setNotice(null), NOTICE_DURATION);
  }, []);

  const run = useCallback(
    async (task: () => Promise<void>, options?: { message?: string; silent?: boolean }) => {
      setLoading(true);
      try {
        await task();
        if (!options?.silent) notify(options?.message, 'success');
      } catch (error) {
        console.error(error);
        notify(error instanceof Error ? error.message : undefined, 'error');
      } finally {
        setLoading(false);
      }
    },
    [notify]
  );

  const value = useMemo<FeedbackValue>(() => ({ run, notify }), [run, notify]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      {loading && <Loading />}
      {notice && <Notice message={notice.message} type={notice.type} />}
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackValue {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
  return ctx;
}
