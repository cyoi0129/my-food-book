import { LuUtensils } from 'react-icons/lu';
import siteData from '@/lib/text';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <LuUtensils aria-hidden />
        <span>{siteData.siteName}</span>
      </h1>
    </header>
  );
}
