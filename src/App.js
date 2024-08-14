import React from 'react';

import { RouterProvider } from 'react-router-dom';

import { router } from './components/Route/Router';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Examples from './components/Examples';
import { ConversationProvider } from './context/useConversationContext';

function App() {
  return (
    <ConversationProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ConversationProvider>
  );
    
}

export default App;
