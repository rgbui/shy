import { observer } from "mobx-react"
import React from "react";
import { ServerConfigView } from "./machine";
import { ServerConfigCreate } from "./create";
import { serverSlideStore } from "./store";
import LogoSrc from "../src/assert/img/shy.blue.svg";
import { surface } from "../src/surface/store";
import { Avatar } from "rich/component/view/avator/face";
import { ShyUrl, UrlRoute } from "../src/history";
export var ServerSlideView = observer(function () {
    async function load() {
        await serverSlideStore.load();
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
                {surface.user && <a className="remark cursor gap-r-10" onMouseDown={e => exit()}>退出</a>}
                {surface.user && <Avatar hideStatus size={40} user={surface.user}></Avatar>}
            </div>
        </div>
        <div className="padding-w-100 gap-t-80">
            {!serverSlideStore.service_machine && <ServerConfigCreate></ServerConfigCreate>}
            {serverSlideStore.service_machine && <ServerConfigView></ServerConfigView>}
        </div>
    </div>
})