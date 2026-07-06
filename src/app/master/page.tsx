'use client';

import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { LuPlus } from 'react-icons/lu';
import { db } from '@/lib/db';
import { useFeedback } from '@/components/FeedbackProvider';
import MasterItem from '@/components/MasterItem';
import MasterModal from '@/components/MasterModal';
import RemoveModal from '@/components/RemoveModal';
import type { MasterType } from '@/types';
import styles from './Master.module.scss';

const ALL = 'すべて';

export default function MasterPage() {
  const { run } = useFeedback();
  const masterData = useLiveQuery(() => db.master.toArray());

  const [filter, setFilter] = useState<string>(ALL);
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState<MasterType | undefined>(undefined);
  const [showRemove, setShowRemove] = useState(false);

  const masters = masterData ?? [];
  const categories = useMemo(() => [ALL, ...Array.from(new Set(masters.map((m) => m.category)))], [masters]);
  const visible = useMemo(
    () => (filter === ALL ? masters : masters.filter((m) => m.category === filter)),
    [masters, filter]
  );

  const editMaster = (m: MasterType) => {
    setCurrent(m);
    setEditing(true);
  };

  const modalProcess = (master?: MasterType) => {
    setEditing(false);
    if (!master) return;
    run(async () => {
      const { id, ...rest } = master;
      if (id === undefined) await db.master.add(rest);
      else await db.master.update(id, rest);
    });
  };

  // 編集モーダル内の削除ボタン → モーダルを閉じて確認モーダルを開く。
  const requestRemove = () => {
    setEditing(false);
    setShowRemove(true);
  };

  const removeProcess = (remove: boolean) => {
    setShowRemove(false);
    if (!remove || current?.id === undefined) return;
    const id = current.id;
    run(async () => {
      await db.master.delete(id);
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.filter}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <ul className={styles.list}>
        {visible.map((master) => (
          <li key={master.id} className={styles.card} onClick={() => editMaster(master)}>
            <MasterItem master={master} />
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={styles.fab}
        aria-label="Add"
        onClick={() => {
          setCurrent(undefined);
          setEditing(true);
        }}
      >
        <LuPlus aria-hidden />
      </button>

      {editing && <MasterModal master={current} action={modalProcess} onRemove={requestRemove} />}
      {showRemove && <RemoveModal action={removeProcess} />}
    </div>
  );
}
