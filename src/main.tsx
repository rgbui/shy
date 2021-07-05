import * as React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import "rich/src/util/array";
import { history } from "./history";
import "./assert/theme.less";
import "./surface/style.less";
import "./supervisor/style.less";
import "./solution/style.less";
import "./user/style.less";
import { ViewSurface } from './surface/view';
import { Login } from './user/login';
// render react DOM
ReactDOM.render(
  <Router history={history}>
    <Route path='/' exact component={ViewSurface}></Route>
    <Route path='/login' exact component={Login}></Route>
  </Router>,
  document.body.appendChild(document.createElement('div')),
)

