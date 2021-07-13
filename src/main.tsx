import * as React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import "rich/src/util/array";
import "./assert/theme.less";
import "./surface/style.less";
import "./supervisor/style.less";
import "./solution/style.less";
import "./user/style.less";
import { ViewSurface } from './surface/view';
import { Login } from './user/login';
import { WorkspaceCreateView } from './solution/workspace/create';
import { TestView } from './test/view';
import { SyHistory } from './history';
// render react DOM
ReactDOM.render(
  <Router history={SyHistory}>
    <Route path='/' exact component={ViewSurface}></Route>
    <Route path='/login' exact component={Login}></Route>
    <Route path='/ws/:id' exact component={ViewSurface}></Route>
    <Route path='/work/create' exact component={WorkspaceCreateView}></Route>
    <Route path='/test/:id' exact component={TestView}></Route>
  </Router>,
  document.body.appendChild(document.createElement('div')),
)
