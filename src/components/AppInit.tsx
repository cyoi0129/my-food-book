'use client';

import { useEffect } from 'react';
import { db } from '@/lib/db';
import { initUserStorage } from '@/lib/storage';
import { normalizeDateString } from '@/lib/date';

// 起動時の副作用をまとめて実行する（DOM は描画しない）。
// 1) localStorage の user プロフィール初期化
// 2) 旧ロケール依存日付 → ISO 正規化（一度だけ、dateMigrated フラグで二重実行防止）
// 3) 軽量 Service Worker 登録
async function migrateDates(): Promise<void> {
  if (localStorage.getItem('dateMigrated') === '1') return;

  const [tasks, histories] = await Promise.all([db.task.toArray(), db.history.toArray()]);

  await Promise.all([
    ...tasks.map((t) => {
      const iso = normalizeDateString(t.date);
      return t.id !== undefined && iso !== t.date ? db.task.update(t.id, { date: iso }) : undefined;
    }),
    ...histories.map((h) => {
      const iso = normalizeDateString(h.date);
      return h.id !== undefined && iso !== h.date ? db.history.update(h.id, { date: iso }) : undefined;
    }),
  ]);

  localStorage.setItem('dateMigrated', '1');
}

// localStorage の糖質キー sugar → carbohydrate 移行（旧プロフィールの値を引き継ぐ）。
function migrateStorageKeys(): void {
  const legacy = localStorage.getItem('sugar');
  if (legacy === null) return;
  if (localStorage.getItem('carbohydrate') === null) {
    localStorage.setItem('carbohydrate', legacy);
  }
  localStorage.removeItem('sugar');
}

export default function AppInit() {
  useEffect(() => {
    migrateStorageKeys();
    initUserStorage();
    migrateDates().catch((e) => console.error('date migration failed', e));

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((e) => console.error('sw register failed', e));
    }
  }, []);

  return null;
}
