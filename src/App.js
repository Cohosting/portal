import React from 'react';

import { RouterProvider } from 'react-router-dom';

import { router } from './components/Route/Router';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Examples from './components/Examples';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
    
}

export default App;
