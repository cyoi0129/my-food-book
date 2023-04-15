import { FC } from 'react';
import siteData from '../app/util';
import { RemoveModalProps } from '../app/types';

const RemoveModal: FC<RemoveModalProps> = (props) => {
  const { action } = props;

  const doProcess = (remove: boolean) => {
    action(remove);
  };

  return (
    <div className="modal">
      <div className="modal_content task">
        <h3>{siteData.warning}</h3>
        <p className="modal_message">{siteData.confirm}</p>
        <button className="remove" onClick={() => doProcess(true)}>{siteData.remove}</button>
        <button className="cancel" onClick={() => doProcess(false)}>{siteData.cancel}</button>
      </div>
      <div className="close" onClick={() => doProcess(false)}>
        <span className="close_icon"></span>
      </div>
      <div className="overlay"></div>
    </div>
  );
};
export default RemoveModal;
