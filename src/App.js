import React from 'react';

import { RouterProvider } from 'react-router-dom';

import { router } from './components/Route/Router';
import './index.css';

function App() {
  return       <RouterProvider router={router}  />
    
}

export default App;
