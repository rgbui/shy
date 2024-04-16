
import React from "react";
import { Icon } from "rich/component/view/icon";
import { UserWorkspaceItem, surface } from "../app/store";
import PubWorkspace from "../../assert/svg/pubWorkspace.svg";
import { PlusSvg, SlideBarFolderSvg } from "rich/component/svgs";
import ShyLog from "../../assert/img/shy.svg";

import { ShyUrl, UrlRoute } from "../../history";
import { autoImageUrl } from "rich/net/element.type";
import { UA } from "rich/util/ua";
import { ToolTip } from "rich/component/view/tooltip";
import { DotNumber } from "rich/component/view/dot/index";
import { userChannelStore } from "../user/channel/store";
import { UserAvatars } from "rich/component/view/avator/users"
import { channel } from "rich/net/channel";
import { observer } from 'mobx-react';
import { ShyUtil } from "../../util";
import { isMobileOnly } from "react-device-detect";
import { lst } from "rich/i18n/store";
import { Sp } from "rich/i18n/view";
import { makeObservable, observable, runInAction } from "mobx";
import { MouseDragger } from "rich/src/common/dragger";
import { ghostView } from "rich/src/common/ghost";
import { Point, Rect } from "rich/src/common/vector/point";
import "./style.less";
import lodash from "lodash";
import { util } from "rich/util/util";
import { masterSock } from "../../../net/sock";
import { yCache } from "../../../net/cache";


const SIDE_FOLDER_SPREAD_KEY = 'shy-side-folder-spread';

@observer
export class SideBar extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            folderSpread: observable
        })
    }
    componentDidMount(): void {
        yCache.get(SIDE_FOLDER_SPREAD_KEY).then(r => {
            if (r) {
                this.folderSpread = r as any;
            }
        })
    }
    async loadWsOnline(workspace: UserWorkspaceItem, tip: ToolTip) {
        if (workspace.loadingOnlineUsers) return;
        if (workspace.overlayDate && (Date.now() - workspace.overlayDate.getTime()) < 1000 * 60) return;
        workspace.loadingOnlineUsers = true;
        var r = await channel.get('/ws/random/online/users', { wsId: workspace.id, size: 20 });
        runInAction(() => {
            if (r.ok) {
                workspace.randomOnlineUsers = new Set(r.data.users);
                workspace.memberOnlineCount = r.data.count;
                workspace.overlayDate = new Date();
            }
            workspace.loadingOnlineUsers = false;
            setTimeout(() => {
                tip.updateView();
            }, 200);
        })
    }
    async onDragSave(ws: UserWorkspaceItem, isFolder: boolean, dropId: string, dropType: 'folder' | "ws", arrow: 'drag-bottom' | 'drag-top' | 'drag-center') {
        var wss = lodash.cloneDeep(surface.wss);
        var nofolder = dropType == 'folder' && arrow != 'drag-center';
        var ops: { name: 'update' | 'inc', filter?: Record<string, any>, inc?: number, id?: string, at?: number, folderId?: string }[] = [];
        try {
            var dropWs = wss.find(x => dropType == 'ws' && x.id == dropId || dropType == 'folder' && x.folderId == dropId);
            var dropwss = dropWs.folderId && dropType == 'folder' ? wss.filter(x => x.folderId == dropWs.folderId) : [dropWs];
            var dragwss = isFolder ? wss.filter(x => x.folderId == ws.folderId) : [ws];
            var isDragFolder = dragwss.length > 1 && dragwss.every(x => x.folderId) && dropwss.length == 1 && !dropwss.first().folderId;
            var willDragFolderId = dragwss.first().folderId;
            var isAllAts = dragwss.every(x => typeof x.at == 'number');
            if (arrow == 'drag-center') {
                var guid = dropwss.every(s => s.folderId ? true : false) ? dropwss.first().folderId : util.guid();
                if (isAllAts) {
                    var maxAt = dropwss.max(x => x.at);
                    var index = wss.findIndex(c => c.at > maxAt);
                    wss.slice(index).forEach(c => c.at = c.at + dragwss.length)
                    ops.push({ name: 'inc', filter: { at: { $gt: maxAt } }, inc: dragwss.length });
                    dragwss.each(x => {
                        ops.push({ name: "update", id: x.id, at: maxAt + 1, folderId: guid });
                        x.at = maxAt + 1;
                        x.folderId = guid;
                        maxAt++;
                    });
                    lodash.remove(wss, c => dragwss.some(g => g.id == c.id));
                    index = wss.findIndex(c => c.id == dropwss.last().id);
                    wss.splice(index + 1, 0, ...dragwss);
                    if (!dropwss.some(s => s.folderId ? true : false))
                        dropwss.forEach((c, i) => {
                            c.folderId = guid;
                            ops.push({ name: 'update', id: c.id, folderId: guid })
                        })
                }
                else {
                    lodash.remove(wss, c => dragwss.some(g => g.id == c.id));
                    var index = wss.findIndex(c => c.id == dropwss.last().id);
                    wss.splice(index + 1, 0, ...dragwss);
                    wss.forEach((c, i) => {
                        c.at = i + 2;
                        ops.push({ name: 'update', id: c.id, at: i + 2 })
                    })
                    if (!dropwss.some(s => s.folderId ? true : false))
                        dropwss.forEach((c, i) => {
                            c.folderId = guid;
                            ops.push({ name: 'update', id: c.id, folderId: guid })
                        })
                }
            }
            else if (arrow == 'drag-top') {
                var folderId = dropwss.first().folderId;
                if (nofolder) folderId = null;
                if (isAllAts) {

                    var maxAt = dropwss.min(x => x.at);
                    var index = wss.findIndex(c => c.at <= maxAt);
                    wss.slice(0, index).forEach(c => { c.at = c.at - dragwss.length })
                    ops.push({ name: 'inc', filter: { at: { $lt: maxAt } }, inc: 0 - dragwss.length });
                    dragwss.eachReverse((x, i) => {
                        ops.push({ name: "update", folderId: isDragFolder ? undefined : (folderId || null), id: x.id, at: maxAt - i - 1 });
                        x.at = maxAt - i - 1;
                        if (!isDragFolder) {
                            if (folderId) x.folderId = folderId;
                            else if (x.folderId) x.folderId = null;
                        }

                    });
                    lodash.remove(wss, c => dragwss.some(g => g.id == c.id));
                    index = wss.findIndex(c => c.id == dropwss.first().id);
                    wss.splice(index, 0, ...dragwss);
                }
                else {
                    lodash.remove(wss, c => dragwss.some(g => g.id == c.id));
                    var index = wss.findIndex(c => c.id == dropwss.first().id);
                    wss.splice(index, 0, ...dragwss);
                    if (!isDragFolder) {
                        if (folderId) {
                            dragwss.forEach(ds => {
                                ds.folderId = folderId;
                                ops.push({ name: 'update', id: ds.id, folderId: folderId })
                            })
                        } else {
                            dragwss.forEach(ds => {
                                if (ds.folderId) {
                                    ds.folderId = null;
                                    ops.push({ name: 'update', id: ds.id, folderId: null })
                                }
                            })
                        }
                    }
                    wss.forEach((c, i) => {
                        c.at = i + 2;
                        ops.push({ name: 'update', id: c.id, at: i + 2 })
                    })
                }
            }
            else if (arrow == 'drag-bottom') {
                var folderId = dropwss.first().folderId;
                if (nofolder) folderId = null;
                if (isAllAts) {
                    var maxAt = dropwss.max(x => x.at);
                    var index = wss.findIndex(c => c.at > maxAt);
                    wss.slice(index).forEach(c => c.at = c.at + dragwss.length)
                    ops.push({ name: 'inc', filter: { at: { $gt: maxAt } }, inc: dragwss.length });
                    dragwss.each(x => {
                        ops.push({ name: "update", id: x.id, folderId: isDragFolder ? undefined : (folderId || null), at: maxAt + 1 });
                        x.at = maxAt + 1;
                        if (!isDragFolder) {
                            if (folderId) x.folderId = folderId;
                            else x.folderId = null;
                        }
                        maxAt++;
                    });
                    lodash.remove(wss, c => dragwss.some(g => g.id == c.id));
                    index = wss.findIndex(c => c.id == dropwss.last().id);
                    wss.splice(index + 1, 0, ...dragwss);
                }
                else {
                    lodash.remove(wss, c => dragwss.some(g => g.id == c.id));
                    var index = wss.findIndex(c => c.id == dropwss.last().id);
                    wss.splice(index + 1, 0, ...dragwss);
                    if (!isDragFolder) {
                        if (folderId) {
                            dragwss.forEach(ds => {
                                ds.folderId = folderId;
                                ops.push({ name: 'update', id: ds.id, folderId: folderId })
                            })
                        }
                        else {
                            dragwss.forEach(ds => {
                                if (ds.folderId) {
                                    ds.folderId = null;
                                    ops.push({ name: 'update', id: ds.id, folderId: null })
                                }
                            })
                        }
                    }
                    wss.forEach((c, i) => {
                        c.at = i + 2;
                        ops.push({ name: 'update', id: c.id, at: i + 2 })
                    })
                }
            }
            if (willDragFolderId) {
                var others = wss.filter(c => c.folderId == willDragFolderId);
                if (others.length == 1) {
                    ops.push({ name: 'update', id: others.first().id, folderId: null })
                    others.first().folderId = null;
                }
            }
            await masterSock.patch('/user/wss/sync', { ops: ops })
        }
        catch (ex) {

        }
        finally {
            surface.wss = wss;
            await yCache.set(SIDE_FOLDER_SPREAD_KEY, this.folderSpread);
        }
    }
    onDragWs(event: React.MouseEvent, isFolder?: boolean) {
        event.stopPropagation();
        var ele = event.currentTarget as HTMLElement;
        var ws: UserWorkspaceItem = null;
        var wsId = ele.getAttribute('data-ws-id');
        if (wsId) ws = surface.wss.find(x => x.id == wsId);
        else {
            var folderId = ele.getAttribute('data-folder-id');
            if (folderId) ws = surface.wss.find(x => x.folderId == folderId);
        }
        if (!ws) return;
        MouseDragger({
            event,
            moveStart: (event, data, crossData) => {
                ghostView.load(ele, { point: Point.from(event) });
            },
            moving: (event, data, isEnd, isMove) => {
                ghostView.move(Point.from(event));
                var ec = event.target as HTMLElement;
                var cu = ec.closest('.shy-sidebar-ws') as HTMLElement;
                if (!cu) cu = ec.closest('.shy-sidebar-ws-folder') as HTMLElement;
                if (!cu) cu = ec.closest('.shy-sidebar-ws-folder-spread') as HTMLElement;
                if (!cu) {
                    var b = this.el.querySelector('.shy-sidebar-body') as HTMLElement;
                    if (b) {
                        var rb = Rect.fromEle(b);
                        if (event.clientX > rb.left && event.clientX < rb.right) {
                            var cs = Array.from(b.children) as HTMLElement[];
                            var cf = cs[0];
                            if (!(cf.getAttribute('data-ws-id') || cf.getAttribute('data-folder-id'))) {
                                cs = cs.slice(1);
                            }
                            if (event.clientY < rb.middle) {
                                cu = cs.first();
                            }
                            else {
                                cu = cs.last();
                            }
                        }
                    }
                }
                var rect = Rect.fromEle(cu);
                var e = this.el.querySelector('.drag-bottom,.drag-top,.drag-center');
                if (e) {
                    e.classList.remove('drag-bottom', 'drag-top', 'drag-center');
                }
                var arrow: string = '';
                if (cu) {
                    if (event.clientY > rect.bottom - rect.height * 0.33) {
                        arrow = 'drag-bottom';
                    }
                    else if (event.clientY < rect.top + rect.height * 0.33) {
                        arrow = 'drag-top'
                    }
                    else if (event.clientY > rect.top && event.clientY < rect.bottom) {
                        var wsId = cu.getAttribute('data-ws-id');
                        var folderId = cu.getAttribute('data-folder-id');
                        if (folderId) arrow = 'drag-center';
                        else {
                            if (wsId && surface.wss.find(x => x.id == wsId)?.folderId) arrow = '';
                            else arrow = 'drag-center';
                        }
                    }
                    try {
                        if (arrow)
                            cu.classList.add(arrow);
                    }
                    catch (ex) {
                        console.error(ex, cu);
                    }
                }
                if (isEnd) {
                    if (isMove) {
                        if (cu && arrow) {
                            var wsId = cu.getAttribute('data-ws-id');
                            var folderId = cu.getAttribute('data-folder-id');
                            if (wsId) {
                                this.onDragSave(ws, isFolder, wsId, 'ws', arrow as any)
                            }
                            else if (folderId) {
                                this.onDragSave(ws, isFolder, folderId, 'folder', arrow as any)
                            }
                        }
                    }
                    else {
                        if (ws.folderId && isFolder) { this.folderSpread[ws.folderId] = true; yCache.set(SIDE_FOLDER_SPREAD_KEY, this.folderSpread); }
                        else surface.onChangeWorkspace(ws);
                    }
                    ghostView.unload();
                    var e = this.el.querySelector('.drag-bottom,.drag-top,.drag-center');
                    if (e) {
                        e.classList.remove('drag-bottom', 'drag-top', 'drag-center');
                    }
                }
            }
        })
    }
    renderWs(workspace: UserWorkspaceItem, size?: 48 | 20, isFolderIn?: boolean) {
        if (size == 20) {
            if (workspace.icon) return <a className="shy-sidebar-ws-icon cursor  size-16 flex-center   relative">
                <img src={autoImageUrl(workspace?.icon.url, 120)} style={{ width: 16, height: 16 }} />
                <DotNumber count={workspace?.unreadChats?.length} ></DotNumber>
            </a>
            else return <a className="shy-sidebar-ws-name  cursor  size-16 flex-center   relative">
                <span style={{ fontSize: 6 }}>{ShyUtil.firstToUpper(workspace?.text?.slice(0, 2))}</span>
                <DotNumber count={workspace?.unreadChats?.length} ></DotNumber>
            </a>
        }
        else {
            if (workspace.icon) return <a className={"shy-sidebar-ws-icon cursor  size-48 flex-center  gap-h-4  relative " + (isFolderIn ? "" : "gap-w-12")}>
                <img src={autoImageUrl(workspace?.icon.url, 120)} style={{ width: 48, height: 48 }} />
                <DotNumber count={workspace?.unreadChats?.length} ></DotNumber>
            </a>
            else return <a className={"shy-sidebar-ws-name  cursor  size-48 flex-center  gap-h-4  relative " + (isFolderIn ? "" : "gap-w-12")}>
                <span style={{ fontSize: 18 }}>{ShyUtil.firstToUpper(workspace?.text?.slice(0, 2))}</span>
                <DotNumber count={workspace?.unreadChats?.length} ></DotNumber>
            </a>
        }

    }
    renderWsOverlay(workspace: UserWorkspaceItem) {
        if (!workspace.overlayDate) return <div>
            <div>
                <span>{workspace.text}</span>
                {workspace.memberCount > 20 && <span className="gap-l-10"><Sp text={'{count}成员'} data={{ count: workspace.memberCount }}>{workspace.memberCount}成员</Sp></span>}
            </div>
        </div>
        else return <div>
            <div><span>{workspace.text}</span>
                {workspace.memberOnlineCount > 0 && <span className="gap-l-10"><Sp text='{count}人在线' data={{ count: workspace.memberOnlineCount }}>{workspace.memberOnlineCount}人在线</Sp></span>}
                {!workspace.memberOnlineCount && workspace.memberCount > 20 && <span className="gap-l-10"><Sp text={'{count}成员'} data={{ count: workspace.memberCount }}>{workspace.memberCount}成员</Sp></span>}
            </div>
            {workspace.randomOnlineUsers.size > 0 && !(workspace.randomOnlineUsers.size == 1 && surface.user && workspace.randomOnlineUsers.has(surface.user?.id)) && <div><UserAvatars users={workspace.randomOnlineUsers}></UserAvatars></div>}
        </div>
    }
    folderSpread: Record<string, boolean> = {};
    renderWss() {
        var es: JSX.Element[] = [];
        var rs: string[] = [];
        for (let i = 0; i < surface.wss.length; i++) {
            var ws = surface.wss[i];
            if (ws.folderId && rs.includes(ws.folderId) || rs.includes(ws.id)) continue;
            if (ws.folderId) {
                rs.push(ws.folderId);
                var list = surface.wss.filter(x => x.folderId == ws.folderId);
                es.push(<div key={ws.folderId}>
                    {this.folderSpread[ws.folderId] == true && <div data-folder-id={ws.folderId} className="shy-sidebar-ws-folder-spread gap-w-12 gap-h-4" onMouseDown={e => this.onDragWs(e, true)}>
                        <ToolTip placement="right" overlay={<div>{list.map((l, i) => <span className="bold" key={l.id}>{l.text}{i < list.length - 1 ? "," : ""}</span>)}</div>}> <div onMouseDown={e => {
                            var wsFolderId = ((e.currentTarget as HTMLElement).parentNode as HTMLElement).getAttribute('data-folder-id');
                            e.stopPropagation();
                            this.folderSpread[wsFolderId] = this.folderSpread[wsFolderId] == true ? false : true;
                            yCache.set(SIDE_FOLDER_SPREAD_KEY, this.folderSpread);
                        }} className="size-48 foder-btn flex-center cursor">
                            <Icon icon={SlideBarFolderSvg} size={24}></Icon>
                        </div>
                        </ToolTip>
                        <div className="shy-sidebar-ws-folder-spread-wss  flex flex-col">
                            {list.map(ws => {
                                return <ToolTip key={ws.id}
                                    placement="right"
                                    mouseenter={(e, t) => this.loadWsOnline(ws, t)}
                                    overlay={this.renderWsOverlay(ws)}><div className={'shy-sidebar-ws no-gap ' + (surface.workspace?.id == ws.id ? " hover" : "")} data-ws-id={ws.id} onMouseDown={e => { this.onDragWs(e) }}>
                                        {this.renderWs(ws, 48, true)}
                                    </div></ToolTip>
                            })}
                        </div>
                    </div>}
                    {this.folderSpread[ws.folderId] != true && <ToolTip placement="right" overlay={<div>{list.map((l, i) => <span className="bold" key={l.id}>{l.text}{i < list.length - 1 ? "," : ""}</span>)}</div>}> <div
                        data-folder-id={ws.folderId}
                        className="shy-sidebar-ws-folder "
                        onMouseDown={e => {
                            this.onDragWs(e, true)
                        }}
                    ><div className="shy-sidebar-ws-folder-close cursor  size-48  flex flex-top gap-w-12 gap-h-4  relative">{list.slice(0, 4).map(ws => {
                        return <div className="size-16 flex-center" key={ws.id}>
                            {this.renderWs(ws, 20)}
                        </div>
                    })}</div>
                    </div></ToolTip>}
                </div>)
            }
            else {
                rs.push(ws.id);
                es.push(<ToolTip key={ws.id}
                    placement="right"
                    mouseenter={(e, t) => this.loadWsOnline(ws, t)}
                    overlay={this.renderWsOverlay(ws)}><div
                        onMouseDown={e => {
                            this.onDragWs(e)
                        }} data-ws-id={ws.id} className={'shy-sidebar-ws' + (surface.workspace?.id == ws.id ? " hover" : "")}>
                        {this.renderWs(ws, 48)}
                    </div></ToolTip>)
            }
        }
        return es;
    }
    el: HTMLElement;
    render() {
        if (!surface.showSlideBar) return <></>
        return <div ref={e => { this.el = e }} style={{ width: 72 }} className='shy-sidebar flex-fixed flex flex-col flex-nowrap flex-full'>
            <a className="shy-sidebar-operator no-hover size-48 flex-center gap-12 flex-fixed"
                style={{ position: 'relative', marginTop: window.shyConfig.isDesk && UA.isMacOs ? 30 : 20 }}
                onMouseDown={e => {
                    if (isMobileOnly) return;
                    UrlRoute.push(ShyUrl.me);
                    surface.workspace.exitWorkspace();
                }}>
                <ToolTip placement="right" overlay={lst('私信')}><Icon icon={ShyLog} size={48}></Icon></ToolTip>
                <DotNumber count={userChannelStore.unReadChatCount} ></DotNumber>
            </a>
            <div className="shy-sidebar-divider flex-fixed "></div>
            <div className="shy-sidebar-body flex-fixed flex flex-col  " style={{ maxHeight: 'calc(100% - 250px)' }}>
                {surface.temporaryWs && <ToolTip key={surface.temporaryWs.id} placement="right" overlay={surface.temporaryWs.text}><div onMouseDown={e => surface.onChangeWorkspace(surface.temporaryWs)} key={surface.temporaryWs.id} className={'shy-sidebar-ws size-48 flex-center gap-12 ' + (surface.workspace.id == surface.temporaryWs.id ? " hover" : "")}>{this.renderWs(surface.temporaryWs)}</div></ToolTip>}
                {this.renderWss()}
            </div>
            <div className="flex-fixed flex flex-col flex-center">
                <a className="shy-sidebar-operator size-48 flex-center gap-12" onMouseDown={e => surface.onCreateWorkspace()} ><Icon size={24} icon={PlusSvg}></Icon></a>
                <a className="shy-sidebar-operator size-48 flex-center gap-12" onMouseDown={e => { UrlRoute.push(ShyUrl.discovery); surface.workspace?.exitWorkspace(); }}><Icon size={24} icon={PubWorkspace}></Icon></a>
                {window.shyConfig?.isWeb && <><div className="shy-sidebar-divider"></div><a target="_blank" href={window.shyConfig?.isUS ? "https://shy.red/download" : "https://shy.live/download"} className="shy-sidebar-operator size-48 flex-center gap-12"><Icon size={24} icon={{ name: 'byte', code: 'to-bottom' }}></Icon></a></>}
            </div>
        </div>
    }
}

