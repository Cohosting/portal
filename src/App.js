import React from 'react';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import {  RouterProvider, } from 'react-router-dom';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import PrivateRoute from './components/Route/ProtectedRoutes';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { router } from './components/Route/Router';
import './index.css';

function App() {
  return       <RouterProvider router={router}  />
    
}

export default App;
