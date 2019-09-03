import ReactDOM from 'react-dom';
import promiseFinally from 'promise.prototype.finally';
import React from 'react';
import "antd/dist/antd.css";
import { HashRouter } from 'react-router-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import 'bootstrap/dist/css/bootstrap.css'

import App from './components/App';

import authStore from './stores/authStore';
import commonStore from './stores/commonStore';
import userStore from './stores/userStore';
import shortLinks from './stores/shortLinks';
import facebook from './stores/facebook';

const stores = {
  authStore,
  commonStore,
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
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
), document.getElementById('root'));
