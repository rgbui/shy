import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Singleton } from "rich/component/lib/Singleton";
import React from "react";
import { RobotInfo } from "rich/types/user";
import { RobotWikiList } from "./wiki";
import { RobotTasksList } from "./task/view";

@observer
export class RobotSettings extends EventsComponent {
    mode: string = 'settings';
    visible: boolean = false;
    constructor(props) {
        super(props);
        makeObservable(this, {
            visible: observable,
            mode: observable
        });
    }
    close() {
        this.visible = false;
        this.forceUpdate();
        this.emit('close');
    }
    open(robot: RobotInfo) {
        runInAction(() => {
            this.visible = true;
            this.robot = robot;
        })
    }
    robot: RobotInfo
    el: HTMLElement;
    render() {
        if (this.visible == false) return <div style={{ display: 'none' }}></div>
        var close = () => {
            this.visible = false;
        }
        return <div ref={e => this.el = e} style={{ zIndex: '10001', overflowY: 'scroll' }} className='shy-ws-settings fixed-full'>
            <div className='screen-content-1000   relative padding-t-50'>
                <div>{this.robot.scene == 'wiki' && <RobotWikiList close={close} robot={this.robot}></RobotWikiList>}
                    {this.robot.scene !== 'wiki' && <RobotTasksList close={close} robot={this.robot}></RobotTasksList>}
                </div>
            </div>
        </div>
    }
}
export async function useOpenRobotSettings(robot: RobotInfo) {
    var popover = await Singleton(RobotSettings);
    await popover.open(robot);

}