import { FC } from 'react';
import siteData from '../app/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const Notice: FC = () => {
  return (
    <div className="notice">
      <p><span><FontAwesomeIcon icon={faCircleCheck} /></span>{siteData.notice}</p>
    </div>
  );
};
export default Notice;
