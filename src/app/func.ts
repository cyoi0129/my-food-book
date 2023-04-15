import { FoodNutrientType, MasterType, TaskType } from './types';

export const calc4day = (age: string, gender: 'male' | 'female', term: 'diet' | 'normal', height: string, weight: string) => {
  // 糖質 4kcal 脂質 9kcal タンパク質 4kcal
  const protein: number = Number(weight) * 2;
  const sugar: number = term === 'diet' ? 50 : 160;
  const calorie: number = gender === 'male' ? 13.397 * Number(weight) + 4.799 * Number(height) - 5.677 * Number(age) + 88.362 : 9.247 * Number(weight) + 3.098 * Number(height) - 4.33 * Number(age) + 447.593;
  const fat: number = (calorie - protein * 4 - sugar * 4) / 9;
  return {
    protein: Math.floor(protein),
    sugar: Math.floor(sugar),
    fat: Math.floor(fat),
    calorie: Math.floor(calorie),
  };
};

export const calcCalorie = (protein: string, sugar: string, fat: string): number => {
  return Number(protein) * 4 + Number(sugar) * 4 + Number(fat) * 9;
};

export const calc4sports = (weight: number, time: number): number => {
  return 5 * weight * time * 1.05;
};

export const getFoodNutrient = (task: TaskType, masters: MasterType[]): FoodNutrientType => {
  let result = {
    protein: 0,
    sugar: 0,
    fat: 0,
    calorie: 0,
  };
  const targetMaster = masters.find((master) => master.id === task.masterID);
  if (targetMaster !== undefined) {
    result = {
      protein: (targetMaster.protein * task.volume) / 100,
      sugar: (targetMaster.sugar * task.volume) / 100,
      fat: (targetMaster.fat * task.volume) / 100,
      calorie: (targetMaster.calorie * task.volume) / 100,
    };
  }
  return result;
};

export const getFoodListNutrient = (tasks: TaskType[], masters: MasterType[]): FoodNutrientType => {
  let result = {
    protein: 0,
    sugar: 0,
    fat: 0,
    calorie: 0,
  };
  tasks.map((task) => {
    const targetMaster = masters.find((master) => master.id === task.masterID);
    if (targetMaster !== undefined) {
      result.protein += (targetMaster.protein * task.volume) / 100;
      result.sugar += (targetMaster.sugar * task.volume) / 100;
      result.fat += (targetMaster.fat * task.volume) / 100;
      result.calorie += (targetMaster.calorie * task.volume) / 100;
    }
  });
  return result;
};

export const createDateList = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  let dateList = new Array();
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    dateList.push(d.toLocaleDateString());
  }
  return dateList;
};

export const float2Int = (float: number | null | undefined): number => {
  return Math.floor(float ? float : 0);
};

export const convert2Int = (data: string, max?: number): string => {
  let result = data.replace(/[^0-9]/g, '');
  if (max && Number(result) > max) return '';
  return result;
}