import React from "react";
import { generatePath } from "react-router";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { SyHistory } from "../../../history";
import { workspaceService } from "../../../../../services/workspace";
import { observer, useLocalObservable } from "mobx-react";
import "./style.less";
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
        else if (local.text.length > 32)
            local.fail = '空间名称过长'
        else {
            button.disabled = true;
            var rr = await workspaceService.createWorkspace({ text: local.text });
            button.disabled = false;
            if (rr.ok) return SyHistory.push(generatePath('/ws/:id', { id: rr.data.sn }));
            else this.failTip = rr.warn;
        }
    }
    return <div className='shy-ws-create'>
        <div className='shy-ws-create-text'><Input onEnter={e => save()} value={local.text} onChange={e => local.text = e} /></div>
        <div className='shy-ws-create-button'><Button ref={e => button = e} onClick={e => save()}>创建空间</Button></div>
        <div className='shy-ws-create-fail-tip'>{local.fail}</div>
    </div>
})

