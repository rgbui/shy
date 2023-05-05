import React from "react";
import { surface } from "../../store";
import { WorkspaceProfile } from "../../workspace/profile";
import { observer } from "mobx-react";
import { UserProfile } from "../../user/profile";
export var SlnView = observer(function () {
    React.useEffect(() => {
        function keyup(event: KeyboardEvent) {
            surface.sln.keyboardPlate.keyup(event);
        }
        document.addEventListener('keyup', keyup);
        function move(event: MouseEvent) {
            surface.sln.globalMove(event);
        }
        document.addEventListener('mousemove', move)
        return () => {
            document.removeEventListener('keyup', keyup);
            document.removeEventListener('mousemove', move);
        }
    }, [])
    return <div className='shy-wss h100'  onKeyDownCapture={e => surface.sln.keyboardPlate.keydown(e.nativeEvent)} tabIndex={1}>
        {surface.workspace && <div className={'shy-ws relative h100 flex flex-col flex-full shy-ws-' + (surface.workspace.slnStyle || 'note')}>
            <WorkspaceProfile ></WorkspaceProfile>
            <div className='shy-ws-items' ref={e=>surface.sln.el=e}>
                {surface.workspace.childs.map(ws => {
                    var View = surface.sln.getMimeViewComponent(ws.mime);
                    return <View key={ws.id} item={ws} deep={-1} ></View>
                })}
            </div>
            <UserProfile></UserProfile>
        </div>}
    </div>
})