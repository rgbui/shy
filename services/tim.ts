import { channel } from "rich/net/channel";
import { timService } from "../net/primus";
import { surface } from "../src/surface";
import { PageItemOperateNotify } from "../src/surface/sln/item/store/notify";
import { userChannelStore } from "../src/surface/user/channel/store";
export enum MessageUrl {
    privateTalk = '/user/chat/notify',
    userPayOrder='/user/order/notify',
    pageItemOperate = '/ws/page/item/operate/notify',
    viewOperate = '/ws/view/operate/notify',
    dateGridOperator = '/ws/datagrid/schema/operate/notify',
    enterWorkspace = '/ws/enter/notify',
    leaveWorkspace = '/ws/leave/notify',
    channelNotify = '/ws/channel/notify',
    channelPatchNotify = '/ws/channel/patch/notify',
    channelEmojiNotify = '/ws/channel/emoji/notify',

}

export function bindCollaboration() {
    /*用户个人协作*/
    //私信
    timService.tim.on('/user/chat/notify', e => userChannelStore.notifyChat(e));
    timService.tim.on('/user/order/notify',e=>channel.fire(MessageUrl.userPayOrder, e))
    /*空间协作*/
    //空间会话
    timService.tim.on(MessageUrl.channelNotify, e => { channel.fire(MessageUrl.channelNotify, e) });
    timService.tim.on(MessageUrl.channelPatchNotify, e => { channel.fire(MessageUrl.channelPatchNotify, e) });
    timService.tim.on(MessageUrl.channelEmojiNotify, e => { channel.fire(MessageUrl.channelEmojiNotify, e) });
    //页面文档
    timService.tim.on('/ws/view/operate/notify', e => {
        if (surface.workspace?.id == e.workspaceId) {
            surface.workspace.onNotifyViewOperater(e);
        }
    });
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
    timService.tim.on('/ws/view/cursor/operate/notify', e => {
        if (e.workspaceId != surface.workspace.id) return;
        if (e.viewId) {
            // if (surface.supervisor.itemId == e.viewId) {
            //     surface.supervisor.item.contentView.loadUserViewCursor(e);
            // }
        }
    })
}