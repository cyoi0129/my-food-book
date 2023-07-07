export interface UserType {
  age: number|null;
  term: 'diet'|'normal';
  gender: 'male'|'female';
  height: number|null;
  weight: number|null;
  protein: number;
  sugar: number;
  fat: number;
  calorie: number;
}

export interface MasterType {
  id?: number;
  name: string;
  category: string;
  protein: number;
  sugar: number;
  fat: number;
  calorie: number;
}

export interface HistoryType {
  id?: number;
  date: string;
  weight: number;
  protein: number;
  sugar: number;
  fat: number;
  calorie: number;
}

export interface TaskType {
  id?: number;
  date: string;
  masterID: number;
  volume: number;
}

export interface FoodNutrientType {
  protein: number;
  sugar: number;
  fat: number;
  calorie: number;
}

export interface MasterModalProps {
  master?: MasterType;
  action: any;
}

export interface TaskModalProps {
  task?: TaskType;
  masters: MasterType[];
  date: string;
  action: any;
}

export interface ConfirmModalProps {
  action: any;
}

export interface MasterItemProps {
  master: MasterType;
}

export interface TaskItemProps {
  masterID: number;
  volume: number;
}

export interface ChartProps {
  label: string[];
  data: HistoryType[];
}