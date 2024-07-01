import { ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App.js';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { ChakraProvider } from '@chakra-ui/react';
import { ClientAuthContextComponent } from './context/clientAuthContext';
import { ClientPortalContextComponent } from './context/clientPortalContext';
import { Provider } from 'react-redux';
import store from './store/store.js';
import AuthListener from './pages/Auth/AuthListener.jsx';
import { QueryClientProvider } from 'react-query';

import queryClient from './hooks/react-query/queryClient';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <ChakraProvider>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthListener>
          <ClientPortalContextComponent>
            <ClientAuthContextComponent>
              <App />
            </ClientAuthContextComponent>
          </ClientPortalContextComponent>
        </AuthListener>
      </QueryClientProvider>
    </Provider>
  </ChakraProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
