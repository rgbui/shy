import React from "react";
import { Route, Router, Switch } from "react-router";
import { renderAvatorStatusSvgMask } from "rich/component/view/avator/status";
import { SyHistory, ShyUrl } from "../src/history";
import { surface } from "../src/surface/app/store";
import { View404 } from "../src/surface/app/view/404";
import { Login } from "../src/surface/user/sign/in";
import { LogOut } from "../src/surface/user/sign/out";
import { ServerSlideView } from "./home";
import { ls } from "rich/i18n/store";

export function App() {
    let [isLoad, setLoad] = React.useState(false);
    async function load() {
        await ls.import();
        await surface.user.sign()
        if (!surface.user.isSign) surface.user.toSign()
        setLoad(true);
    }
    React.useEffect(() => {
        load();
    }, [])
    function renderRoutes() {
        return <Router history={SyHistory}>
            <Switch>
                <Route path={ShyUrl.root} exact component={ServerSlideView}></Route>
                <Route path={ShyUrl.signOut} exact component={LogOut}></Route>
                <Route path={ShyUrl.signIn} exact component={Login}></Route>
                <Route path={ShyUrl.serverCenter} exact component={ServerSlideView}></Route>
                <Route path={ShyUrl._404} exact component={View404}></Route>
                <Route component={View404}></Route>
            </Switch>
        </Router>
    }
    return <div className='shy-app'>
        {renderAvatorStatusSvgMask()}
        {!isLoad && <div className='shy-app-load'></div>}
        {isLoad && renderRoutes()}
    </div>
}