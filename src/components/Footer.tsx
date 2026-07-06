'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuChartLine, LuCalendarDays, LuBeef, LuUser } from 'react-icons/lu';
import type { IconType } from 'react-icons';
import siteData from '@/lib/text';
import styles from './Footer.module.scss';

const tabs: { href: string; label: string; Icon: IconType }[] = [
  { href: '/', label: siteData.summary, Icon: LuChartLine },
  { href: '/task', label: siteData.task, Icon: LuCalendarDays },
  { href: '/master', label: siteData.master, Icon: LuBeef },
  { href: '/user', label: siteData.user, Icon: LuUser },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className={styles.footer}>
      <ul className={styles.tabs}>
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={active ? `${styles.tab} ${styles.active}` : styles.tab}
                aria-current={active ? 'page' : undefined}
              >
                <Icon aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </footer>
  );
}
