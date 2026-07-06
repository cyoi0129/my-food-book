'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuX } from 'react-icons/lu';
import styles from './Modal.module.scss';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

// document.body への Portal で描画し、main の max-width / transform の影響を受けないようにする。
// オーバーレイは全画面、コンテンツは最大幅 480px。
export default function Modal({ title, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <LuX aria-hidden />
        </button>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
