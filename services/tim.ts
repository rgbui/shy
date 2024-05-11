
import { channel } from "rich/net/channel";
import { userCacheStore } from "./cache/user";
import { Tim } from "../net/primus/tim";
import { surface } from "../src/surface/app/store";
import { PageItemOperateNotify } from "../src/surface/sln/item/store/notify";
import { userChannelStore } from "../src/surface/user/channel/store";


import { SyncMessageUrl } from "rich/net/sync.message";


export function userTimNotify(tim: Tim) {
    /**
  * 用户个人状态同步
  * MessageUrl.userOnlineNotify,
  * MessageUrl.userOffLineNotify,
  * MessageUrl.userPatchStatusNotify
  * 通知至好友，用户的其它设备、空间
  * 
  * 其余仅通知用户的其它设备
  * 
  * MessageUrl.userFriendRequestNotify
  * 来自于有人发起好友的请求
  */
    tim.on(SyncMessageUrl.userOnlineNotify, e => {
        if (typeof e.data == 'object' && Object.keys(e.data).length > 0) {
            if (e.userid == surface.user.id) surface.user.syncUserInfo(e.data)
            userCacheStore.notifyUpdate(e.userid, e.data)
        }
    });
    tim.on(SyncMessageUrl.userOffLineNotify, e => {
        if (typeof e.data == 'object' && Object.keys(e.data).length > 0) {
            if (e.userid == surface.user.id) surface.user.syncUserInfo(e.data)
            userCacheStore.notifyUpdate(e.userid, e.data)
        }
    });
    tim.on(SyncMessageUrl.userPatchStatusNotify, e => {
        if (typeof e.data == 'object' && Object.keys(e.data).length > 0) {
            if (e.userid == surface.user.id) surface.user.syncUserInfo(e.data)
            userCacheStore.notifyUpdate(e.userid, e.data)
        }
    });
    tim.on(SyncMessageUrl.userPatchNotify, e => {
        if (typeof e.data == 'object' && Object.keys(e.data).length > 0) {
            if (e.userid == surface.user.id) surface.user.syncUserInfo(e.data)
            userCacheStore.notifyUpdate(e.userid, e.data)
        }
    });
    tim.on(SyncMessageUrl.userJoinOrExitWsNotify, async e => {
        await surface.loadWorkspaceList();
    });
    tim.on(SyncMessageUrl.userFriendChangesNotify, e => {
        userChannelStore.loadFriends()
    });
    tim.on(SyncMessageUrl.userFriendRequestNotify, e => {
        /**
         * 这个用户发起了好友请求
         */
        console.log(e.requestUserid);
        userChannelStore.loadPends();
    });
    //私信
    tim.on(SyncMessageUrl.userTalkNotify, e => userChannelStore.notifyChat(e));
}

export type SparkSession = {
    userid?: string,
    workspaceId?: string;
    viewUrl?: string;
}

export function workspaceNotifys(tim: Tim) {

    /*空间协作*/
    //文档
    tim.only(SyncMessageUrl.viewOperate, async (e, op) => {
        await channel.fire(SyncMessageUrl.viewOperate, e as any, op)
        // if (surface.workspace?.id == e.workspaceId) {
        //     window.shyLog('notify view operate', e);
        //     surface.workspace.onNotifyViewOperater(e as any);
        // }
    });
    tim.only(SyncMessageUrl.viewOperates, async (e, op) => {
        // if (surface.workspace?.id == e.workspaceId) {
        //     window.shyLog('notify view operate', e);
        if (Array.isArray(e.operates)) {
            await channel.fire(SyncMessageUrl.viewOperates, e as any, op)
            // await e.operates.eachAsync(async ee => {
            //     await channel.fire(SyncMessageUrl.viewOperate, ee, op)
            //     // await surface.workspace.onNotifyViewOperater(e);
            // })
        }
        // }
    });
    tim.only(SyncMessageUrl.blcokSyncRefs, async (e, op) => {
        await channel.fire(SyncMessageUrl.blcokSyncRefs, e as any, op)
    })

    //空间会话
    tim.only(SyncMessageUrl.channelNotify, (e: { id: string, seq?: number, workspaceId: string, roomId: string }) => {
        try {
            var ws = surface.wss.find(g => g.id == e.workspaceId);
            if (ws) {
                if (surface?.supervisor?.page.item.id !== e.roomId) {
                    ws.unreadChats.push({ roomId: e.roomId, seq: e.seq, id: e.id })
                    if (ws.id == surface.workspace.id) {
                        var item = surface.workspace.find(g => g.id == e.roomId);
                        if (item) {
                            item.unreadChats.push({ roomId: e.roomId, seq: e.seq, id: e.id })
                        }
                    }
                }
            }
            channel.fire(SyncMessageUrl.channelNotify, e)
        }
        catch (ex) {
            console.error(ex);
        }
    });
    tim.only(SyncMessageUrl.channelPatchNotify, (e, op) => { channel.fire(SyncMessageUrl.channelPatchNotify, e as any) });
    tim.only(SyncMessageUrl.channelEmojiNotify, (e, op) => { channel.fire(SyncMessageUrl.channelEmojiNotify, e as any) });

    //页面侧栏
    tim.only(SyncMessageUrl.pageItemOperate, (e, op) => {
        PageItemOperateNotify(e as any, op);
    });
    //页面数据表格元数据
    tim.only(SyncMessageUrl.dateGridOperator, (e, op) => { });
    tim.only(SyncMessageUrl.workspaceSync, (e: {
        exitView: string,
        exitWsId: string,
        userid: string,
        enterView: string,
        enterWsId: string,
        currentView: string,
        currentWsId: string
    }, op) => {
        if (e.enterWsId && surface.workspace.id == e.enterWsId) {
            surface.workspace.onLineUsers.add(e.userid);
            channel.fire('/user/onlines', { users: surface.workspace.onLineUsers }, op)
        }
        if (e.exitWsId && surface.workspace.id == e.exitWsId) {
            surface.workspace.onLineUsers.delete(e.userid);
            channel.fire('/user/onlines', { users: surface.workspace.onLineUsers }, op)
        }

        if (e.exitView && (!e.exitWsId && surface.workspace.id == e.currentWsId || e.exitWsId == surface.workspace.id)) {
            var vo = surface.workspace.viewOnlineUsers;
            var gr = vo.get(e.exitView);
            if (gr) gr.users.delete(e.userid);
            channel.air('/user/view/onlines', {
                viewUrl: e.exitView,
                users: surface.workspace.viewOnlineUsers.get(e.exitView)?.users || new Set(),
            })
        }

        if ((surface.workspace.id == e.enterWsId || surface.workspace.id == e.currentWsId) && e.enterView) {
            var vo = surface.workspace.viewOnlineUsers;
            var r = vo.get(e.enterView);
            if (r) { r.users.add(e.userid); }
            else {
                var se = new Set<string>();
                se.add(e.userid);
                vo.set(e.enterView, { load: false, users: se })
            }
            channel.fire('/user/view/onlines', {
                viewUrl: e.enterView,
                users: surface.workspace.viewOnlineUsers.get(e.enterView)?.users || new Set()
            })
        }

        if (surface.temporaryWs) {
            var wsIds: string[] = [];
            if (e.enterWsId) wsIds.push(e.enterWsId);
            if (e.exitWsId) wsIds.push(e.exitWsId);
            if (e.currentWsId) wsIds.push(e.currentWsId);
            if (wsIds.length > 0) {
                var wss = surface.wss.findAll(g => wsIds.includes(g.id));
                if (surface.temporaryWs && wsIds.includes(surface.temporaryWs?.id))
                    wss.push(surface.temporaryWs);
                wss.each(g => {
                    g.overlayDate = new Date(0);
                })
            }
        }
    })
    tim.only(SyncMessageUrl.patchWsNotify, (e: { wsId: string, data: Record<string, any> }) => {
        if (surface.workspace?.id == e.wsId) {
            Object.assign(surface.workspace, e.data);
        }
    })
}