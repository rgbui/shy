import { observer, useLocalObservable } from "mobx-react";
import React from 'react';
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
import { Spin } from "rich/component/view/spin";

export var SurfacePage = observer((props: { pathname: string }) => {
    async function load() {
        if (SyHistory.action == 'POP') {
            if (surface.workspace) {
                if (UrlRoute.isMatch(ShyUrl.wsResource) || UrlRoute.isMatch(ShyUrl.resource)) {
                    var ul = new URL(location.href);
                    var url = ul.searchParams.get('url');
                    channel.air('/page/open', { elementUrl: url })
                }
                else {
                    var page = await surface.workspace.getDefaultPage();
                    channel.air('/page/open', { item: page });
                }
            }
        }
    }
    React.useEffect(() => {
        load();
    }, [props.pathname]);
    if (surface.accessPage == 'forbidden') return <ViewNotAllow></ViewNotAllow>
    if (surface.workspace) {
        var h = 0;
        if (surface.showJoinTip) h += 40;
        return <div className="shy-surface-content">
            {surface.showJoinTip && <div className="shy-surface-content-head h-40" >
                <JoinTip></JoinTip>
            </div>}
            <div className="shy-surface-content-box" style={{ height: h > 0 ? `calc(100vh - ${h}px)` : "100vh" }}>
                <SideSln></SideSln>
                <SupervisorView></SupervisorView>
            </div>
        </div>
    }
})

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
    if (local.loading) return <div className='shy-surface-loading'><Spin></Spin></div>
    else {
        return <div className='shy-surface'>
            <SideBar></SideBar>
            <Route path={[ShyUrl.ws, ShyUrl.page, ShyUrl.wsResource, ShyUrl.resource]} render={props => {
                return <SurfacePage pathname={props.location.pathname}></SurfacePage>
            }}>
            </Route>
            <Route path={ShyUrl.me} exact component={UserChannel}></Route>
            <Route path={ShyUrl.discovery} exact component={DiscoveryView}></Route>
        </div >
    }
    return <></>;
})

