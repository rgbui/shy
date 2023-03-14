import { observer, useLocalObservable } from "mobx-react"
import React from "react";
import { ServerConfigView } from "./machine";
import { ServerConfigCreate } from "./create";
import { serverSlideStore } from "./store";
import LogoSrc from "../src/assert/img/shy.blue.svg";
import { surface } from "../src/surface/store";
import { Avatar } from "rich/component/view/avator/face";
import { ShyUrl, UrlRoute } from "../src/history";
import { Spin } from "rich/component/view/spin";
import { SettingsSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { useServerSlideConfig } from "./config";

export var ServerSlideView = observer(function () {

    var local = useLocalObservable<{ loading: boolean, isLoad: boolean }>(() => {
        return {
            loading: false,
            isLoad: false
        }
    })
    async function load() {
        local.loading = true;
        await serverSlideStore.load();
        local.isLoad = true;
        local.loading = false;
    }
    async function exit() {
        UrlRoute.push(ShyUrl.signOut)
    }
    React.useEffect(() => {
        load()
    }, [])

    return <div>
        <div className="flex padding-w-100 pos"
            style={{
                top: 0, left: 0, right: 0,
                height: 60,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'hsla(0, 0%, 100%, .65)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, .08)'
            }}
        >
            <div className="flex-auto flex">
                <LogoSrc style={{ width: 54, height: 54 }}></LogoSrc><span style={{ fontSize: 24 }}>诗云服务端</span>
            </div>
            <div className="flex-fixed flex-end">

                {surface.user && <Avatar hideStatus size={36} user={surface.user}></Avatar>}
                <span className="size-24 round flex-center item-hover cursor gap-w-10" onMouseDown={useServerSlideConfig}>
                    <Icon size={16} icon={SettingsSvg}></Icon>
                </span>
                {surface.user && <a className="remark cursor item-hover round " onMouseDown={e => exit()}>退出</a>}
            </div>
        </div>
        <div className="padding-w-100 gap-t-80">
            {!local.isLoad && local.loading && <Spin block></Spin>}
            {local.isLoad && <div >
                {!serverSlideStore.service_machine && <ServerConfigCreate></ServerConfigCreate>}
                {serverSlideStore.service_machine && <ServerConfigView></ServerConfigView>}
            </div>}

        </div>
    </div>
})