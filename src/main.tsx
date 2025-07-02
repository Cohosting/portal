import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { ClientPortalContextComponent } from './context/clientPortalContext';
import { Provider } from 'react-redux';
import store from './store/store';
import AuthListener from './pages/Auth/AuthListener';
import { QueryClientProvider } from 'react-query';
import queryClient from './hooks/react-query/queryClient';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
    <ToastContainer />
    <QueryClientProvider client={queryClient}>
      <AuthListener>
        <ClientPortalContextComponent>
          <App />
        </ClientPortalContextComponent>
      </AuthListener>
    </QueryClientProvider>
  </Provider>
);
