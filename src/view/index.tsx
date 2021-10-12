import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { appLangProvider } from '../../i18n/provider';
import { userDeviceService } from '../../services/device';
import { SyHistory } from './history';
import { ViewSurface } from './surface/view';
import { Login } from './user/login';
import { WorkspaceCreateView } from './workspace/create';
export function App() {
  let [isLoad, setLoad] = React.useState(false);
  async function load() {
    await appLangProvider.import();
    await userDeviceService.register();
    setLoad(true);
  }
  React.useEffect(() => {
    load();
  }, [])
  return <div className='shy-app'>
    {!isLoad && <div className='shy-app-load'></div>}
    {isLoad && <Router history={SyHistory}>
      <Route path='/' exact component={ViewSurface}></Route>
      <Route path='/login' exact component={Login}></Route>
      <Route path='/ws/:id' exact component={ViewSurface}></Route>
      <Route path='/page/:id' exact component={ViewSurface}></Route>
      <Route path='/work/create' exact component={WorkspaceCreateView}></Route>
      <Route path='/test/component' exact component={Component}></Route>
    </Router>}
  </div>
}

