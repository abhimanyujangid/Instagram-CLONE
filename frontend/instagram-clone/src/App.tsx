import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';

const App: React.FC = () => {
  return (
    <div className="app">
      <ToastContainer />
      <AppRoutes />
    </div>
  );
};

export default App;
