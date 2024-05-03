import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import { EventsComponent } from "rich/component/lib/events.component";

import React from "react";
import { RobotInfo } from "rich/types/user";

import lodash from "lodash";
import { channel } from "rich/net/channel";
import { ArrowLeftSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { S } from "rich/i18n/view";
import { RobotChat } from "./chat";
import { RobotInfoView } from "./info";
import { RobotTasksList } from "./task/view";
import { RobotWiki } from "./wiki/wiki";


import "./style.less";
import "../../../user/settings/style.less";
import "../../settings/style.less";

@observer
export default class RobotSettings extends EventsComponent {
    mode: string = 'settings';
    visible: boolean = false;
    robot: RobotInfo = null;
    local: {
        loading: boolean,

        tab: string,
    } = {

            loading: false,
            tab: '1'
        }
    constructor(props) {
        super(props);
        makeObservable(this, {
            visible: observable,
            mode: observable,
            robot: observable,
            local: observable
        });
    }
    close() {
        this.visible = false;
        this.forceUpdate();
        this.emit('close');
    }
    async open(robot: RobotInfo) {
        if (!robot?.robotId) {
            var r = await channel.get('/get/robot', { id: robot.id });
            if (r.ok) {
                robot = r.data.robot;
            }
        }
        runInAction(() => {
            this.visible = true;
            this.robot = lodash.cloneDeep(robot);
        })
    }
    el: HTMLElement;
    render() {
        if (this.visible == false) return <div style={{ display: 'none' }}></div>
        return <div ref={e => this.el = e} style={{ zIndex: '10001', overflowY: 'scroll' }} className='shy-ws-settings fixed-full'>
            <div className='screen-content-1000   relative padding-t-50'>
                <div>
                    {this.robot && this.renderRobotInfo()}
                </div>
            </div>
        </div>
    }
    renderRobotInfo() {
        var local = this.local;
        return <div>
            <div className="flex">
                <div className="flex-fixed flex item-hover padding-w-3 round cursor" onMouseDown={e => {
                    this.close()
                }}>
                    <span className="size-24 gap-r-5 flex-center"><Icon size={16} icon={ArrowLeftSvg}></Icon> </span><span><S>后退</S></span>
                </div>
            </div>
            <div>
                <RobotInfoView robot={this.robot}></RobotInfoView>
            </div>
            <div className="flex border-bottom gap-h-10 gap-b-20  r-h-30 r-cursor">
                <span onClick={e => local.tab = '1'} className={"flex-fixed padding-w-15 " + (local.tab == '1' ? "border-b-p" : "")}><S>对话</S></span>
                {/* <span onClick={e => local.tab = '5'} className={"flex-fixed padding-w-15 " + (local.tab == '5' ? "border-b-p" : "")}><S>常规</S></span> */}
                {this.robot.disabledWiki !== true && <span onClick={e => local.tab = '2'} className={"flex-fixed padding-w-15 " + (local.tab == '2' ? "border-b-p" : "")}><S>知识库</S></span>}
                {/* <span onClick={e => local.tab = '4'} className={"flex-fixed padding-w-15 " + (local.tab == '4' ? "border-b-p" : "")}><S>动作</S></span> */}
            </div>
            {local.tab == '1' && <div>
                <RobotChat close={()=>{this.close()}} robot={this.robot}></RobotChat>
            </div>}
            {local.tab == '2' && <div>
                <RobotWiki robot={this.robot}></RobotWiki>
            </div>}
            {local.tab == '4' && <div>
                <RobotTasksList robot={this.robot} ></RobotTasksList>
            </div>}
            {/* {local.tab == '5' && <div>
                <RobotSettingsView robot={this.robot}></RobotSettingsView>
            </div>} */}
        </div>
    }
}

