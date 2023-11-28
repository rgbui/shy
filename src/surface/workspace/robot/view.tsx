import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Singleton } from "rich/component/lib/Singleton";
import React from "react";
import { RobotInfo } from "rich/types/user";
import { RobotWikiList } from "./src";
import lodash from "lodash";
import { channel } from "rich/net/channel";

@observer
export class RobotSettings extends EventsComponent {
    mode: string = 'settings';
    visible: boolean = false;
    robot: RobotInfo = null;
    constructor(props) {
        super(props);
        makeObservable(this, {
            visible: observable,
            mode: observable,
            robot: observable,
        });
    }
    close() {
        this.visible = false;
        this.forceUpdate();
        this.emit('close');
    }
    async open(robot: RobotInfo) {
        if (!this.robot?.robotId) {
            var r = await channel.get('/get/robot', { id: this.robot.id });
            if (r.ok) {
                this.robot = r.data.robot;
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
        var close = () => {
            this.visible = false;
        }
        return <div ref={e => this.el = e} style={{ zIndex: '10001', overflowY: 'scroll' }} className='shy-ws-settings fixed-full'>
            <div className='screen-content-1000   relative padding-t-50'>
                <div>
                    <RobotWikiList close={close} robot={this.robot}></RobotWikiList>
                </div>
            </div>
        </div>
    }
}
export async function useOpenRobotSettings(robot: RobotInfo) {
    var popover = await Singleton(RobotSettings);
    await popover.open(robot);

}