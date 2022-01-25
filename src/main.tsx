window.isAuth = false;
import { createAuthIframe } from '../net/auth/iframe';
createAuthIframe();
import * as React from 'react';
import ReactDOM from 'react-dom';
import "rich";
import "../services/declare";
import "./assert/shy.less";
import "./assert/theme.less";
import "./surface/style.less";
import "./surface/supervisor/style.less";
import "./surface/sln/style.less";
import "./surface/user/style.less";
import "../net/declare";
import { App } from '.';
import { configure } from 'mobx';

configure({ enforceActions: 'never' })
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then(registration => {
//       // console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       log.error(registrationError)
//       // console.log('SW registration failed: ', registrationError);
//     });
//   });
// }
// render react DOM
ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div')),
)



