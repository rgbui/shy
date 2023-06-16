
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { AiSvg, PageSvg, PlusSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { useForm } from "rich/component/view/form/dialoug";
import { Icon } from "rich/component/view/icon";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Point } from "rich/src/common/vector/point";
import { masterSock } from "../../../../net/sock";
import { surface } from "../../store";
import { Divider } from "rich/component/view/grid";
import { RobotInfo } from "rich/types/user";
import { useOpenRobotSettings } from "./view";

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
        var r = await useSelectMenuItem(
            { roundPoint: Point.from(event) },
            [
                { name: 'addWiki', text: '创建知识专家机器人', icon: PageSvg },
                {
                    name: 'addCommand',
                    text: '创建命令机器人',
                    icon: AiSvg,
                    disabled: surface.workspace.sn == 25 ||window.shyConfig.isDev ? false : true
                }
            ]
        );
        if (r) {
            if (r.item.name == 'addWiki') {
                var g = await useForm({ title: '创建知识专家机器人', fields: [{ name: 'text', type: 'input', text: '机器人名称' }, { name: 'slogan', type: 'textarea', text: '描述' }] })
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
            else if (r.item.name == 'addCommand') {
                var g = await useForm({ title: '创建命令机器人', fields: [{ name: 'text', type: 'input', text: '机器人名称' }, { name: 'slogan', type: 'textarea', text: '描述' }] })
                if (g) {
                    var s = await masterSock.put('/create/robot', { wsId: surface.workspace.id, data: { scene: 'command', name: g.text, slogan: g.slogan } });
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
        }
    }
    open(robot: RobotInfo) {
        this.currentRobot = robot;
        useOpenRobotSettings(this.currentRobot);
    }
    currentRobot: RobotInfo = null;
    render() {
        return <div>
            <div className="h2 flex">
                <span className="flex-auto">机器人列表</span>
            </div>
            <Divider></Divider>
            <div className="flex gap-h-10">
                <span className="remark">创建专属于自已的知识专家、指令执行机器人</span>
                <span className="size-20 cursor item-hover round flex-center flex-fixed pointer" onMouseDown={e => this.add(e)}><Icon size={18} icon={PlusSvg}></Icon></span>
            </div>
            <div className="">
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
        </div>
    }
}