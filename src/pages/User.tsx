import { FC, useState, useEffect } from 'react';
import siteData from '../app/util';
import { Loading, Notice, RemoveModal } from '../components';
import { initUserStorage, updateUserStorage, getUserStorage } from '../app/ls';
import { UserType, MasterType } from '../app/types';
import { calc4day, convert2Int } from '../app/func';
import { db } from '../app/db';
import nutrient from '../assets/nutrient.json';

const User: FC = () => {
  // State
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [term, setTerm] = useState<'diet'|'normal'>('normal');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [protein, setProtein] = useState<number>(0);
  const [sugar, setSugar] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [calorie, setCalorie] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<boolean>(false);
  const [showRemove, setShowRemove] = useState<boolean>(false);

  // Watch Method
  const changeGender = (gender: string) => {
    setGender(gender === 'male' ? 'male' : 'female');
  };

  const changeTerm = (term: string) => {
    setTerm(term === 'diet' ? 'diet' : 'normal');
  };

  const resetData = () => {
    setShowRemove(true);
  }

  const importData = () => {
    setLoading(true);
    addInitMaster();
  }

  // DB
  const saveData = () => {
    setLoading(true);
    const userData = {
      age: Number(age),
      gender: gender,
      term: term,
      height: Number(height),
      weight: Number(weight),
      protein: protein,
      sugar: sugar,
      fat: fat,
      calorie: calorie,
    };
    updateUserStorage(userData);
    setTimeout(() => {
      setLoading(false);
      setNotice(true);
    }, 500);
    setTimeout(() => setNotice(false), 1500);
  };

  const addInitMaster = async () => {
    const masters: MasterType[] = JSON.parse(JSON.stringify(nutrient.data));
    try {
      await db.master.bulkAdd(masters);
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setLoading(false);
      setNotice(true);
    }, 500);
    setTimeout(() => setNotice(false), 1500);
  };

  const resetProcess = async (remove: boolean) => {
    setShowRemove(false);
    if (!remove) return;
    try {
      await db.master.clear();
      await db.task.clear();
      await db.history.clear();
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
    setAge('');
    setTerm('diet');
    setGender('male');
    setHeight('');
    setWeight('');
    setProtein(0);
    setSugar(0);
    setFat(0);
    setCalorie(0);
  }

  // Calc when basic info changed
  useEffect(() => {
    if (age === null || height === null || weight === null) return;
    const basic = calc4day(age, gender, term, height, weight);
    setSugar(basic.sugar);
    setProtein(basic.protein);
    setFat(basic.fat);
    setCalorie(basic.calorie);
  }, [age, height, gender, term, weight]);

  // Init
  useEffect(() => {
    initUserStorage();
    const user = getUserStorage();
    setAge(String(user.age));
    setTerm(user.term);
    setGender(user.gender);
    setHeight(String(user.height));
    setWeight(String(user.weight));
    setProtein(user.protein);
    setSugar(user.sugar);
    setFat(user.fat);
    setCalorie(user.calorie);
  }, []);

  return (
    <div className="user">
      <dl className="info">
        <dt>{siteData.gender}</dt>
        <dd>
          <input type="radio" name="gender" value="male" onChange={(e) => changeGender(e.target.value)} checked={gender === 'male'} />
          <label htmlFor="male">{siteData.male}</label>
          <input type="radio" name="gender" value="female" onChange={(e) => changeGender(e.target.value)} checked={gender === 'female'} />
          <label htmlFor="female">{siteData.female}</label>
        </dd>
        <dt>{siteData.term}</dt>
        <dd>
          <input type="radio" name="term" value="diet" onChange={(e) => changeTerm(e.target.value)} checked={term === 'diet'} />
          <label htmlFor="diet">{siteData.diet}</label>
          <input type="radio" name="term" value="normal" onChange={(e) => changeTerm(e.target.value)} checked={term === 'normal'} />
          <label htmlFor="normal">{siteData.normal}</label>
        </dd>
        <dt>{siteData.age}</dt>
        <dd>
          <input name="age" value={String(age)} onChange={(e) => setAge(convert2Int(e.target.value, 100))} />
        </dd>
        <dt>{siteData.height}</dt>
        <dd>
          <input name="height" value={String(height)} onChange={(e) => setHeight(convert2Int(e.target.value, 200))} />
        </dd>
        <dt>{siteData.weight}</dt>
        <dd>
          <input name="weight" value={String(weight)} onChange={(e) => setWeight(convert2Int(e.target.value, 200))} />
        </dd>
        <dt>{siteData.protein}</dt>
        <dd>{protein}</dd>
        <dt>{siteData.sugar}</dt>
        <dd>{sugar}</dd>
        <dt>{siteData.fat}</dt>
        <dd>{fat}</dd>
        <dt>{siteData.calorie}</dt>
        <dd>{calorie}</dd>
      </dl>
      <button className="save" onClick={saveData}>{siteData.save}</button>
      <button className="remove" onClick={resetData}>{siteData.reset}</button>
      <button className="import" onClick={importData}>{siteData.import}</button>
      <p className="version">App version 1.1</p>
      {showRemove? <RemoveModal action={resetProcess} /> : null}
      {loading ? <Loading /> : null}
      {notice ? <Notice /> : null}
    </div>
  );
};
export default User;
