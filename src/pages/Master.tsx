import { FC, useState, useEffect } from 'react';
import { MasterModal, MasterItem, RemoveModal, Loading, Notice } from '../components';
import siteData from '../app/util';
import { MasterType } from '../app/types';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../app/db';
import { useLongPress, LongPressDetectEvents } from 'use-long-press';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Master: FC = () => {
  // State
  const [editing, setEditing] = useState<boolean>(false);
  const [masters, setMasters] = useState<MasterType[]>([]);
  const [currentMaster, setCurrentMaster] = useState<MasterType | undefined>(undefined);
  const [showRemove, setShowRemove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<string | 'すべて'>('すべて');

  // Watch Method
  const editMaster = (master: MasterType) => {
    setCurrentMaster(master);
    setEditing(true);
  };

  const addMaster = () => {
    setCurrentMaster(undefined);
    setEditing(true);
  };

  const longPress = useLongPress(() => setShowRemove(true), {
    onStart: (event, meta) => setCurrentMaster(meta.context as MasterType),
    onCancel: (event, meta) => {
      setCurrentMaster(undefined);
      setShowRemove(false);
    },
    filterEvents: (event) => true,
    threshold: 1000,
    captureEvent: true,
    cancelOnMovement: false,
    detect: LongPressDetectEvents.BOTH,
  });

  // Children Component Method
  const modalProcess = (master?: MasterType) => {
    setEditing(false);
    if (!master) return;
    setLoading(true);
    updateMaster2DB(master);
  };

  const removeProcess = (remove: boolean) => {
    setShowRemove(false);
    if (remove) {
      if (currentMaster?.id === undefined) return;
      setLoading(true);
      removeDBMaster(currentMaster.id);
    }
  };

  // DB
  const masterData = useLiveQuery(() => db.master.toArray());

  const removeDBMaster = async (masterID: number) => {
    try {
      await db.master.delete(masterID);
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setLoading(false);
      setNotice(true);
    }, 500);
    setTimeout(() => setNotice(false), 1500);
  };

  const updateMaster2DB = async (master: MasterType) => {
    const targetMaster: MasterType = {
      name: master.name,
      category: master.category,
      protein: master.protein,
      sugar: master.sugar,
      fat: master.fat,
      calorie: master.calorie,
    };
    if (master.id === undefined) {
      try {
        const _id = await db.master.add(targetMaster);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await db.master.update(master.id, targetMaster);
      } catch (error) {
        console.log(error);
      }
    }
    setTimeout(() => {
      setLoading(false);
      setNotice(true);
    }, 500);
    setTimeout(() => setNotice(false), 1500);
  };

  // Init & Update
  useEffect(() => {
    if (masterData === undefined) return;
    masterData.map((master) => master.category);
    let categoryList: string[] = Array.from(new Set(masterData.map((master) => master.category)));
    categoryList.unshift('すべて');
    setCategories(categoryList);
    if (filter!=='すべて') {
      setMasters(masterData.filter((master) => master.category === filter));
    } else {
      setMasters(masterData);
    }
  }, [masterData, filter]);

  return (
    <div className="master">
      <div className="filter">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {categories.length > 0
            ? categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
            : null}
        </select>
      </div>
      <ul className="food_list">
        {masters.length > 0
          ? masters.map((master) => (
              <li key={master.id} onClick={() => editMaster(master)} {...longPress(master)}>
                <MasterItem master={master} />
              </li>
            ))
          : null}
      </ul>
      <div className="add" onClick={addMaster}>
        <FontAwesomeIcon icon={faPlus} />
      </div>
      {editing ? <MasterModal action={modalProcess} master={currentMaster} /> : null}
      {showRemove ? <RemoveModal action={removeProcess} /> : null}
      {loading ? <Loading /> : null}
      {notice ? <Notice /> : null}
    </div>
  );
};
export default Master;
