import React from 'react';

import { RouterProvider } from 'react-router-dom';

import { router } from './components/Route/Router';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
 import { ConversationProvider } from './context/useConversationContext';
import './index.css'
  function App() {
  return (
    <ConversationProvider>
      <RouterProvider router={router} />
      <ToastContainer   />
    </ConversationProvider>
  );
    
}

export default App;
