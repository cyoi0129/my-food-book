'use client';

import { useMemo, useState } from 'react';
import Modal from './Modal';
import siteData from '@/lib/text';
import { calcCalorie, convert2Int } from '@/lib/nutrition';
import type { MasterModalProps, MasterType } from '@/types';
import styles from './ModalForm.module.scss';

export default function MasterModal({ master, action, onRemove }: MasterModalProps) {
  const [name, setName] = useState<string>(master?.name ?? '');
  const [category, setCategory] = useState<string>(master?.category ?? '');
  const [protein, setProtein] = useState<string>(master ? String(master.protein) : '');
  const [carbohydrate, setCarbohydrate] = useState<string>(master ? String(master.carbohydrate) : '');
  const [fat, setFat] = useState<string>(master ? String(master.fat) : '');

  const calorie = useMemo(() => calcCalorie(protein, carbohydrate, fat), [protein, carbohydrate, fat]);

  const saveMaster = () => {
    const item: MasterType = {
      id: master?.id,
      name,
      category,
      protein: Number(protein),
      carbohydrate: Number(carbohydrate),
      fat: Number(fat),
      calorie,
    };
    action(item);
  };

  return (
    <Modal title={siteData.master} onClose={() => action()}>
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>{siteData.name}</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{siteData.category}</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{siteData.protein}</label>
          <input inputMode="numeric" value={protein} onChange={(e) => setProtein(convert2Int(e.target.value, 500))} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{siteData.carbohydrate}</label>
          <input inputMode="numeric" value={carbohydrate} onChange={(e) => setCarbohydrate(convert2Int(e.target.value, 500))} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{siteData.fat}</label>
          <input inputMode="numeric" value={fat} onChange={(e) => setFat(convert2Int(e.target.value, 500))} />
        </div>

        <div className={styles.preview}>
          <div className={styles.cell}>
            <span className={styles.key}>{siteData.calorie}</span>
            <span className={styles.value}>{calorie}</span>
          </div>
        </div>

        <button type="button" className={styles.save} onClick={saveMaster}>
          {siteData.save}
        </button>

        {master?.id !== undefined && onRemove && (
          <button type="button" className={styles.remove} onClick={onRemove}>
            {siteData.remove}
          </button>
        )}
      </div>
    </Modal>
  );
}
