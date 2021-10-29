import React from "react";
import { surface } from "../..";
import { WorkspaceProfile } from "../../workspace/profile";

import { observer } from "mobx-react";
import { BasePageItemView } from "../item/view/base";
export var SlnView = observer(function () {
    let refEl = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        function keydown(event: KeyboardEvent) {
            surface.sln.keyboardPlate.keydown(event);
        }
        function keyup(event: KeyboardEvent) {
            surface.sln.keyboardPlate.keyup(event);
        }
        refEl.current.addEventListener('keydown', keydown, true);
        document.addEventListener('keyup', keyup);
        return () => {
            refEl.current.removeEventListener('keydown', keydown, true);
            document.removeEventListener('keyup', keyup);
        }
    }, [])
    return <div className='shy-wss' ref={e => refEl.current = e} tabIndex={1}>
        {surface.workspace && <div className='shy-ws'>
            <WorkspaceProfile ></WorkspaceProfile>
            <div className='shy-ws-items'>
                {surface.workspace.childs.map(ws => {
                    var View: typeof BasePageItemView = surface.sln.getMimeViewComponent(ws.mime);
                    return <View key={ws.id} item={ws} deep={-1} ></View>
                })}
            </div>
        </div>}
    </div>
})