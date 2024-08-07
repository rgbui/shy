import { EventsComponent } from "rich/component/lib/events.component";
import React from 'react';
import { Icon } from "rich/component/view/icon";
import { Workspace } from "..";
import { Avatar } from "rich/component/view/avator/face";
import { surface } from "../../app/store";
import DragHandle from "rich/src/assert/svg/dragHandle.svg";
import PlusSvg from "rich/src/assert/svg/plus.svg";
import CheckSvg from 'rich/src/assert/svg/check.svg';
import { channel } from "rich/net/channel";
import { PopoverSingleton } from "rich/component/popover/popover";
import { PopoverPosition } from "rich/component/popover/position";
import "./style.less";
import { Spin } from "rich/component/view/spin";

class SwitchWorkspace extends EventsComponent {
    list: Partial<Workspace>[] = [];
    loading: boolean = false;
    async componentDidMount() {
        this.loading = true;
        this.forceUpdate();
        var r = await channel.get('/user/wss');
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
                <Avatar userid={surface.user.id}></Avatar>
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
                        {/* <Avatar text={item.text} icon={item.icon} size={40}></Avatar> */}
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
            {this.loading && <Spin block></Spin>}
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
