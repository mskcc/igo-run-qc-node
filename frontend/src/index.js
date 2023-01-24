import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { getSeqData, getRecentDeliveries, getRecentRunsData } from './features/home/homeSlice';

store.dispatch(getSeqData());
store.dispatch(getRecentDeliveries());
store.dispatch(getRecentRunsData());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
