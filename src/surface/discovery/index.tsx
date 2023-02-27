import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import "./style.less";
import pic from "../../assert/img/pic-3.jpg";
import { channel } from "rich/net/channel";
import { WsAvatar } from "rich/component/view/avator/ws";
import { Workspace } from "../workspace";
import { surface } from "..";

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
            <div className="shy-discovery-cover" style={{
                backgroundImage: 'url(' + pic + ')',
                backgroundSize: 'cover',
                // backgroundAttachment: 'fixed',
                height: 240
            }}>
                <h3>在 诗云 找到自己的社区</h3>
                <p>从游戏、音乐到教育，总有你的一片天地。</p>
            </div>
            <div className="shy-discovery-ws">
                <h2>推荐社区</h2>
                <div className="shy-discovery-ws-list">
                    {local.list.map(w => {
                        return <div onMouseDown={e => openWs(w)} key={w.id}><WsAvatar wsId={w.id} ></WsAvatar></div>
                    })}
                </div>
            </div>
        </div>

    </div>
})
