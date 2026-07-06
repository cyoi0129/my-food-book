'use client';

import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import siteData from '@/lib/text';
import { addDaysISO, createDateList, todayISO } from '@/lib/date';
import WeightChart from '@/components/WeightChart';
import NutrientChart from '@/components/NutrientChart';
import type { HistoryType } from '@/types';
import styles from './Home.module.scss';

export default function HomePage() {
  const historyData = useLiveQuery(() => db.history.toArray());

  const [start, setStart] = useState<string>(addDaysISO(todayISO(), -7));
  const [end, setEnd] = useState<string>(todayISO());

  // 期間内の各日について history を引き当て（無ければ 0 埋め）。開始 > 終了 は空表示。
  const { labels, data } = useMemo(() => {
    if (start > end) return { labels: [] as string[], data: [] as HistoryType[] };
    const list = createDateList(start, end);
    const rows = list.map<HistoryType>((date) => {
      const found = (historyData ?? []).find((h) => h.date === date);
      return found ?? { date, weight: 0, protein: 0, carbohydrate: 0, fat: 0, calorie: 0 };
    });
    return { labels: list, data: rows };
  }, [start, end, historyData]);

  return (
    <div className={styles.page}>
      <div className={styles.term}>
        <label className={styles.field}>
          <input type="date" value={start} max={end} onChange={(e) => e.target.value && setStart(e.target.value)} />
        </label>
        <span className={styles.tilde}>〜</span>
        <label className={styles.field}>
          <input type="date" value={end} min={start} onChange={(e) => e.target.value && setEnd(e.target.value)} />
        </label>
      </div>

      <section className={styles.card}>
        <h2 className={styles.heading}>
          {siteData.weight} / {siteData.calorie}
        </h2>
        <WeightChart label={labels} data={data} />
      </section>

      <section className={styles.card}>
        <h2 className={styles.heading}>{siteData.nutrient}</h2>
        <NutrientChart label={labels} data={data} />
      </section>
    </div>
  );
}
