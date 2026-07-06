'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/db';
import siteData from '@/lib/text';
import { calc4day, convert2Int } from '@/lib/nutrition';
import { getUserStorage, initUserStorage, updateUserStorage } from '@/lib/storage';
import { useFeedback } from '@/components/FeedbackProvider';
import RemoveModal from '@/components/RemoveModal';
import type { MasterType } from '@/types';
import nutrient from '@/assets/nutrient.json';
import styles from './User.module.scss';

export default function UserPage() {
  const { run } = useFeedback();

  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [term, setTerm] = useState<'diet' | 'normal'>('normal');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [showReset, setShowReset] = useState(false);

  // 基本情報から目標 P/S/F/カロリーを算出（派生値は useMemo）。
  const target = useMemo(() => calc4day(age, gender, term, height, weight), [age, gender, term, height, weight]);

  useEffect(() => {
    initUserStorage();
    const user = getUserStorage();
    setAge(user.age ? String(user.age) : '');
    setGender(user.gender);
    setTerm(user.term);
    setHeight(user.height ? String(user.height) : '');
    setWeight(user.weight ? String(user.weight) : '');
  }, []);

  const saveData = () =>
    run(async () => {
      updateUserStorage({
        age: Number(age),
        gender,
        term,
        height: Number(height),
        weight: Number(weight),
        ...target,
      });
    });

  const importSample = () =>
    run(async () => {
      const masters: MasterType[] = JSON.parse(JSON.stringify((nutrient as { data: MasterType[] }).data));
      await db.master.bulkAdd(masters);
    });

  const resetProcess = (remove: boolean) => {
    setShowReset(false);
    if (!remove) return;
    run(async () => {
      await Promise.all([db.master.clear(), db.task.clear(), db.history.clear()]);
      localStorage.clear();
      setAge('');
      setGender('male');
      setTerm('normal');
      setHeight('');
      setWeight('');
    });
  };

  return (
    <div className={styles.page}>
      <dl className={styles.info}>
        <dt>{siteData.gender}</dt>
        <dd>
          <div className={styles.radios}>
            <label className={gender === 'male' ? styles.on : ''}>
              <input type="radio" name="gender" checked={gender === 'male'} onChange={() => setGender('male')} />
              {siteData.male}
            </label>
            <label className={gender === 'female' ? styles.on : ''}>
              <input type="radio" name="gender" checked={gender === 'female'} onChange={() => setGender('female')} />
              {siteData.female}
            </label>
          </div>
        </dd>

        <dt>{siteData.term}</dt>
        <dd>
          <div className={styles.radios}>
            <label className={term === 'diet' ? styles.on : ''}>
              <input type="radio" name="term" checked={term === 'diet'} onChange={() => setTerm('diet')} />
              {siteData.diet}
            </label>
            <label className={term === 'normal' ? styles.on : ''}>
              <input type="radio" name="term" checked={term === 'normal'} onChange={() => setTerm('normal')} />
              {siteData.normal}
            </label>
          </div>
        </dd>

        <dt>{siteData.age}</dt>
        <dd>
          <input className={styles.input} inputMode="numeric" value={age} onChange={(e) => setAge(convert2Int(e.target.value, 100))} />
        </dd>

        <dt>{siteData.height}</dt>
        <dd>
          <input className={styles.input} inputMode="numeric" value={height} onChange={(e) => setHeight(convert2Int(e.target.value, 200))} />
        </dd>

        <dt>{siteData.weight}</dt>
        <dd>
          <input className={styles.input} inputMode="numeric" value={weight} onChange={(e) => setWeight(convert2Int(e.target.value, 200))} />
        </dd>

        <dt>{siteData.protein}</dt>
        <dd className={styles.calc}>{target.protein}</dd>
        <dt>{siteData.carbohydrate}</dt>
        <dd className={styles.calc}>{target.carbohydrate}</dd>
        <dt>{siteData.fat}</dt>
        <dd className={styles.calc}>{target.fat}</dd>
        <dt>{siteData.calorie}</dt>
        <dd className={styles.calc}>{target.calorie}</dd>
      </dl>

      <div className={styles.actions}>
        <button type="button" className={styles.save} onClick={saveData}>
          {siteData.save}
        </button>
        <button type="button" className={styles.import} onClick={importSample}>
          {siteData.import}
        </button>
        <button type="button" className={styles.reset} onClick={() => setShowReset(true)}>
          {siteData.reset}
        </button>
      </div>

      {showReset && <RemoveModal action={resetProcess} />}
    </div>
  );
}
