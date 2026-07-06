'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { LuPlus, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { db } from '@/lib/db';
import siteData from '@/lib/text';
import { addDaysISO, todayISO, weekdayIndex } from '@/lib/date';
import { convert2Int, float2Int, getFoodListNutrient } from '@/lib/nutrition';
import { getUserStorage } from '@/lib/storage';
import { useFeedback } from '@/components/FeedbackProvider';
import TaskItem from '@/components/TaskItem';
import TaskModal from '@/components/TaskModal';
import RemoveModal from '@/components/RemoveModal';
import type { Nutrient, TaskType, UserType } from '@/types';
import styles from './Task.module.scss';

export default function TaskPage() {
  const { run } = useFeedback();
  const taskData = useLiveQuery(() => db.task.toArray());
  const masterData = useLiveQuery(() => db.master.toArray());
  const historyData = useLiveQuery(() => db.history.toArray());

  const [targetDate, setTargetDate] = useState<string>(todayISO());
  const [weight, setWeight] = useState('');
  const [userData, setUserData] = useState<UserType | null>(null);
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState<TaskType | undefined>(undefined);
  const [showRemove, setShowRemove] = useState(false);

  // 派生値はすべて useMemo で算出（重複 effect / stale state を避ける）。
  const masters = useMemo(() => masterData ?? [], [masterData]);
  const tasks = useMemo(() => (taskData ?? []).filter((t) => t.date === targetDate), [taskData, targetDate]);
  const history = useMemo(() => (historyData ?? []).find((h) => h.date === targetDate), [historyData, targetDate]);
  const nutrient = useMemo(() => getFoodListNutrient(tasks, masters), [tasks, masters]);

  useEffect(() => {
    setUserData(getUserStorage());
  }, []);

  // 日付に紐づく体重を入力欄へ反映（履歴があれば復元、なければ空）。
  useEffect(() => {
    setWeight(history ? String(history.weight) : '');
  }, [history]);

  const checkOver = (key: Nutrient): boolean => !!userData && nutrient[key] > userData[key];

  const editTask = (t: TaskType) => {
    setCurrent(t);
    setEditing(true);
  };

  // 編集モーダル内の削除ボタン → モーダルを閉じて確認モーダルを開く。
  const requestRemove = () => {
    setEditing(false);
    setShowRemove(true);
  };

  const modalProcess = (task?: TaskType) => {
    setEditing(false);
    if (!task) return;
    run(async () => {
      const { id, ...rest } = task;
      if (id === undefined) await db.task.add(rest);
      else await db.task.update(id, rest);
    });
  };

  const removeProcess = (remove: boolean) => {
    setShowRemove(false);
    if (!remove || current?.id === undefined) return;
    const id = current.id;
    run(async () => {
      await db.task.delete(id);
    });
  };

  const saveHistory = () =>
    run(async () => {
      const record = {
        date: targetDate,
        weight: Number(weight),
        protein: nutrient.protein,
        carbohydrate: nutrient.carbohydrate,
        fat: nutrient.fat,
        calorie: nutrient.calorie,
      };
      if (history?.id === undefined) await db.history.add(record);
      else await db.history.update(history.id, record);
    });

  const summary: { key: Nutrient; label: string }[] = [
    { key: 'protein', label: siteData.protein },
    { key: 'carbohydrate', label: siteData.carbohydrate },
    { key: 'fat', label: siteData.fat },
    { key: 'calorie', label: siteData.calorie },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.dateBar}>
        <button type="button" className={styles.nav} aria-label="Previous day" onClick={() => setTargetDate((d) => addDaysISO(d, -1))}>
          <LuChevronLeft aria-hidden />
        </button>
        <label className={styles.datePick}>
          <span className={styles.dateText}>
            {targetDate} ({siteData.weekdays[weekdayIndex(targetDate)]})
          </span>
          <input type="date" value={targetDate} onChange={(e) => e.target.value && setTargetDate(e.target.value)} />
        </label>
        <button type="button" className={styles.nav} aria-label="Next day" onClick={() => setTargetDate((d) => addDaysISO(d, 1))}>
          <LuChevronRight aria-hidden />
        </button>
      </div>

      <div className={styles.weightRow}>
        <span className={styles.weightLabel}>{siteData.weight}</span>
        <input
          className={styles.weightInput}
          inputMode="numeric"
          value={weight}
          onChange={(e) => setWeight(convert2Int(e.target.value, 200))}
        />
      </div>

      <div className={styles.summary}>
        {summary.map(({ key, label }) => (
          <div key={key} className={checkOver(key) ? `${styles.stat} ${styles.over}` : styles.stat}>
            <span className={styles.statLabel}>{label}</span>
            <span className={styles.statValue}>{float2Int(nutrient[key])}</span>
            <span className={styles.statTarget}>/ {userData?.[key] ?? 0}</span>
          </div>
        ))}
      </div>

      <div className={styles.foods}>
        <h2 className={styles.heading}>{siteData.foods}</h2>
        <ul className={styles.list}>
          {tasks.map((task) => (
            <li key={task.id} className={styles.card} onClick={() => editTask(task)}>
              <TaskItem masterID={task.masterID} volume={task.volume} />
            </li>
          ))}
        </ul>
      </div>

      <button type="button" className={styles.save} onClick={saveHistory}>
        {siteData.save}
      </button>

      <button
        type="button"
        className={styles.fab}
        aria-label="Add meal"
        onClick={() => {
          setCurrent(undefined);
          setEditing(true);
        }}
      >
        <LuPlus aria-hidden />
      </button>

      {editing && (
        <TaskModal task={current} masters={masters} date={targetDate} action={modalProcess} onRemove={requestRemove} />
      )}
      {showRemove && <RemoveModal action={removeProcess} />}
    </div>
  );
}
