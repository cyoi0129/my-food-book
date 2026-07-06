'use client';

import Modal from './Modal';
import siteData from '@/lib/text';
import type { ConfirmModalProps } from '@/types';
import styles from './RemoveModal.module.scss';

export default function RemoveModal({ action }: ConfirmModalProps) {
  return (
    <Modal title={siteData.warning} onClose={() => action(false)}>
      <p className={styles.message}>{siteData.confirm}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.remove} onClick={() => action(true)}>
          {siteData.remove}
        </button>
        <button type="button" className={styles.cancel} onClick={() => action(false)}>
          {siteData.cancel}
        </button>
      </div>
    </Modal>
  );
}
