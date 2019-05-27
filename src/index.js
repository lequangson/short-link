import ReactDOM from 'react-dom';
import promiseFinally from 'promise.prototype.finally';
import React from 'react';
import "antd/dist/antd.css";
import { BrowserRouter } from 'react-router-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import 'bootstrap/dist/css/bootstrap.css'

import App from './components/App';

import articlesStore from './stores/articlesStore';
import commentsStore from './stores/commentsStore';
import authStore from './stores/authStore';
import commonStore from './stores/commonStore';
import editorStore from './stores/editorStore';
import userStore from './stores/userStore';
import shortLinks from './stores/shortLinks';
import facebook from './stores/facebook';

const stores = {
  articlesStore,
  commentsStore,
  authStore,
  commonStore,
  editorStore,
  userStore,
  facebook,
  shortLinks,
};

// For easier debugging
window._____APP_STATE_____ = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render((
  <Provider {...stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));
