import { UserType } from './types';

export const initUserStorage = (): void => {
  if (localStorage.getItem('user')) return;
  ['age', 'gender', 'term', 'height', 'weight', 'protein', 'sugar', 'fat', 'calorie'].map((item) => {
    localStorage.setItem(item, '');
    localStorage.setItem('user', '1');
  });
};

export const updateUserStorage = (data: UserType): void => {
  localStorage.setItem('age', String(data.age));
  localStorage.setItem('gender', data.gender);
  localStorage.setItem('term', data.term);
  localStorage.setItem('height', String(data.height));
  localStorage.setItem('weight', String(data.weight));
  localStorage.setItem('protein', String(data.protein));
  localStorage.setItem('sugar', String(data.sugar));
  localStorage.setItem('fat', String(data.fat));
  localStorage.setItem('calorie', String(data.calorie));
};

export const changeUserWeightStorage = (weight: number): void => {
  localStorage.setItem('weight', String(weight));
};

export const getUserStorage = (): UserType => {
  return {
    age: Number(localStorage.getItem('age')),
    gender: localStorage.getItem('gender') === 'female' ? 'female' : 'male',
    term: localStorage.getItem('term') === 'diet' ? 'diet' : 'normal',
    height: Number(localStorage.getItem('height')),
    weight: Number(localStorage.getItem('weight')),
    protein: Number(localStorage.getItem('protein')),
    sugar: Number(localStorage.getItem('sugar')),
    fat: Number(localStorage.getItem('fat')),
    calorie: Number(localStorage.getItem('calorie')),
  };
};
