import React from "react";
import { surface } from "../../store";
import { WorkspaceProfile } from "../../workspace/profile";
import { observer } from "mobx-react";
import { UserProfile } from "../../user/profile";
import { CubesSvg, TrashSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { useTemplateView } from "rich/extensions/template";
import { config } from "../../../../common/config";
import { channel } from "rich/net/channel";
import { AtomPermission } from "rich/src/page/permission";
import { useTrashBox } from "rich/extensions/trash";

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
    },[])
    async function openTemplate(e: React.MouseEvent) {
        var ut = await useTemplateView();
        if (ut) {
            /**
            * 自动创建空间
            */
            var pageItem = surface.workspace.childs.last()
            var rr = await channel.post('/import/page', {
                text: '',
                templateUrl: ut.file?.url,
                wsId: surface.workspace.id,
                parentId: pageItem.id
            });
            if (rr.ok) {
                await pageItem.onSync(true)
                console.log('rd', rr.data);
            }
        }
    }
    async function openTrash(e: React.MouseEvent) {
        var item = surface.workspace.childs.last();
        var rg = await useTrashBox({
            ws: surface.workspace,
            parentId: item.id
        });
        if (rg) {
            await item.onSync(true);
        }
    }
    function renderBottoms() {
        if (surface.isPubSite) return <></>
        if (surface.workspace?.sn > 20 && config.isPro) return <></>
        if (surface.workspace.isAllow(AtomPermission.wsEdit))
            return <div className="gap-b-20">
                <div onMouseDown={e => openTemplate(e)} className="shy-ws-item-page flex gap-w-10 min-h-28 round relative cursor ">
                    <span className="gap-l-5 item-hover round size-20 flex-center gap-r-5"><Icon size={18} icon={CubesSvg}></Icon></span>
                    <span>模板</span>
                </div>
                <div onMouseDown={e => openTrash(e)} className="shy-ws-item-page flex gap-w-10 min-h-28 round relative cursor ">
                    <span className="gap-l-5 item-hover round size-20 flex-center gap-r-5"><Icon size={16} icon={TrashSvg}></Icon></span>
                    <span>垃圾桶</span>
                </div>
            </div>
        else return <></>
    }
    return <div className='shy-wss h100' onKeyDownCapture={e => surface.sln.keyboardPlate.keydown(e.nativeEvent)} tabIndex={1}>
        {surface.workspace && <div className={'shy-ws relative h100 flex flex-col flex-full shy-ws-' + (surface.workspace.slnStyle || 'note')}>
            {!(surface.isPubSite && surface.isPubSiteDefineBarMenu) && <WorkspaceProfile ></WorkspaceProfile>}
            <div className='shy-ws-items' ref={e => surface.sln.el = e}>
                {surface.workspace.childs.map(ws => {
                    var View = surface.sln.getMimeViewComponent(ws.mime);
                    return <View key={ws.id} item={ws} deep={-1} ></View>
                })}
                {renderBottoms()}
            </div>
            {!surface.isPubSite && <UserProfile></UserProfile>}
        </div>}
    </div>
})