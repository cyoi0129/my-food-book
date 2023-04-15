import { FC } from 'react';
import { MasterItemProps } from '../app/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookie } from '@fortawesome/free-solid-svg-icons';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import { faEgg } from '@fortawesome/free-solid-svg-icons';

const MasterItem: FC<MasterItemProps> = (props) => {
  const { master } = props;
  return (
    <>
      <h2 className="list_title"><span className="name">{master.name}</span><span className="category">{master.category}</span></h2>
      <dl className="nutrient">
        <dt>
          <FontAwesomeIcon icon={faEgg} />
        </dt>
        <dd>{master.protein}</dd>
        <dt>
          <FontAwesomeIcon icon={faCookie} />
        </dt>
        <dd>{master.sugar}</dd>
        <dt>
          <FontAwesomeIcon icon={faDroplet} />
        </dt>
        <dd>{master.fat}</dd>
        <dt>
          <FontAwesomeIcon icon={faFire} />
        </dt>
        <dd>{master.calorie}</dd>
      </dl>
    </>
  );
};
export default MasterItem;
