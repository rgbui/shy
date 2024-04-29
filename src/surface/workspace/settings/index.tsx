
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { ShyAlert } from "rich/component/lib/alert";
import { EventsComponent } from "rich/component/lib/events.component";
import { Divider } from "rich/component/view/grid";
import { surface } from "../../app/store";
import { SaveTip } from "../../../component/tip/save.tip";
import { ShyFeature } from "../../user/settings/order/feature";
import { AuditView } from "./audit";
import { ConsumeView } from "./consume";
import { WorkspaceInvite } from "./member/invite";
import { WorkspaceManage } from "./manage";
import { WorkspaceMembers } from "./member/member";
import { WorkspaceRoles } from "./roles";
import { SafeSetting } from "./safe";
import { WorkspaceSettingsView } from "./settings";
import { RobotList } from "../robot/list";
import { RecommendRobots } from "./member/robots";
import { SitePublishView } from "./publish";
import { config } from "../../../../common/config";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";

@observer
export default  class WsSettings extends EventsComponent {
    mode: string = 'settings';
    visible: boolean = false;
    constructor(props) {
        super(props);
        makeObservable(this, {
            visible: observable,
            mode: observable
        });
    }
    setMode(mode: WsSettings['mode']) {
        if (SaveTip.isOf(this.el)) {
            return;
        }
        this.mode = mode;
    }
    close() {
        if (SaveTip.isOf(this.el)) {
            return;
        }
        this.visible = false;
        this.emit('close');
    }
    open(mode?: string) {
        if (mode) this.mode = mode;
        else this.mode = 'settings';
        this.visible = true;
        this.forceUpdate();
    }
    deleteSpace() {
        ShyAlert(lst('暂时不支持删除空间'))
    }
    el: HTMLElement;
    render() {
        if (this.visible == false) return <div style={{ display: 'none' }}></div>
        return <div ref={e => this.el = e} className='shy-ws-settings fixed-full'>
            <div className='screen-content-1000 flex-full h100 relative'>
                <div className='flex-fixed w-200 shy-ws-settings-slide h100 box-border overflow-y'>
                    <div className='padding-h-60'>
                        <h4>{surface.workspace.text}</h4>
                        <a onMouseDown={e => this.setMode('settings')} className={this.mode == 'settings' ? "hover" : ""} ><S>概况</S></a>
                        <a onMouseDown={e => this.setMode('roles')} className={this.mode == 'roles' ? "hover" : ""}><S>角色组</S></a>
                        <a onMouseDown={e => this.setMode('manage')} className={this.mode == 'manage' ? "hover" : ""}><S>空间设置</S> </a>
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <h4><S>安全管理</S></h4>
                        <a onMouseDown={e => this.setMode('safe')} className={this.mode == 'safe' ? "hover" : ""}><S>安全设置</S></a>
                        {/*<a onMouseDown={e => this.setMode('audit')} className={this.mode == 'audit' ? "hover" : ""}>内容过滤</a> */}
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <h4><S>帐单</S></h4>
                        <a onMouseDown={e => this.setMode('consume')} className={this.mode == 'consume' ? "hover" : ""}><S>消费</S></a>
                        <a onMouseDown={e => this.mode = 'price'} className={this.mode == 'price' ? "hover" : ""}><S>定价</S></a>
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <h4><S>成员管理</S></h4>
                        <a onMouseDown={e => this.setMode('members')} className={this.mode == 'members' ? "hover" : ""} ><S>成员</S></a>
                        <a onMouseDown={e => this.setMode('invite')} className={this.mode == 'invite' ? "hover" : ""}><S>邀请</S></a>
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        {config.isTestBeta && <><h4><S>应用管理</S></h4>
                            <a onMouseDown={e => this.setMode('publish')} className={this.mode == 'publish' ? "hover" : ""} ><S>发布</S></a>
                            <Divider style={{ margin: '0px 15px' }}></Divider></>}
                        {/* <h4><S>机器人</S></h4>
                        <a onMouseDown={e => this.setMode('robotMember')} className={this.mode == 'robotMember' ? "hover" : ""} ><S>商店</S></a>
                        <a onMouseDown={e => this.setMode('robots')} className={this.mode == 'robots' ? "hover" : ""} ><S>我的机器人</S></a> */}
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <a className="warn" onMouseDown={e => this.deleteSpace()}><S>删除空间</S></a>
                    </div>
                </div>
                <div className='flex-fixed shy-ws-settings-content  h100 box-border overflow-y'>
                    <div className='padding-h-60'>
                        {this.mode == 'roles' && <WorkspaceRoles></WorkspaceRoles>}
                        {this.mode == 'settings' && <WorkspaceSettingsView ></WorkspaceSettingsView>}
                        {this.mode == 'members' && <WorkspaceMembers></WorkspaceMembers>}
                        {this.mode == 'invite' && <WorkspaceInvite></WorkspaceInvite>}
                        {this.mode == 'manage' && <WorkspaceManage></WorkspaceManage>}
                        {this.mode == 'safe' && <SafeSetting></SafeSetting>}
                        {this.mode == 'audit' && <AuditView></AuditView>}
                        {this.mode == 'price' && <ShyFeature></ShyFeature>}
                        {this.mode == 'consume' && <ConsumeView></ConsumeView>}
                        {this.mode == 'robots' && <RobotList></RobotList>}
                        {this.mode == 'robotMember' && <RecommendRobots></RecommendRobots>}
                        {this.mode == 'publish' && <SitePublishView></SitePublishView>}
                    </div>
                </div>
                <div className='shy-ws-settings-operators'>
                    <a onMouseDown={e => this.close()}>
                        <span>
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path
                                fill="hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%)"
                                d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                        </span>
                        <label><S>退出</S></label>
                    </a>
                </div>
            </div>
        </div>
    }
}

// export async function useOpenWorkspaceSettings(mode?: WsSettings['mode']) {
//     var popover = await Singleton(WsSettings);
//     popover.open(mode);
// }