export interface UserType {
  age: number | null;
  term: 'diet' | 'normal';
  gender: 'male' | 'female';
  height: number | null;
  weight: number | null;
  protein: number;
  carbohydrate: number;
  fat: number;
  calorie: number;
}

export interface MasterType {
  id?: number;
  name: string;
  category: string;
  protein: number;
  carbohydrate: number;
  fat: number;
  calorie: number;
}

export interface HistoryType {
  id?: number;
  date: string;
  weight: number;
  protein: number;
  carbohydrate: number;
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
  carbohydrate: number;
  fat: number;
  calorie: number;
}

export type Nutrient = 'protein' | 'carbohydrate' | 'fat' | 'calorie';

export interface MasterModalProps {
  master?: MasterType;
  action: (master?: MasterType) => void;
  onRemove?: () => void;
}

export interface TaskModalProps {
  task?: TaskType;
  masters: MasterType[];
  date: string;
  action: (task?: TaskType) => void;
  onRemove?: () => void;
}

export interface ConfirmModalProps {
  action: (remove: boolean) => void;
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
