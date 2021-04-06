import * as React from 'react';
import ReactDOM from 'react-dom';
import { Design } from './design';
import { Router, Route, browserHistory } from 'react-router'



// render react DOM
ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={Design}></Route>
  </Router>,
  document.body,
)
