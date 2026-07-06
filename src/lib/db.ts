import Dexie, { Table } from 'dexie';
import { MasterType, TaskType, HistoryType } from '@/types';

// 既存アプリと同一のスキーマ・DB名を維持し、現行ユーザーのデータをそのまま引き継ぐ。
export class MyFoodBookDexie extends Dexie {
  master!: Table<MasterType, number>;
  task!: Table<TaskType, number>;
  history!: Table<HistoryType, number>;

  constructor() {
    super('myDatabase');
    // v1: 旧スキーマ（栄養素名 sugar）。既存ユーザーの DB はこの版で作られている。
    this.version(1).stores({
      master: '++id, name, category, protein, sugar, fat, calorie',
      task: '++id, date, master, volume',
      history: '++id, date, weight, protein, sugar, fat, calorie',
    });
    // v2: 糖質の名称を sugar → carbohydrate へ是正。
    // 索引名を変更し、既存レコードのプロパティ sugar を carbohydrate へ移し替える（データ継続）。
    this.version(2)
      .stores({
        master: '++id, name, category, protein, carbohydrate, fat, calorie',
        task: '++id, date, master, volume',
        history: '++id, date, weight, protein, carbohydrate, fat, calorie',
      })
      .upgrade(async (tx) => {
        const rename = (row: Record<string, unknown>) => {
          if ('sugar' in row) {
            row.carbohydrate = row.sugar;
            delete row.sugar;
          }
        };
        await tx.table('master').toCollection().modify(rename);
        await tx.table('history').toCollection().modify(rename);
      });
  }
}

export const db = new MyFoodBookDexie();
