import { FC, useState } from "react";
import siteData from '../app/util';
import { UpdateDialogProps } from "../app/types";

const UpdateDialog: FC<UpdateDialogProps> = function SWUpdateDialog(
  props: UpdateDialogProps
) {
  const { registration } = props;
  const [show, setShow] = useState(!!registration.waiting);
  const handleUpdate = () => {
    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    setShow(false);
  };

  return (
    <>
      {show ? (        
        <div className="modal">
        <div className="modal_content task">
          <h3>{siteData.version}</h3>
          <p className="modal_message">{siteData.newVersion}</p>
          <button className="ok" onClick={handleUpdate}>{siteData.update}</button>
        </div>
        <div className="overlay"></div>
      </div>
      ) : null}
    </>
  );
};

export default UpdateDialog;
