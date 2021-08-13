import { EventsComponent } from "rich/extensions/events.component";
import React from 'react';
import { Workspace } from ".";
import { workspaceService } from "./service";
import { Avatar } from "../components/face";
import { PopoverPosition } from "rich/extensions/popover/position";
import { PopoverSingleton } from "rich/extensions/popover/popover";

class SwitchWorkspace extends EventsComponent {
    list: Partial<Workspace>[] = [];
    loading: boolean = false;
    async componentDidMount() {
        var r = await workspaceService.getWorkspaces();
        if (r.ok) {
            this.list = r.data.list;
        }
    }
    render() {
        return <div className='shy-ws-list'>
            {this.loading && <div className='shy-ws-list'></div>}
            {!this.loading && <div className='shy-ws-items'>
                {this.list.map(item => {
                    return <div className='shy-ws-item' key={item.id} onMouseDown={e => this.onChangeWorkspace(item)}>
                        <Avatar text={item.text} icon={item.icon} size={40}></Avatar>
                        <div className='shy-ws-item-info'>
                            <span>{item.text}</span>
                            <span></span>
                        </div>
                    </div>
                })}
                <div className='shy-ws-item-plus'></div>
            </div>}
        </div>
    }
    onChangeWorkspace(ws: Partial<Workspace>) {
        this.emit('select', ws)
    }
}

interface SwitchWorkspace {
    on(name: 'select', fn: (data: Partial<Workspace>) => void);
    emit(name: 'select', data: Partial<Workspace>);
}

export async function useSwitchWorkspace(pos: PopoverPosition) {
    let popover = await PopoverSingleton(SwitchWorkspace);
    let switchWorkspace = await popover.open<SwitchWorkspace>(pos);
    return new Promise((resolve: (data: Partial<Workspace>) => void, reject) => {
        switchWorkspace.only('select', (data) => {
            popover.close();
            resolve(data);
        })
        popover.only('close', () => {
            resolve(null)
        })
    })
}
