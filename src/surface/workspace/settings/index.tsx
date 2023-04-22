
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { ShyAlert } from "rich/component/lib/alert";
import { EventsComponent } from "rich/component/lib/events.component";
import { Singleton } from "rich/component/lib/Singleton";
import { Divider } from "rich/component/view/grid";
import { surface } from "../../store";
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


@observer
export class WsSettings extends EventsComponent {
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
    open() {
        this.visible = true;
    }
    deleteSpace() {
        ShyAlert('暂时不支持删除空间')
    }
    el: HTMLElement;
    render() {
        if (this.visible == false) return <div style={{ display: 'none' }}></div>

        return <div ref={e => this.el = e} className='shy-ws-settings fixed-full'>
            <div className='screen-content-1000 flex-full h100 relative'>
                <div className='flex-fixed w-200 shy-ws-settings-slide h100 box-border overflow-y'>
                    <div className='padding-h-60'>
                        <h4>{surface.workspace.text}</h4>
                        <a onMouseDown={e => this.setMode('settings')} className={this.mode == 'settings' ? "hover" : ""} >概况</a>
                        <a onMouseDown={e => this.setMode('roles')} className={this.mode == 'roles' ? "hover" : ""}>身份组</a>
                        <a onMouseDown={e => this.setMode('manage')} className={this.mode == 'manage' ? "hover" : ""}>空间设置 </a>
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <h4>安全管理</h4>
                        <a onMouseDown={e => this.setMode('safe')} className={this.mode == 'safe' ? "hover" : ""}>安全设置</a>
                        {/*<a onMouseDown={e => this.setMode('audit')} className={this.mode == 'audit' ? "hover" : ""}>内容过滤</a> */}
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <h4>帐单</h4>
                        <a onMouseDown={e => this.mode = 'price'} className={this.mode == 'price' ? "hover" : ""}>定价</a>
                        <a onMouseDown={e => this.setMode('consume')} className={this.mode == 'consume' ? "hover" : ""}>空间使用量</a>
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <h4>机器人</h4>
                        <a onMouseDown={e => this.setMode('robotMember')} className={this.mode == 'robotMember' ? "hover" : ""} >机器人成员</a>
                        <a onMouseDown={e => this.setMode('robots')} className={this.mode == 'robots' ? "hover" : ""} >自定义机器人</a>
                        <h4>成员管理</h4>
                        <a onMouseDown={e => this.setMode('members')} className={this.mode == 'members' ? "hover" : ""} >成员</a>
                        <a onMouseDown={e => this.setMode('invite')} className={this.mode == 'invite' ? "hover" : ""}>邀请</a>
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <a className="warn" onMouseDown={e => this.deleteSpace()}>删除空间</a>
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
                    </div>
                </div>
                <div className='shy-ws-settings-operators'>
                    <a onMouseDown={e => this.close()}>
                        <span>
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path
                                fill="hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%)"
                                d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                        </span>
                        <label>退出</label>
                    </a>
                </div>
            </div>
        </div>
    }
}
export async function useOpenWorkspaceSettings() {
    var popover = await Singleton(WsSettings);
    popover.open();
}