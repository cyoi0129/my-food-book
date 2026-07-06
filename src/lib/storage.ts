import { UserType } from '@/types';

const KEYS = ['age', 'gender', 'term', 'height', 'weight', 'protein', 'carbohydrate', 'fat', 'calorie'] as const;

const hasWindow = (): boolean => typeof window !== 'undefined';

export const initUserStorage = (): void => {
  if (!hasWindow()) return;
  if (localStorage.getItem('user')) return;
  KEYS.forEach((item) => localStorage.setItem(item, ''));
  localStorage.setItem('user', '1');
};

export const updateUserStorage = (data: UserType): void => {
  if (!hasWindow()) return;
  localStorage.setItem('age', String(data.age));
  localStorage.setItem('gender', data.gender);
  localStorage.setItem('term', data.term);
  localStorage.setItem('height', String(data.height));
  localStorage.setItem('weight', String(data.weight));
  localStorage.setItem('protein', String(data.protein));
  localStorage.setItem('carbohydrate', String(data.carbohydrate));
  localStorage.setItem('fat', String(data.fat));
  localStorage.setItem('calorie', String(data.calorie));
};

export const changeUserWeightStorage = (weight: number): void => {
  if (!hasWindow()) return;
  localStorage.setItem('weight', String(weight));
};

export const getUserStorage = (): UserType => {
  if (!hasWindow()) {
    return { age: 0, gender: 'male', term: 'normal', height: 0, weight: 0, protein: 0, carbohydrate: 0, fat: 0, calorie: 0 };
  }
  return {
    age: Number(localStorage.getItem('age')),
    gender: localStorage.getItem('gender') === 'female' ? 'female' : 'male',
    term: localStorage.getItem('term') === 'diet' ? 'diet' : 'normal',
    height: Number(localStorage.getItem('height')),
    weight: Number(localStorage.getItem('weight')),
    protein: Number(localStorage.getItem('protein')),
    carbohydrate: Number(localStorage.getItem('carbohydrate')),
    fat: Number(localStorage.getItem('fat')),
    calorie: Number(localStorage.getItem('calorie')),
  };
};
