import { FC } from 'react';
import siteData from '../app/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

const Header: FC = () => {
  return (
    <header>
      <h1><FontAwesomeIcon icon={faUtensils} />{siteData.siteName}</h1>
    </header>
  )
}
export default Header;