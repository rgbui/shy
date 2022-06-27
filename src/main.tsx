window.isAuth = false;
import { config } from './common/config';
import { createAuthIframe } from '../auth/iframe';
if (config.isWeb)
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
import { App } from '.';
import { configure } from 'mobx';
configure({ enforceActions: 'never' })
// render react DOM
document.body.classList.add('theme-light');
ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div')),
)



