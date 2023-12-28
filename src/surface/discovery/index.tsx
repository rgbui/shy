import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import "./style.less";
// import pic from "../../assert/img/pic-3.jpg";
import discover from "../../assert/img/discove.jpeg";
import { channel } from "rich/net/channel";
import { WsAvatar } from "rich/component/view/avator/ws";
import { Workspace } from "../workspace";
import { surface } from "../store";
import { isMobileOnly } from "react-device-detect";
import { S } from "rich/i18n/view";

export var DiscoveryView = observer(function () {
    var local = useLocalObservable(() => {
        return {
            loading: false,
            page: 1,
            size: 20,
            total: 0,
            word: '',
            list: [],
            type: ''
        }
    })
    async function loadWs() {
        local.loading = true;
        try {
            var r = await channel.get('/ws/discovery');
            if (r.ok) {
                local.list = r.data.list;
            }
        }
        catch (ex) {

        }
        finally {
            local.loading = false;
        }
    }
    async function openWs(ws: Partial<Workspace>) {
        await surface.onLoadWorkspace(ws.id);
    }
    React.useEffect(() => {
        loadWs();
    }, [])
    return <div className='shy-discovery' >
        <div className="shy-discovery-wrapper">
            <div className={"shy-discovery-cover flex-center flex-col" + (isMobileOnly ? " " : " round-16 gap-t-20 ")} style={{
                backgroundImage: 'url(' + discover + ')',
                backgroundSize: 'cover',
                // backgroundAttachment: 'fixed',
                height: isMobileOnly ? 120 : 240
            }}>
                <h3><S text='discovery title'>在 诗云 找到自己的社区</S></h3>
                <p><S text='discovery description'>从游戏、音乐到教育，总有你的一片天地。</S></p>
            </div>
            <div className={"shy-discovery-ws padding-b-100" + (isMobileOnly ? " gap-l-20 gap-r-10 " : " gap-l-100 gap-r-90")}>
                <h2><S>推荐社区</S></h2>
                <div className="shy-discovery-ws-list">
                    {local.list.map(w => {
                        return <div style={{ width: isMobileOnly ? "100%" : "25%" }} onMouseDown={e => openWs(w)} key={w.id}><WsAvatar wsId={w.id} ></WsAvatar></div>
                    })}
                </div>
            </div>
        </div>

    </div>
})
