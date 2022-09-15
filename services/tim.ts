import { channel } from "rich/net/channel";
import { userNativeStore } from "../native/store/user";
import { timService } from "../net/primus";
import { surface } from "../src/surface";
import { PageItemOperateNotify } from "../src/surface/sln/item/store/notify";
import { userChannelStore } from "../src/surface/user/channel/store";

export enum MessageUrl {
    privateTalk = '/user/chat/notify',
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
    channelNotify = '/ws/channel/notify',
    channelDeletedNotify = '/ws/channel/deleted/notify',
    channelPatchNotify = '/ws/channel/patch/notify',
    channelEmojiNotify = '/ws/channel/emoji/notify'
}

export function ClientNotifys() {
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
    timService.tim.on(MessageUrl.userOnlineNotify, e => {
        console.log(e);
        if (typeof e.data == 'object' && Object.keys(e.data).length > 0) {
            if (e.userid == surface.user.id) surface.user.syncUserInfo(e.data)
            userNativeStore.notifyUpdate(e.userid, e.data)
        }
    });
    timService.tim.on(MessageUrl.userOffLineNotify, e => {
        console.log(e);
        if (typeof e.data == 'object' && Object.keys(e.data).length > 0) {
            if (e.userid == surface.user.id) surface.user.syncUserInfo(e.data)
            userNativeStore.notifyUpdate(e.userid, e.data)
        }
    });
    timService.tim.on(MessageUrl.userPatchStatusNotify, e => {
        console.log('dddd',e);
        if (typeof e.data == 'object' && Object.keys(e.data).length > 0) {
            if (e.userid == surface.user.id) surface.user.syncUserInfo(e.data)
            userNativeStore.notifyUpdate(e.userid, e.data)
        }
    });
    timService.tim.on(MessageUrl.userPatchNotify, e => {
        console.log('ddddss',e);
        if (typeof e.data == 'object' && Object.keys(e.data).length > 0) {
            if (e.userid == surface.user.id) surface.user.syncUserInfo(e.data)
            userNativeStore.notifyUpdate(e.userid, e.data)
        }
    });
    timService.tim.on(MessageUrl.userJoinOrExitWsNotify, async e => {
        await surface.loadWorkspaceList();
    });
    timService.tim.on(MessageUrl.userFriendChangesNotify, e => {
        userChannelStore.loadFriends()
    });
    timService.tim.on(MessageUrl.userFriendRequestNotify, e => {
        /**
         * 这个用户发起了好友请求
         */
        console.log(e.requestUserid);
        userChannelStore.loadPends();
    });

    //私信
    timService.tim.on(MessageUrl.privateTalk, e => userChannelStore.notifyChat(e));

    /*空间协作*/
    //文档
    timService.tim.on('/ws/view/operate/notify', e => {
        if (surface.workspace?.id == e.workspaceId) {
            surface.workspace.onNotifyViewOperater(e);
        }
    });

    //空间会话
    timService.tim.on(MessageUrl.channelNotify, e => { channel.fire(MessageUrl.channelNotify, e) });
    timService.tim.on(MessageUrl.channelPatchNotify, e => { channel.fire(MessageUrl.channelPatchNotify, e) });
    timService.tim.on(MessageUrl.channelEmojiNotify, e => { channel.fire(MessageUrl.channelEmojiNotify, e) });

    //页面侧栏
    timService.tim.on('/ws/page/item/operate/notify', e => { PageItemOperateNotify(e); });
    //页面数据表格元数据
    timService.tim.on('/ws/datagrid/schema/operate/notify', e => { });
    /**
     * 用户进入这个空间，浏览某个页面
     */
    timService.tim.on('/ws/enter/notify', e => {
        if (e.workspaceId != surface.workspace.id) return;
        if (e.leaveViewId) surface.workspace.removeViewLine(e, e.leaveViewId);
        if (e.viewId) surface.workspace.addViewLine(e.viewId, e);
    });
    /**
     * 用户离开这个空间，离开这个页面
     */
    timService.tim.on('/ws/leave/notify', e => {
        if (e.workspaceId != surface.workspace.id) return;
        if (e.viewId) surface.workspace.removeViewLine(e, e.viewId);
    });
}