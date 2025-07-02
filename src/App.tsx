import React from 'react';

import { RouterProvider } from 'react-router-dom';

import { router } from './components/Route/Router';
import './index.css';

 import { ConversationProvider } from './context/useConversationContext';
import './index.css'
  function App() {
  return (
    <ConversationProvider>
      <RouterProvider router={router} />
    </ConversationProvider>
  );
    
}

export default App;
