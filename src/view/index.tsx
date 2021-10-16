import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { appLangProvider } from '../../i18n/provider';
import { userDeviceService } from '../../services/device';
import { SyHistory } from './history';
import { PrivateView } from './site/protocol/private';
import { AgreeView } from './site/protocol/service';
import { SceneView } from './site/scene';
import { WeChatView } from './site/wechat';
import { ViewSurface } from './surface/view';
import { Login } from './user/login';
import { LogOut } from './user/logout';
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
      <Route path='/scene' exact component={SceneView}></Route>
      <Route path='/wechat' exact component={WeChatView}></Route>
      <Route path='/privacy/protocol' exact component={PrivateView}></Route>
      <Route path='/service/protocol' exact component={AgreeView}></Route>
      <Route path='/sign' exact component={Login}></Route>
      <Route path='/sign/out' exact component={LogOut}> </Route>
      <Route path='/ws/:id' exact component={ViewSurface}></Route>
      <Route path='/page/:id' exact component={ViewSurface}></Route>
      <Route path='/work/create' exact component={WorkspaceCreateView}></Route>
      <Route path='/test/component' exact component={Component}></Route>
    </Router>}
  </div>
}

