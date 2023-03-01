import React from "react";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { UrlRoute } from "../../../history";
import { observer, useLocalObservable } from "mobx-react";
import "./style.less";
import { surface } from "../..";
import { masterSock, Sock } from "../../../../net/sock";
import { Workspace } from "..";
import { channel } from "rich/net/channel";

export var WorkspaceCreateView = observer(function () {
    var local = useLocalObservable<{
        fail: string,
        text: string,
        store: 'local' | 'net',
        service: string
    }>(() => {
        return {
            fail: '',
            text: '',
            store: 'net',
            service: ''
        }
    })
    var { current: button } = React.useRef<Button>(null);
    async function save() {
        if (!local.text) {
            local.fail = '空间名称不能为空'
        }
        else if (local.text.length > 32) local.fail = '空间名称过长'
        else if (local.store == 'local' && !local.service) local.fail = '服务号地址不能为空'
        else {
            button.disabled = true;
            var rr = await channel.put('/ws/create', {
                text: local.text,
                dataServiceAddress: local.store == 'local' ? local.service : undefined
            })
            button.disabled = false;
            if (rr.ok) {
                await surface.loadWorkspaceList();
                return UrlRoute.pushToWs(rr.data.workspace.sn, true);
            }
            else this.failTip = rr.warn;
        }
    }

    return <div className='shy-ws-create w-400'>
        <div className="h2 flex-center">创建您的线上工作室</div>
        <div className="remark flex-center gap-b-20">
            创造、记录、管理、经营、沟通、协作无上限
        </div>

        <div className="gap-h-10">
            <Input placeholder="空间名称" value={local.text} onChange={e => local.text = e} />
        </div>

        <div className="flex  gap-h-10">
            <input style={{ margin: 0, marginRight: 3 }} type='checkbox' checked={local.store == 'local' ? true : false}
                onChange={e => { local.store = e.target.checked ? 'local' : 'net' }}
            ></input>
            <span className="text-1">开启去中心化协作</span>
        </div>

        {local.store == 'local' && <div>
            <div className="gap-h-10 flex">
                <Input value={local.service} onChange={e => local.service = e} placeholder="服务号地址" />
            </div>
            <div className="remark gap-h-10">数据将存储在您的电脑/局域网/服务器,请提前安装好诗云服务端</div>
        </div>}

        <div className="gap-h-10 padding-t-20">
            <Button size="larger" block ref={e => button = e} onClick={e => save()}>创建空间</Button>
        </div>
        <div className='error'>{local.fail}</div>
    </div>
})

