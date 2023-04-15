import { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop, Header, Footer, Notification } from './components';
import { Home, User, Master, Task } from './pages';
import './App.scss';

const App: FC = () => {
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
      <Notification />
    </>
  );
};

export default App;
