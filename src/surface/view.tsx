import { observer, useLocalObservable } from "mobx-react";
import React from 'react';
import { Loading } from "rich/component/view/loading";
import { Surface, surface } from "./store";
import { SideBar } from "./view/sidebar";
import { UserChannel } from "./user/channel/view";
import { Route } from "react-router";
import { ShyUrl, SyHistory, UrlRoute } from "../history";
import { DiscoveryView } from "./discovery";
import { JoinTip } from "./view/join";
import { SideSln } from "./view/sidesln";
import { SupervisorView } from "./supervisor/view";
import { ViewNotAllow } from "./404";
import { channel } from "rich/net/channel";

export var SurfaceView = observer(function () {
    var local = useLocalObservable(() => {
        return {
            loading: true
        }
    });
    async function load() {
        local.loading = true;
        try {
            await surface.loadWorkspaceList();
            var willWs = await Surface.getWsName();
            if (willWs) await surface.onLoadWorkspace(willWs)
            else UrlRoute.redict(ShyUrl.home)
        }
        catch (ex) {
        }
        finally {
            local.loading = false;
        }
    }
    React.useEffect(() => {
        load();
    }, [])
    if (local.loading) return <div className='shy-surface-loading'><Loading /></div>
    else {
        return <div className='shy-surface'>
            <SideBar></SideBar>
            <Route path={[ShyUrl.ws, ShyUrl.page]} render={props => {
                return <SurfacePage pathname={props.location.pathname}></SurfacePage>
            }}>
            </Route>
            <Route path={ShyUrl.me} exact component={UserChannel}></Route>
            <Route path={ShyUrl.discovery} exact component={DiscoveryView}></Route>
        </div >
    }
    return <></>;
})


export var SurfacePage = observer((props: { pathname: string }) => {
    async function load()
    {
        if (SyHistory.action == 'POP') {
            if (surface.workspace) {
                var page = await surface.workspace.getDefaultPage();
                console.log('gggg');
                channel.air('/page/open', { item: page });
            }
        }
    }
    React.useEffect(() => {
        load();
    }, [props.pathname]);
    return <>{surface.accessPage == 'forbidden' && <ViewNotAllow></ViewNotAllow>}
        {surface.showWorkspace && <div className="shy-surface-content">
            {surface.showJoinTip && <div className="shy-surface-content-head h-40" >
                <JoinTip></JoinTip>
            </div>}
            {surface.accessPage != 'forbidden' && <div className="shy-surface-content-box" style={{ height: surface.showJoinTip ? "calc(100vh - 40px)" : "100vh" }}>
                <SideSln></SideSln>
                <SupervisorView></SupervisorView>
            </div>}
        </div>}</>
})