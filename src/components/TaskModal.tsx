'use client';

import { useMemo, useState } from 'react';
import Modal from './Modal';
import siteData from '@/lib/text';
import { float2Int, getFoodNutrient } from '@/lib/nutrition';
import type { TaskModalProps, TaskType } from '@/types';
import styles from './ModalForm.module.scss';

const ALL = 'すべて';
const VOLUMES = Array.from({ length: 31 }, (_, i) => i * 10); // 0〜300% を 10 刻み

export default function TaskModal({ task, masters, date, action, onRemove }: TaskModalProps) {
  const [filter, setFilter] = useState<string>(ALL);
  const [masterID, setMasterID] = useState<number>(task?.masterID ?? masters[0]?.id ?? 1);
  const [volume, setVolume] = useState<number>(task?.volume ?? 100);

  const categories = useMemo(() => [ALL, ...Array.from(new Set(masters.map((m) => m.category)))], [masters]);

  const masterList = useMemo(
    () => (filter === ALL ? masters : masters.filter((m) => m.category === filter)),
    [masters, filter]
  );

  const nutrient = useMemo(
    () => getFoodNutrient({ masterID, volume, date, id: task?.id }, masters),
    [masterID, volume, date, task?.id, masters]
  );

  const saveTask = () => {
    const item: TaskType = { id: task?.id, date, masterID: Number(masterID), volume };
    action(item);
  };

  return (
    <Modal title={siteData.task} onClose={() => action()}>
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>{siteData.category}</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{siteData.name}</label>
          <select value={masterID} onChange={(e) => setMasterID(Number(e.target.value))}>
            {masterList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{siteData.volume}</label>
          <select value={volume} onChange={(e) => setVolume(Number(e.target.value))}>
            {VOLUMES.map((v) => (
              <option key={v} value={v}>
                {v}%
              </option>
            ))}
          </select>
        </div>

        <div className={styles.preview}>
          <div className={styles.cell}>
            <span className={styles.key}>{siteData.protein}</span>
            <span className={styles.value}>{float2Int(nutrient.protein)}</span>
          </div>
          <div className={styles.cell}>
            <span className={styles.key}>{siteData.carbohydrate}</span>
            <span className={styles.value}>{float2Int(nutrient.carbohydrate)}</span>
          </div>
          <div className={styles.cell}>
            <span className={styles.key}>{siteData.fat}</span>
            <span className={styles.value}>{float2Int(nutrient.fat)}</span>
          </div>
          <div className={styles.cell}>
            <span className={styles.key}>{siteData.calorie}</span>
            <span className={styles.value}>{float2Int(nutrient.calorie)}</span>
          </div>
        </div>

        <button type="button" className={styles.save} onClick={saveTask}>
          {siteData.save}
        </button>

        {task?.id !== undefined && onRemove && (
          <button type="button" className={styles.remove} onClick={onRemove}>
            {siteData.remove}
          </button>
        )}
      </div>
    </Modal>
  );
}
