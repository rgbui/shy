
import * as React from 'react';
import ReactDOM from 'react-dom';
import "rich";
import "./assert/shy.less";
import "./assert/theme.less";
import "./view/surface/style.less";
import "./view/supervisor/style.less";
import "./view/sln/style.less";
import "./view/user/style.less";
import { App } from './view';
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



