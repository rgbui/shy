
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { PlusSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { useForm } from "rich/component/view/form/dialoug";
import { Icon } from "rich/component/view/icon";
import { masterSock } from "../../../../net/sock";
import { surface } from "../../app/store";
import { Divider } from "rich/component/view/grid";
import { RobotInfo } from "rich/types/user";
import { useOpenRobotSettings } from "./view";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import Pic from "../../../assert/img/robots.png";
import { ShyAlert } from "rich/component/lib/alert";

@observer
export class RobotList extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            robots: observable,
            loading: observable,
            currentRobot: observable
        })
    }
    robots: RobotInfo[] = [];
    loading: boolean = false;
    componentDidMount() {
        this.load()
    }
    async load() {
        try {
            this.loading = true;
            var r = await masterSock.get('/ws/my/robots', { wsId: surface.workspace.id });
            if (r.ok) {
                this.robots = r.data.list;
            }
        }
        catch (ex) {

        }
        finally {
            this.loading = false;
        }
    }
    async add(event: React.MouseEvent) {
        if (!surface.workspace.isManager) return ShyAlert(lst('你没有权限'));
        var g = await useForm({
            maskCloseNotSave: true,
            title: lst('创建AI机器人'),
            fields: [
                { name: 'text', placeholder: lst('机器人名称...'), type: 'input', text: lst('机器人名称') },
                {
                    name: 'slogan',
                    type: 'textarea',
                    text: lst('描述')
                }
            ]
        })
        if (g) {
            var s = await masterSock.put('/create/robot', { wsId: surface.workspace.id, data: { scene: 'wiki', name: g.text, slogan: g.slogan } });
            if (s.ok) {
                await surface.workspace.sock.put('/ws/member/add/robot', {
                    wsId: surface.workspace.id,
                    robotInfo: s.data.robot
                });
                this.robots.push(s.data.robot);
                this.open(s.data.robot)
            }
        }
    }
    open(robot: RobotInfo) {
        if (!surface.workspace.isManager) return ShyAlert(lst('你没有权限'));
        this.currentRobot = robot;
        useOpenRobotSettings(this.currentRobot);
    }
    currentRobot: RobotInfo = null;
    render() {
        return <div>
            <div className="h2 flex">
                <span className="flex-auto"><S>机器人列表</S></span>
            </div>
            <Divider></Divider>
            <div className="flex gap-h-10 padding-10">
                <div onMouseDown={e => this.add(e)} className="cursor flex-fixed circle flex-center item-hover gap-r-5" style={{ width: 30, height: 30, border: '1px dashed #ddd' }}>
                    <Icon icon={PlusSvg} size={20}></Icon>
                </div>
                <span onMouseDown={e => this.add(e)} className="remark"><S text='创建专属于自已的AI机器人'>创建专属于自已的AI机器人</S></span>
            </div>
            <div>
                {this.robots.map(robot => {
                    return <div key={robot.id} className="gap-h-10 cursor item-hover round padding-10" onMouseDown={e => this.open(robot)}>
                        <div className="flex-top">
                            <div className="flex-fixed">
                                <Avatar size={32} user={robot}></Avatar>
                            </div>
                            <div className="flex-auto gap-l-5">
                                <div>{robot.name}</div>
                                <div className="remark f-12">{robot.slogan}</div>
                            </div>
                        </div>
                    </div>
                })}
            </div>

            {this.robots.length == 10 && <div className="flex-center gap-t-50">
                <img src={Pic} style={{ maxWidth: 400 }} className="object-center" />
            </div>}
        </div>
    }
}