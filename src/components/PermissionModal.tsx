import { FC } from 'react';
import siteData from '../app/util';
import { ConfirmModalProps } from '../app/types';

const PermissionModal: FC<ConfirmModalProps> = (props) => {
  const { action } = props;

  const doProcess = (remove: boolean) => {
    action(remove);
  };

  return (
    <div className="modal">
      <div className="modal_content task">
        <h3>{siteData.permission}</h3>
        <p className="modal_message">{siteData.push}</p>
        <button className="ok" onClick={() => doProcess(true)}>{siteData.ok}</button>
        <button className="cancel" onClick={() => doProcess(false)}>{siteData.cancel}</button>
      </div>
      <div className="close" onClick={() => doProcess(false)}>
        <span className="close_icon"></span>
      </div>
      <div className="overlay"></div>
    </div>
  );
};
export default PermissionModal;
