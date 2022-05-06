import React from "react";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { UrlRoute } from "../../../history";
import { observer, useLocalObservable } from "mobx-react";
import "./style.less";
import { channel } from "rich/net/channel";
import { surface } from "../..";
export var WorkspaceCreateView = observer(function () {
    var local = useLocalObservable<{ fail: string, text: string }>(() => {
        return {
            fail: '',
            text: ''
        }
    })
    var { current: button } = React.useRef<Button>(null);
    async function save() {
        if (!local.text) {
            local.fail = '空间名称不能为空'
        }
        else if (local.text.length > 32) local.fail = '空间名称过长'
        else {
            button.disabled = true;
            var rr = await channel.put('/ws/create', { text: local.text })
            button.disabled = false;
            if (rr.ok) {
                await surface.loadWorkspaceList();
                return UrlRoute.pushToWs(rr.data.workspace.sn, true);
            }
            else this.failTip = rr.warn;
        }
    }
    return <div className='shy-ws-create'>
        <div className='shy-ws-create-text'><Input onEnter={e => save()} value={local.text} onChange={e => local.text = e} /></div>
        <div className='shy-ws-create-button'><Button ref={e => button = e} onClick={e => save()}>创建空间</Button></div>
        <div className='shy-ws-create-fail-tip'>{local.fail}</div>
    </div>
})

