'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { LuEgg, LuCookie, LuDroplet, LuFlame, LuPercent } from 'react-icons/lu';
import { db } from '@/lib/db';
import { float2Int } from '@/lib/nutrition';
import type { TaskItemProps } from '@/types';
import styles from './FoodItem.module.scss';

export default function TaskItem({ masterID, volume }: TaskItemProps) {
  const master = useLiveQuery(() => db.master.get(masterID), [masterID]);

  const scale = (value = 0) => float2Int((value * volume) / 100);

  return (
    <>
      <div className={styles.head}>
        <span className={styles.name}>{master?.name ?? '-'}</span>
        <span className={styles.category}>{master?.category ?? ''}</span>
      </div>
      <div className={styles.nutrient}>
        <span className={`${styles.item} ${styles.protein}`}>
          <LuEgg aria-hidden />
          <b>{scale(master?.protein)}</b>
        </span>
        <span className={`${styles.item} ${styles.carbohydrate}`}>
          <LuCookie aria-hidden />
          <b>{scale(master?.carbohydrate)}</b>
        </span>
        <span className={`${styles.item} ${styles.fat}`}>
          <LuDroplet aria-hidden />
          <b>{scale(master?.fat)}</b>
        </span>
        <span className={`${styles.item} ${styles.calorie}`}>
          <LuFlame aria-hidden />
          <b>{scale(master?.calorie)}</b>
        </span>
        <span className={`${styles.item} ${styles.volume}`}>
          <LuPercent aria-hidden />
          <b>{volume}</b>
        </span>
      </div>
    </>
  );
}
