import { channel } from "rich/net/channel";
import { timService } from "../net/primus";
import { userChannelStore } from "../src/surface/user/channel/store";
export enum MessageUrl {
    privateTalk = '/user/chat/notify',
    pageItemOperate = '/ws/page/item/operate/notify',
    viewOperate = '/ws/view/operate/notify',
    dateGridOperator = '/ws/datagrid/schema/operate/notify',
    enterWorkspace = '/ws/enter/notify',
    leaveWorkspace = '/ws/leave/notify',
    channelNotify = '/ws/channel/notify'
}

export function bindCollaboration() {
    /*用户个人协作*/
    //私信
    timService.tim.on('/user/chat/notify', e => userChannelStore.notifyChat(e));
    /*空间协作*/
    //空间会话
    timService.tim.on('/ws/channel/notify', e => { channel.fire('/ws/channel/notify', e) });
    //页面文档
    timService.tim.on('/ws/view/operate/notify', e => { console.log(e); });
    //页面侧栏
    timService.tim.on('/ws/page/item/operate/notify', e => { });
    //页面数据表格元数据
    timService.tim.on('/ws/datagrid/schema/operate/notify', e => { });
    /**
     * 用户进入这个空间，浏览某个页面
     */
    timService.tim.on('/ws/enter/notify', e => {
        console.log('/ws/enter/notify', e);
    });
    /**
     * 用户离开这个空间，离开这个页面
     */
    timService.tim.on('/ws/leave/notify', e => {
        console.log('/ws/leave/notify', e);
    });
}