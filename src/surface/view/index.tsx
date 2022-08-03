import { observer, useLocalObservable } from "mobx-react";
import React from 'react';
import { Loading } from "rich/component/view/loading";
import { surface } from "..";
import { SideBar } from "./sidebar";
import { UserChannel } from "../user/channel/view";
import { Route } from "react-router";
import { ShyUrl } from "../../history";
import { DiscoveryView } from "../discovery";
import { JoinTip } from "./join";
import { SideSln } from "./sidesln";
import { SupervisorView } from "../supervisor/view";
export var SurfaceView = observer(function () {
    var local = useLocalObservable(() => {
        return {
            loading: true
        }
    });
    async function load() {
        local.loading = true;
        try {
            await surface.loadWorkspace(undefined, await surface.getWsName())
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
            <Route path={[ShyUrl.ws, ShyUrl.page]}>
                {surface.showWorkspace && <div className="shy-surface-content">
                    {surface.showHeadTip && <div className="shy-surface-content-head" style={{ height: 40 }}>
                        <JoinTip></JoinTip>
                    </div>}
                    <div className="shy-surface-content-box" style={{ height: surface.showHeadTip ? "calc(100vh - 40px)" : "100vh" }}>
                        <SideSln></SideSln>
                        <SupervisorView></SupervisorView>
                    </div>
                </div>}
            </Route>
            <Route path={ShyUrl.me} exact component={UserChannel}></Route>
            <Route path={ShyUrl.discovery} exact component={DiscoveryView}></Route>
        </div >
    }
    return <></>;
})