
import { channel } from "rich/net/channel";
import { userNativeStore } from "../native/store/user";
import { Tim } from "../net/primus/tim";
import { surface } from "../src/surface/store";
import { PageItemOperateNotify } from "../src/surface/sln/item/store/notify";
import { userChannelStore } from "../src/surface/user/channel/store";

export enum MessageUrl {
    userTalkNotify = '/user/chat/notify',
    userTalkPatchNotify = '/user/chat/patch/notify',
    userPayNotify = '/user/pay/notify',
    userOnlineNotify = '/user/online/notify',
    userOffLineNotify = '/user/offline/notify',
    userPatchStatusNotify = '/user/patch/status/notify',
    userPatchNotify = '/user/patch/notify',
    userJoinOrExitWsNotify = '/user/joinOrExit/ws/notify',
    userFriendChangesNotify = '/user/friend/change/notify',
    userFriendRequestNotify = '/user/friend/request/notify',
    pageItemOperate = '/ws/page/item/operate/notify',
    viewOperate = '/ws/view/operate/notify',
    dateGridOperator = '/ws/datagrid/schema/operate/notify',
    enterWorkspace = '/ws/enter/notify',
    leaveWorkspace = '/ws/leave/notify',
    enterView = '/view/enter/notify',
    leaveView = '/view/leave/notify',
    channelNotify = '/ws/channel/notify',
    channelDeletedNotify = '/ws/channel/deleted/notify',
    channelPatchNotify = '/ws/channel/patch/notify',
    channelEmojiNotify = '/ws/channel/emoji/notify',
    patchWsNotify = '/ws/patch/notify'
}



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
    tim.on(MessageUrl.userOnlineNotify, e => {
        if (typeof e.data == 'object' && Object.keys(e.data).length > 0) {
            if (e.userid == surface.user.id) surface.user.syncUserInfo(e.data)
            userNativeStore.notifyUpdate(e.userid, e.data)
        }
    });
    tim.on(MessageUrl.userOffLineNotify, e => {
        if (typeof e.data == 'object' && Object.keys(e.data).length > 0) {
            if (e.userid == surface.user.id) surface.user.syncUserInfo(e.data)
            userNativeStore.notifyUpdate(e.userid, e.data)
        }
    });
    tim.on(MessageUrl.userPatchStatusNotify, e => {
        if (typeof e.data == 'object' && Object.keys(e.data).length > 0) {
            if (e.userid == surface.user.id) surface.user.syncUserInfo(e.data)
            userNativeStore.notifyUpdate(e.userid, e.data)
        }
    });
    tim.on(MessageUrl.userPatchNotify, e => {
        if (typeof e.data == 'object' && Object.keys(e.data).length > 0) {
            if (e.userid == surface.user.id) surface.user.syncUserInfo(e.data)
            userNativeStore.notifyUpdate(e.userid, e.data)
        }
    });
    tim.on(MessageUrl.userJoinOrExitWsNotify, async e => {
        await surface.loadWorkspaceList();
    });
    tim.on(MessageUrl.userFriendChangesNotify, e => {
        userChannelStore.loadFriends()
    });
    tim.on(MessageUrl.userFriendRequestNotify, e => {
        /**
         * 这个用户发起了好友请求
         */
        console.log(e.requestUserid);
        userChannelStore.loadPends();
    });

    //私信
    tim.on(MessageUrl.userTalkNotify, e => userChannelStore.notifyChat(e));

}


export function workspaceNotifys(tim: Tim) {

    /*空间协作*/
    //文档
    tim.only(MessageUrl.viewOperate, e => {
        if (surface.workspace?.id == e.workspaceId) {
            surface.workspace.onNotifyViewOperater(e);
        }
    });

    //空间会话
    tim.only(MessageUrl.channelNotify, (e: { id: string, seq?: number, workspaceId: string, roomId: string }) => {
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
            channel.fire(MessageUrl.channelNotify, e)
        }
        catch (ex) {
            console.error(ex);
        }
    });
    tim.only(MessageUrl.channelPatchNotify, e => { channel.fire(MessageUrl.channelPatchNotify, e) });
    tim.only(MessageUrl.channelEmojiNotify, e => { channel.fire(MessageUrl.channelEmojiNotify, e) });

    //页面侧栏
    tim.only('/ws/page/item/operate/notify', e => { PageItemOperateNotify(e); });
    //页面数据表格元数据
    tim.only('/ws/datagrid/schema/operate/notify', e => { });

    /**
     * 用户进入这个空间
     */
    tim.only(MessageUrl.enterWorkspace, (e: { wsId: string, userid: string }) => {
        if (surface.workspace?.id == e.wsId) {
            surface.workspace.onLineUsers.add(e.userid)
            channel.air('/user/onlines', { users: surface.workspace.onLineUsers })
        }
    });
    /**
     * 用户离开这个空间
     */
    tim.only(MessageUrl.leaveWorkspace, (e: { wsId: string, userid: string }) => {
        if (surface.workspace?.id == e.wsId) {
            surface.workspace.onLineUsers.delete(e.userid)
            channel.air('/user/onlines', { users: surface.workspace.onLineUsers })
        }
    });
    /**
    * 用户进入这个页面
    */
    tim.only(MessageUrl.enterView, (e: { viewId: string, wsId: string, userid: string }) => {
        if (surface.workspace?.id == e.wsId) {
            var r = surface.workspace.viewOnlineUsers.get(e.viewId);
            var se: Set<string>;
            if (r) { r.users.add(e.userid); se = r.users; }
            else { se = new Set(e.userid); surface.workspace.viewOnlineUsers.set(e.viewId, { load: false, users: se }) }
            channel.air('/user/view/onlines', { viewId: e.viewId, users: se })
        }
    });
    /**
     * 用户离开这个页面
     */
    tim.only(MessageUrl.leaveView, (e: { viewId: string, wsId: string, userid: string }) => {
        if (surface.workspace?.id == e.wsId) {
            var r = surface.workspace.viewOnlineUsers.get(e.viewId);
            if (r) {
                r.users.delete(e.userid)
                channel.air('/user/view/onlines', { viewId: e.viewId, users: r.users })
            }
        }
    });
    tim.only(MessageUrl.patchWsNotify, (e: { wsId: string, data: Record<string, any> }) => {
        if (surface.workspace?.id == e.wsId) {
            Object.assign(surface.workspace, e.data);
        }
    })
}