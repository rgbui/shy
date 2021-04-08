import * as React from 'react';
import ReactDOM from 'react-dom';
import { ViewSurface } from './view';
import { Router, Route } from 'react-router';
import { history } from "./history";
import "./assert/theme.less";
import "./view/style.less";
import "./core/style.less";
import "./assert/font-sy/iconfont.css"
// render react DOM
ReactDOM.render(
  <Router history={history}>
    <Route path='/' component={ViewSurface}></Route>
  </Router>,
  document.body.appendChild(document.createElement('div')),
)
