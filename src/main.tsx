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
// render react DOM
ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div')),
)
