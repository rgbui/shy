import React from "react";
import ReactDOM from "react-dom";
import "../../common/config";
import { channel } from "rich/net/channel";
import { surface } from "../surface/store";
import { Route, Router, Switch } from "react-router";
import { ShyMobileHistory } from "./history";
import { WorkspaceView } from "./workspace";
import { ls } from "rich/i18n/store";


export function App() {
    let [isLoad, setLoad] = React.useState(false);
    async function load() {
        await ls.import();
        await channel.put('/device/sign');
        await surface.user.sign();
        await surface.loadWorkspaceList()
        setLoad(true);
    }
    function renderRoutes() {
        return <Router history={ShyMobileHistory}>
            <Switch>
                <Route path={'/workspace'} exact component={WorkspaceView}></Route>
            </Switch>
        </Router>
    }
    React.useEffect(() => {
        load();
    }, [])
    return <div></div>
}
ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement('div')),
)