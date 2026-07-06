import styles from './Loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-label="Loading">
      <span className={styles.spinner} />
    </div>
  );
}
