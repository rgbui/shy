
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { PlusSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { useForm } from "rich/component/view/form/dialoug";
import { Icon } from "rich/component/view/icon";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Point } from "rich/src/common/vector/point";
import { masterSock } from "../../../../net/sock";
import { surface } from "../../store";
import { RobotInfo } from "./declare";

@observer
export class RobotList extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            robots: observable,
            loading: observable,
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
            var r = await masterSock.get('/ws/robots', { wsId: surface.workspace.id });
            if (r.ok) {
                this.robots = r.data.robots;
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
                { name: 'addWiki' },
                { name: 'addCommand' }
            ]
        );
        if (r) {
            if (r.item.name == 'addWiki') {
                var g = await useForm({ title: '', fields: [{ name: 'text', type: 'input', text: '' }, { name: 'remark', type: 'textarea', text: '' }] })
                if (g) {
                    var s = await masterSock.put('/create/robot', { wsId: surface.workspace.id, data: { scene: 'wiki', name: g.text, remark: g.remark } });
                    if (s.ok) {
                        this.robots.push(s.data.robot);
                        this.open(s.data.robot)
                    }
                }
            }
            else if (r.item.name == 'addCommand') {
                var g = await useForm({ title: '', fields: [{ name: 'text', type: 'input', text: '' }, { name: 'remark', type: 'textarea', text: '' }] })
                if (g) {
                    var s = await masterSock.put('/create/robot', { wsId: surface.workspace.id, data: { scene: 'command', name: g.text, remark: g.remark } });
                    if (s.ok) {
                        this.robots.push(s.data.robot);
                        this.open(s.data.robot)
                    }
                }
            }
        }
    }
    open(robot: RobotInfo) {

    }
    render() {
        return <div>
            <div className="h2">
                <span></span>
                <span className="size-20 round flex-center flex-fixed pointer" onMouseDown={e => this.add(e)}><Icon size={18} icon={PlusSvg}></Icon></span>
            </div>
            <div className="">
                {this.robots.map(robot => {
                    return <div key={robot.id} onMouseDown={e => this.open(robot)}>
                        <div className="flex">
                            <div className="flex-fixed">
                                <Avatar user={robot}></Avatar>
                            </div>
                            <div className="flex-auto">
                                <div>{robot.name}</div>
                                <div>{robot.remark}</div>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    }
}