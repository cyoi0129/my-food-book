import { FoodNutrientType, MasterType, TaskType } from '@/types';

export const calc4day = (age: string, gender: 'male' | 'female', term: 'diet' | 'normal', height: string, weight: string) => {
  // 糖質 4kcal / 脂質 9kcal / タンパク質 4kcal
  const protein = Number(weight) * 2;
  const carbohydrate = Number(weight) * 4;

  const base =
    gender === 'male'
      ? 13.397 * Number(weight) + 4.799 * Number(height) - 5.677 * Number(age) + 88.362
      : 9.247 * Number(weight) + 3.098 * Number(height) - 4.33 * Number(age) + 447.593;
  const calorie = term === 'diet' ? base * 1.375 : base * 1.55;
  const fat = (calorie - protein * 4 - carbohydrate * 4) / 9;

  return {
    protein: Math.floor(protein),
    carbohydrate: Math.floor(carbohydrate),
    fat: Math.floor(fat),
    calorie: Math.floor(calorie),
  };
};

export const calcCalorie = (protein: string, carbohydrate: string, fat: string): number => {
  return Number(protein) * 4 + Number(carbohydrate) * 4 + Number(fat) * 9;
};

export const calc4sports = (weight: number, time: number): number => {
  return 5 * weight * time * 1.05;
};

export const getFoodNutrient = (task: TaskType, masters: MasterType[]): FoodNutrientType => {
  const target = masters.find((master) => master.id === task.masterID);
  if (!target) return { protein: 0, carbohydrate: 0, fat: 0, calorie: 0 };
  return {
    protein: (target.protein * task.volume) / 100,
    carbohydrate: (target.carbohydrate * task.volume) / 100,
    fat: (target.fat * task.volume) / 100,
    calorie: (target.calorie * task.volume) / 100,
  };
};

export const getFoodListNutrient = (tasks: TaskType[], masters: MasterType[]): FoodNutrientType => {
  const result: FoodNutrientType = { protein: 0, carbohydrate: 0, fat: 0, calorie: 0 };
  tasks.forEach((task) => {
    const target = masters.find((master) => master.id === task.masterID);
    if (!target) return;
    result.protein += (target.protein * task.volume) / 100;
    result.carbohydrate += (target.carbohydrate * task.volume) / 100;
    result.fat += (target.fat * task.volume) / 100;
    result.calorie += (target.calorie * task.volume) / 100;
  });
  return result;
};

export const float2Int = (float: number | null | undefined): number => {
  return Math.floor(float ? float : 0);
};

export const convert2Int = (data: string, max?: number): string => {
  const result = data.replace(/[^0-9]/g, '');
  if (max && Number(result) > max) return '';
  return result;
};
