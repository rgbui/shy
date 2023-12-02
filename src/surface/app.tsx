import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { ShyUrl, SyHistory, UrlRoute } from '../history';
import { Login } from './user/sign/in';
import { LogOut } from './user/sign/out';
import { WorkspaceCreateView } from './workspace/create';
import { SurfaceView } from './view';
import { View404 } from './404';
import { InviteView } from './workspace/access/invite';
import { surface } from './store';
import { MyWorkSpace } from './view/my';
import { renderAvatorStatusSvgMask } from "rich/component/view/avator/status";
import { isMobileOnly } from 'react-device-detect';
import { Spin } from 'rich/component/view/spin';
import { PageContentView } from './supervisor/content';

import { RedictUrl } from './view/RedictUrl';
export function App() {
  let [isLoad, setLoad] = React.useState(false);
  async function load() {
    await surface.load()
    setLoad(true);
  }
  React.useEffect(() => {
    load();
    var resize = (e?) => {
      var el = document.querySelector('.shy-app');
      if (el) {
        if (isMobileOnly) {
          el.classList.add('shy-app-mobile')
        }
        else {
          el.classList.remove('shy-app-mobile');
        }
      }
    }
    window.addEventListener('resize', resize);
    resize()
    return () => {
      window.removeEventListener('resize', resize);
    }
  }, [])
  function renderRoutes() {
    if (window.shyConfig.isDev || window.shyConfig.isBeta) {
      return <Router history={SyHistory}>
        <Switch>
          <Route path={ShyUrl.redict} exact component={RedictUrl}></Route>
          <Route path={ShyUrl.root} exact component={SurfaceView}></Route>
          <Route path={ShyUrl.signOut} exact component={LogOut}></Route>
          <Route path={ShyUrl.signIn} exact component={Login}></Route>
          <Route path={ShyUrl.workCreate} exact component={WorkspaceCreateView}></Route>
          <Route path={ShyUrl.home} exact component={MyWorkSpace}></Route>
          <Route path={ShyUrl._404} exact component={View404}></Route>
          <Route path={[ShyUrl.ws, ShyUrl.resource, ShyUrl.wsResource, ShyUrl.wsPage, ShyUrl.me, ShyUrl.discovery]} exact component={SurfaceView}></Route>
          <Route path={ShyUrl.invite} exact component={InviteView}></Route>
          <Route path={[ShyUrl.pageContent, ShyUrl.wsPageContent]} component={PageContentView}></Route>
          <Route component={View404}></Route>
        </Switch>
      </Router>
    } else if (window.shyConfig.isDesk) {
      return <Router history={SyHistory}>
        <Switch>
          <Route path={ShyUrl.redict} exact component={RedictUrl}></Route>
          <Route path={ShyUrl.root} exact component={SurfaceView}></Route>
          <Route path={ShyUrl.signOut} exact component={LogOut}></Route>
          <Route path={ShyUrl.signIn} exact component={Login}></Route>
          <Route path={ShyUrl.workCreate} exact component={WorkspaceCreateView}></Route>
          <Route path={ShyUrl.home} exact component={MyWorkSpace}></Route>
          <Route path={ShyUrl._404} exact component={View404}></Route>
          <Route path={[ShyUrl.ws, ShyUrl.resource, ShyUrl.wsResource, ShyUrl.wsPage, ShyUrl.me, ShyUrl.discovery]} exact component={SurfaceView}></Route>
          <Route path={ShyUrl.invite} exact component={InviteView}></Route>
          <Route path={[ShyUrl.pageContent, ShyUrl.wsPageContent]} component={PageContentView}></Route>
          <Route component={View404}></Route>
        </Switch>
      </Router>
    }
    else if (window.shyConfig.isPro) {
      var isOrg = location.hostname == UrlRoute.getHost();
      if (isOrg) {
        return <Router history={SyHistory}>
          <Switch>
            <Route path={ShyUrl.redict} exact component={RedictUrl}></Route>
            <Route path={ShyUrl.signOut} exact component={LogOut}></Route>
            <Route path={ShyUrl.signIn} exact component={Login}></Route>
            <Route path={ShyUrl.workCreate} exact component={WorkspaceCreateView}></Route>
            <Route path={ShyUrl.home} exact component={MyWorkSpace}></Route>
            <Route path={[ShyUrl.ws, ShyUrl.page, ShyUrl.resource, ShyUrl.wsResource, ShyUrl.wsPage, ShyUrl.me, ShyUrl.discovery]} exact component={SurfaceView}></Route>
            <Route path={ShyUrl.invite} exact component={InviteView}></Route>
            <Route path={ShyUrl._404} exact component={View404}></Route>
            <Route path={[ShyUrl.pageContent, ShyUrl.wsPageContent]} component={PageContentView}></Route>
            <Route component={View404}></Route>
          </Switch>
        </Router>
      }
      else {
        return <Router history={SyHistory}>
          <Switch>
            <Route path={ShyUrl.redict} exact component={RedictUrl}></Route>
            <Route path={ShyUrl.workCreate} exact component={WorkspaceCreateView}></Route>
            <Route path={ShyUrl.home} exact component={MyWorkSpace}></Route>
            <Route path={ShyUrl.invite} exact component={InviteView}></Route>
            <Route path={[ShyUrl.root, ShyUrl.resource, ShyUrl.wsResource, ShyUrl.ws, ShyUrl.page, ShyUrl.wsPage, ShyUrl.me, ShyUrl.discovery]} exact component={SurfaceView}></Route>
            <Route path={ShyUrl._404} exact component={View404}></Route>
            <Route path={[ShyUrl.pageContent, ShyUrl.wsPageContent]} component={PageContentView}></Route>
            <Route component={View404}></Route>
          </Switch>
        </Router>
      }
    }

  }
  return <div className='shy-app' >
    {renderAvatorStatusSvgMask()}
    {!isLoad && <div className='flex-center gap-h-30'>
      <Spin></Spin>
    </div>}
    {isLoad && renderRoutes()}
  </div>
}

