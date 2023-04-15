import Dexie, { Table } from 'dexie';
import { MasterType, TaskType, HistoryType } from './types';
 
export class MySubClassedDexie extends Dexie {
    master!: Table<MasterType>;
    task!: Table<TaskType>;
    history!: Table<HistoryType>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      master: '++id, name, category, protein, sugar, fat, calorie',
      task: '++id, date, master, volume',
      history: '++id, date, weight, protein, sugar, fat, calorie',
    });
  }
}
 
export const db = new MySubClassedDexie();