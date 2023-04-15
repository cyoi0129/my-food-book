import { useState, useEffect, FC } from "react";
import { requestForToken, onMessageListener } from "../app/firebase";

const Notification: FC = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  useEffect(() => {
    if (notification?.title) {
      alert("title: " + notification?.title + "\nbody: " + notification?.body);
    }
  }, [notification]);

  requestForToken();

  onMessageListener()
    .then((payload: any) => {
      setNotification({ title: payload?.notification?.title, body: payload?.notification?.body });
    })
    .catch((err) => console.log("failed: ", err));

  return <div />;
};

export default Notification;