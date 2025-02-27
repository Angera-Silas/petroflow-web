import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import store, { persistor } from "./store";
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';



const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>

  );
} else {
  console.error('Root element not found');
}