import { FC, useState, useEffect } from 'react';
import { TaskModal, TaskItem, RemoveModal, Loading, Notice } from '../components';
import siteData from '../app/util';
import { TaskType, HistoryType, MasterType, FoodNutrientType, UserType } from '../app/types';
import { getFoodListNutrient, float2Int, convert2Int } from '../app/func';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../app/db';
import { getUserStorage } from '../app/ls';
import { useLongPress, LongPressDetectEvents } from 'use-long-press';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Task: FC = () => {
  // State
  const today = new Date();
  const [targetDate, setTargetDate] = useState<Date>(today);
  const [masters, setMasters] = useState<MasterType[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [weight, setWeight] = useState<string>('');
  const [history, setHistory] = useState<HistoryType | undefined>(undefined);
  const [nutrient, setNutrient] = useState<FoodNutrientType>();
  const [currentTask, setCurrentTask] = useState<TaskType | undefined>(undefined);
  const [showRemove, setShowRemove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserType>();

  // Watch Method
  const changeDate = (date: Date) => {
    setTargetDate(date);
  };

  const editTask = (task: TaskType) => {
    setEditing(true);
    setCurrentTask(task);
  };

  const addTask = () => {
    setEditing(true);
    setCurrentTask(undefined);
  };

  const saveHistory = () => {
    setLoading(true);
    updateHistory2DB();
  };

  const checkOver = (target: 'protein'|'sugar'|'fat'|'calorie'): string => {
    if (userData === undefined) return '';
    if (nutrient === undefined) return '';
    if (nutrient[target] > userData[target]) return 'over';
    return '';
  }

  const longPress = useLongPress(() => setShowRemove(true), {
    onStart: (event, meta) => setCurrentTask(meta.context as TaskType),
    // onFinish: (event, meta) => setShowRemove(true),
    onCancel: (event, meta) => {
      setCurrentTask(undefined);
      setShowRemove(false);
    },
    filterEvents: (event) => true,
    threshold: 1000,
    captureEvent: true,
    cancelOnMovement: false,
    detect: LongPressDetectEvents.BOTH,
  });

  // Children Component Method
  const modalProcess = (task?: TaskType) => {
    setEditing(false);
    if (!task) return;
    setLoading(true);
    updateTask2DB(task);
  };

  const removeProcess = (remove: boolean) => {
    setShowRemove(false);
    if (remove) {
      if (currentTask?.id === undefined) return;
      setLoading(true);
      removeDBTask(currentTask.id);
    }
  };

  // DB
  const taskData = useLiveQuery(() => db.task.toArray());
  const masterData = useLiveQuery(() => db.master.toArray());
  const historyData = useLiveQuery(() => db.history.toArray());

  const updateHistory2DB = async () => {
    const targetHistory: HistoryType = {
      date: targetDate.toLocaleDateString(),
      weight: Number(weight),
      protein: Number(nutrient?.protein),
      sugar: Number(nutrient?.sugar),
      fat: Number(nutrient?.fat),
      calorie: Number(nutrient?.calorie),
    };
    if (history?.id === undefined) {
      try {
        const _id = await db.history.add(targetHistory);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await db.history.update(history.id, targetHistory);
      } catch (error) {
        console.log(error);
      }
    }
    setTimeout(() => {setLoading(false);setNotice(true)}, 500);
    setTimeout(() => setNotice(false), 1500);
  };

  const updateTask2DB = async (task: TaskType) => {
    const targetTask: TaskType = {
      masterID: task.masterID,
      date: task.date,
      volume: task.volume,
    };
    if (task.id === undefined) {
      try {
        const _id = await db.task.add(targetTask);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await db.task.update(task.id, targetTask);
      } catch (error) {
        console.log(error);
      }
    }
    setTimeout(() => {setLoading(false);setNotice(true)}, 500);
    setTimeout(() => setNotice(false), 1500);
  };

  const removeDBTask = async (taskID: number) => {
    try {
      await db.task.delete(taskID);
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {setLoading(false);setNotice(true)}, 500);
    setTimeout(() => setNotice(false), 1500);
  };

  // Init & Update
  useEffect(() => {
    if (masterData === undefined) return;
    setMasters(masterData);
  }, [masterData]);

  useEffect(() => {
    if (taskData === undefined) return;
    setTasks(taskData.filter((task) => task.date === targetDate.toLocaleDateString()));
  }, [taskData]);

  useEffect(() => {
    if (historyData === undefined) return;
    const targetHistory = historyData.filter((history) => history.date === targetDate.toLocaleDateString())[0];
    if (targetHistory !== undefined) {
      setHistory(targetHistory);
      setWeight(String(targetHistory.weight));
      setNutrient(getFoodListNutrient(tasks, masters));
    } else {
      setHistory(undefined);
      setWeight('');
      setNutrient(undefined);
    }
  }, [historyData]);

  useEffect(() => {
    setNutrient(getFoodListNutrient(tasks, masters));
  }, [tasks]);

  useEffect(() => {
    if (taskData !== undefined) {
      setTasks(taskData.filter((task) => task.date === targetDate.toLocaleDateString()));
      setNutrient(getFoodListNutrient(tasks, masters));
    };
    if (historyData !== undefined) {
      const targetHistory = historyData.filter((history) => history.date === targetDate.toLocaleDateString())[0];
      if (targetHistory !== undefined) {
        setHistory(targetHistory);
        setWeight(String(targetHistory.weight));
      } else {
        setHistory(undefined);
        setWeight('');
      }
    }
  }, [targetDate]);

  useEffect(() => {
    setUserData(getUserStorage());
  }, []);

  useEffect(() => {
    if (taskData !== undefined) {
      setTasks(taskData.filter((task) => task.date === targetDate.toLocaleDateString()));
      setNutrient(getFoodListNutrient(tasks, masters));
    };
    if (historyData !== undefined) {
      const targetHistory = historyData.filter((history) => history.date === targetDate.toLocaleDateString())[0];
      if (targetHistory !== undefined) {
        setHistory(targetHistory);
        setWeight(String(targetHistory.weight));
      } else {
        setHistory(undefined);
        setWeight('');
      }
    }
  }, []);



  return (
    <div className="task">
      <dl className="info">
        <dt>{targetDate.toLocaleDateString() + ' (' + siteData.weekdays[targetDate.getDay()] + ')'}</dt>
        <dd>
          <DatePicker selected={targetDate} onChange={changeDate} customInput={<FontAwesomeIcon icon={faPen} />} />
        </dd>
        <dt>{siteData.weight}</dt>
        <dd>
          <input name="weight" value={weight} onChange={(e) => setWeight(convert2Int(e.target.value, 200))} />
        </dd>
        <dt>{siteData.protein}</dt>
        <dd className={checkOver('protein')}>{float2Int(nutrient?.protein) + '(' + userData?.protein + ')'}</dd>
        <dt>{siteData.sugar}</dt>
        <dd className={checkOver('sugar')}>{float2Int(nutrient?.sugar) + '(' + userData?.sugar + ')'}</dd>
        <dt>{siteData.fat}</dt>
        <dd className={checkOver('fat')}>{float2Int(nutrient?.fat) + '(' + userData?.fat + ')'}</dd>
        <dt>{siteData.calorie}</dt>
        <dd className={checkOver('calorie')}>{float2Int(nutrient?.calorie) + '(' + userData?.calorie + ')'}</dd>
      </dl>
      <div className="foods">
        <h2>{siteData.foods}</h2>
        <ul className="food_list">
          {tasks.length > 0
            ? tasks.map((task) => (
                <li key={task.id} onClick={() => editTask(task)} {...longPress(task)}>
                  <TaskItem masterID={task.masterID} volume={task.volume} />
                </li>
              ))
            : null}
        </ul>
      </div>
      <button className="save" onClick={saveHistory}>{siteData.save}</button>
      {editing ? <TaskModal task={currentTask} masters={masters} date={targetDate.toLocaleDateString()} action={modalProcess} /> : null}
      {showRemove ? <RemoveModal action={removeProcess} /> : null}
      <div className="add" onClick={addTask}>
        <FontAwesomeIcon icon={faPlus} />
      </div>
      {loading ? <Loading /> : null}
      {notice? <Notice /> : null}
    </div>
  );
};
export default Task;
