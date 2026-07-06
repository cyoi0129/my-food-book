import { LuCircleCheck, LuCircleAlert } from 'react-icons/lu';
import siteData from '@/lib/text';
import styles from './Notice.module.scss';

interface NoticeProps {
  message?: string;
  type?: 'success' | 'error';
}

export default function Notice({ message, type = 'success' }: NoticeProps) {
  const text = message ?? (type === 'error' ? siteData.warning : siteData.notice);
  const className = type === 'error' ? `${styles.notice} ${styles.error}` : styles.notice;

  return (
    <div className={className} role="status" aria-live="polite">
      {type === 'error' ? <LuCircleAlert aria-hidden /> : <LuCircleCheck aria-hidden />}
      <span>{text}</span>
    </div>
  );
}
