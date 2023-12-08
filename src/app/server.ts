import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig } from "./prod_config";

initializeApp(firebaseConfig);
const messaging = getMessaging();

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: "BK84aPrCLDB10d9Lu7e2o8th7ONAcyCeUysmWNPVDbv1QLgUa6aaN9zH39x0x3jbkVw01D_X_TVDMUBjUV9jfYQ" })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
      } else {
        console.log("No registration token available. Request permission to generate one.");
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });