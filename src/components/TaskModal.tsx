import { FC, useState, useEffect } from 'react';
import siteData from '../app/util';
import { float2Int } from '../app/func';
import { MasterType, TaskModalProps, TaskType } from '../app/types';

const TaskModal: FC<TaskModalProps> = (props) => {
  const { task, masters, date, action } = props;

  // State
  const [master, setMaster] = useState<number>(1);
  const [masterList, setMasterList] = useState<MasterType[]>([]);
  const [volume, setVolume] = useState<number>(100);
  const [protein, setProtein] = useState<number>(0);
  const [sugar, setSugar] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [calorie, setCalorie] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<string | 'すべて'>('すべて');

  // Watch Method
  const changeMaster = (master: number) => {
    setMaster(master);
  };

  const changeVolume = (volume: number) => {
    setVolume(volume);
  };

  const closeModal = () => {
    action(); // Send to Parent Component
  };

  const saveTask = () => {
    const taskItem: TaskType = {
      id: task?.id,
      date: date,
      masterID: Number(master),
      volume: volume,
    };
    action(taskItem); // Send to Parent Component
  };

  // Calc Nutrient when master or volume changed
  useEffect(() => {
    const targetMaster = masters.find((target) => target.id === master);
    if (targetMaster === undefined) return;
    setProtein((targetMaster.protein * volume) / 100);
    setSugar((targetMaster.sugar * volume) / 100);
    setFat((targetMaster.fat * volume) / 100);
    setCalorie((targetMaster.calorie * volume) / 100);
  }, [master, volume]);

  useEffect(() => {
    if (filter!=='すべて') {
      setMasterList(masters.filter(master => master.category === filter));
    } else {
      setMasterList(masters);
    }
  }, [filter]);

  // Init
  useEffect(() => {
    masters.map((master) => master.category);
    let categoryList: string[] = Array.from(new Set(masters.map((master) => master.category)));
    categoryList.unshift('すべて');
    setCategories(categoryList);
    setMasterList(masters);
    if (task===undefined) return;
    setMaster(task.masterID);
    setVolume(task.volume);
  }, []);

  return (
    <div className="modal">
      <div className="modal_content task">
        <h3>{siteData.task}</h3>
        <dl>
        <dt>{siteData.category}</dt>
          <dd>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              {categories.length > 0
                ? categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))
                : null}
            </select>
          </dd>
          <dt>{siteData.name}</dt>
          <dd>
            <select value={master} onChange={(e) => changeMaster(Number(e.target.value))}>
              {masterList.length > 0
                ? masterList.map((master) => (
                    <option key={master.id} value={master.id}>
                      {master.name}
                    </option>
                  ))
                : null}
            </select>
          </dd>
          <dt>{siteData.volume}</dt>
          <dd>
            <select value={volume} onChange={(e) => changeVolume(Number(e.target.value))}>
              {[...Array(31)].map((_, i) => ( // Create Array from 10 to 300, Step 10
                <option key={i} value={(i) * 10}>
                  {(i) * 10}%
                </option>
              ))}
            </select>
          </dd>
          <dt>{siteData.protein}</dt>
          <dd>{float2Int(protein)}</dd>
          <dt>{siteData.sugar}</dt>
          <dd>{float2Int(sugar)}</dd>
          <dt>{siteData.fat}</dt>
          <dd>{float2Int(fat)}</dd>
          <dt>{siteData.calorie}</dt>
          <dd>{float2Int(calorie)}</dd>
        </dl>
        <button className="save" onClick={saveTask}>{siteData.save}</button>
      </div>
      <div className="close" onClick={closeModal}>
        <span className="close_icon"></span>
      </div>
      <div className="overlay"></div>
    </div>
  );
};
export default TaskModal;
