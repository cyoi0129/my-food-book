import { FC } from 'react';
import { TaskItemProps } from '../app/types';
import { float2Int } from '../app/func';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../app/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookie } from '@fortawesome/free-solid-svg-icons';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import { faEgg } from '@fortawesome/free-solid-svg-icons';
import { faPercentage } from '@fortawesome/free-solid-svg-icons';

const TaskItem: FC<TaskItemProps> = (props) => {
  const { masterID, volume } = props;
  const masterData = useLiveQuery(() => db.master.toArray());

  const targetData = () => {  // Find task data from masters
    let result = {
      name: '',
      category: '',
      protein: 0,
      sugar: 0,
      fat: 0,
      calorie: 0,
    };
    const targetMaster = masterData?.find((master) => master.id === masterID);
    if (targetMaster !== undefined) {
      result.name = targetMaster.name;
      result.category = targetMaster.category;
      result.protein = (targetMaster.protein * volume) / 100;
      result.sugar = (targetMaster.sugar * volume) / 100;
      result.fat = (targetMaster.fat * volume) / 100;
      result.calorie = (targetMaster.calorie * volume) / 100;
    }
    return result;
  };

  return (
    <>
      <h3 className="list_title"><span className="name">{targetData().name}</span><span className="category">{targetData().category}</span></h3>
      <dl className="nutrient">
        <dt>
          <FontAwesomeIcon icon={faEgg} />
        </dt>
        <dd>{float2Int(targetData().protein)}</dd>
        <dt>
          <FontAwesomeIcon icon={faCookie} />
        </dt>
        <dd>{float2Int(targetData().sugar)}</dd>
        <dt>
          <FontAwesomeIcon icon={faDroplet} />
        </dt>
        <dd>{float2Int(targetData().fat)}</dd>
        <dt>
          <FontAwesomeIcon icon={faFire} />
        </dt>
        <dd>{float2Int(targetData().calorie)}</dd>
        <dt>
          <FontAwesomeIcon icon={faPercentage} />
        </dt>
        <dd>{volume}%</dd>
      </dl>
    </>
  );
};
export default TaskItem;
