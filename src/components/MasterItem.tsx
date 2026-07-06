import { LuEgg, LuCookie, LuDroplet, LuFlame } from 'react-icons/lu';
import type { MasterItemProps } from '@/types';
import styles from './FoodItem.module.scss';

export default function MasterItem({ master }: MasterItemProps) {
  return (
    <>
      <div className={styles.head}>
        <span className={styles.name}>{master.name}</span>
        <span className={styles.category}>{master.category}</span>
      </div>
      <div className={styles.nutrient}>
        <span className={`${styles.item} ${styles.protein}`}>
          <LuEgg aria-hidden />
          <b>{master.protein}</b>
        </span>
        <span className={`${styles.item} ${styles.carbohydrate}`}>
          <LuCookie aria-hidden />
          <b>{master.carbohydrate}</b>
        </span>
        <span className={`${styles.item} ${styles.fat}`}>
          <LuDroplet aria-hidden />
          <b>{master.fat}</b>
        </span>
        <span className={`${styles.item} ${styles.calorie}`}>
          <LuFlame aria-hidden />
          <b>{master.calorie}</b>
        </span>
      </div>
    </>
  );
}
