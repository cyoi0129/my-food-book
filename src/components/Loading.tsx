import { FC } from 'react';

const Loading: FC = () => {
  return (
    <div className="modal">
      <div className="loading">
        <div className="loader">Loading...</div>
      </div>
      <div className="overlay"></div>
    </div>
  );
};
export default Loading;