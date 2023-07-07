import { FC, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop, Header, Footer, NotificationMessage, PermissionModal } from './components';
import { Home, User, Master, Task } from './pages';
import './App.scss';

const App: FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const permissionProcess = (agree: boolean) => {
    if (agree) Notification.requestPermission();
    setShowModal(false);
  }

  useEffect(() => {
    if (navigator.userAgent.indexOf("Firefox") !== -1 || (navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1)) {
      if (("Notification" in window)) {
        if (Notification.permission !== "granted") {
          setShowModal(true);
        }
      }
    }
  }, []);

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/master" element={<Master />} />
          <Route path="/task" element={<Task />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
      <Footer />
      <NotificationMessage />
      {showModal? <PermissionModal action={permissionProcess} /> : null}
    </>
  );
};

export default App;
