import { EventsComponent } from "rich/component/lib/events.component";
import React from 'react';
import { PopoverPosition } from "rich/extensions/popover/position";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { Icon } from "rich/component/view/icon";
import { Loading } from "rich/component/view/loading";
import { Workspace } from "..";
import { workspaceService } from "../../../../services/workspace";
import { Avatar } from "../../../components/face";
import { surface } from "../../surface";
import "./style.less";
import DragHandle from "rich/src/assert/svg/DragHandle.svg";
import PlusSvg from "rich/src/assert/svg/plus.svg";
import CheckSvg from 'rich/src/assert/svg/check.svg';

class SwitchWorkspace extends EventsComponent {
    list: Partial<Workspace>[] = [];
    loading: boolean = false;
    async componentDidMount() {
        this.loading = true;
        this.forceUpdate();
        var r = await workspaceService.getWorkspaces();
        this.loading = false;
        if (r.ok) {
            this.list = r.data.list;
        }
        this.forceUpdate();
    }
    renderMyWorkspaces() {
        return <div className='shy-ws-group'>
            <div className='shy-ws-group-head' onMouseDown={e => {
                surface.user.onOpenUserSettings(e);
                this.onClose();
            }}>
                <Avatar icon={surface.user.avatar} text={surface.user.name}></Avatar>
                <span>{surface.user.name}</span>
                <a onMouseDown={e => {
                    e.stopPropagation();
                    surface.onCreateWorkspace();
                    this.onClose();
                }}><Icon size={20} icon={PlusSvg} ></Icon></a>
            </div>
            <div className='shy-ws-group-items'>
                {this.list.map(item => {
                    return <div className='shy-ws-item' key={item.id} onMouseDown={e => { surface.workspace.id != item.id && this.onChangeWorkspace(item) }}>
                        <div className='shy-ws-item-drag'><Icon size={12} icon={DragHandle}></Icon></div>
                        <Avatar text={item.text} icon={item.icon} size={40}></Avatar>
                        <div className='shy-ws-item-info'>
                            <div className='shy-ws-item-info-name'>{item.text}</div>
                            <div className='shy-ws-item-info-description'></div>
                        </div>
                        {surface.workspace.id == item.id && <div className='shy-ws-item-check'><Icon size={16} icon={CheckSvg}></Icon></div>}
                    </div>
                })
                }
            </div>
        </div>
    }
    render() {
        return <div className='shy-ws-switch-box'>
            {this.loading && <Loading></Loading>}
            {!this.loading && <div className='shy-ws-groups'>
                {this.renderMyWorkspaces()}
            </div>}
        </div>
    }
    onChangeWorkspace(ws: Partial<Workspace>) {
        this.emit('select', ws)
    }
    onClose() {
        this.emit('close');
    }
}

interface SwitchWorkspace {
    only(name: 'select', fn: (data: Partial<Workspace>) => void);
    emit(name: 'select', data: Partial<Workspace>);
    only(name: 'close', fn: () => void);
    emit(name: 'close');
}

export async function useSwitchWorkspace(pos: PopoverPosition) {
    let popover = await PopoverSingleton(SwitchWorkspace, { mask: true });
    let switchWorkspace = await popover.open(pos);
    return new Promise((resolve: (data: Partial<Workspace>) => void, reject) => {
        switchWorkspace.only('select', (data) => {
            popover.close();
            resolve(data);
        })
        popover.only('close', () => {
            resolve(null)
        });
        switchWorkspace.only('close', () => {
            popover.close();
            resolve(null)
        })
    })
}
