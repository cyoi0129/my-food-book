import { FC, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import siteData from '../app/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faBurger } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Footer: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState<string>('');
  useEffect(()=> {setCurrent(location.pathname)},[location]);
  const changeScreen = (target: string) => {
    navigate(target);
  }

  return (
    <footer>
      <ul>
        <li onClick={() => changeScreen('/')} className={current==='/'? 'active': ''}>
          <FontAwesomeIcon icon={faChartLine} />
          <span>{siteData.summary}</span>
        </li>
        <li onClick={() => changeScreen('/task')} className={current==='/task'? 'active': ''}>
          <FontAwesomeIcon icon={faCalendar} />
          <span>{siteData.task}</span>
        </li>
        <li onClick={() => changeScreen('/master')} className={current==='/master'? 'active': ''}>
          <FontAwesomeIcon icon={faBurger} />
          <span>{siteData.master}</span>
        </li>
        <li onClick={() => changeScreen('/user')} className={current==='/user'? 'active': ''}>
          <FontAwesomeIcon icon={faUser} />
          <span>{siteData.user}</span>
        </li>
      </ul>
    </footer>
  );
};
export default Footer;
