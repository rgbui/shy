import lodash from "lodash";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { DotsSvg, PlusSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Spin } from "rich/component/view/spin";
import { Point } from "rich/src/common/vector/point";
import { masterSock } from "../../../../../net/sock";
import { RobotInfo, RobotTask } from "../declare";
import { useTaskContent } from "./content";
import { MenuItemType } from "rich/component/view/menu/declare";

@observer
export class RobotTasksList extends React.Component<{ robot: RobotInfo }> {
    constructor(props) {
        super(props);
        this.robot = props.robot;
        makeObservable(this, {
            tasks: observable,
            loading: observable,
            robot: observable
        })
    }
    tasks: RobotTask[] = [];
    loading: boolean = false;
    robot: RobotInfo = null;
    componentDidMount() {
        this.load()
    }
    async load() {
        try {
            this.loading = true;
            var r = await masterSock.get('/robot/tasks', { robot: this.robot.id });
            if (r.ok) {
                this.tasks = r.data.tasks;
            }
        }
        catch (ex) {

        }
        finally {
            this.loading = false;
        }
    }
    async operator(event: React.MouseEvent, task: RobotTask) {
        var r = await useSelectMenuItem({ roundPoint: Point.from(event) }, [
            { name: 'edit', text: '编辑' },
            { text: '设为主入口', name: "main" },
            { text: '禁用', name: 'disabled' },
            { type: MenuItemType.divide },
            { text: '删除', name: 'delete' }
        ]);
        if (r) {
            if (r.item.name == 'delete') {
                var s = await masterSock.delete('/robot/task', { id: task.id });
                if (s.ok) {
                    this.tasks = this.tasks.filter(t => t.id != task.id);
                }
            }
            else if (r.item.name == 'edit') {
                var d = await useTaskContent(lodash.cloneDeep(task));
                if (d && lodash.isEqual(d, task) == false) {
                    var s = await masterSock.patch('/robot/task', { id: task.id, data: {} });
                    if (s.ok) {
                        this.tasks = this.tasks.filter(t => t.id != task.id);
                    }
                }
            }
            else if (r.item.name == 'disabled') {
                var s = await masterSock.patch('/robot/task', { id: task.id, data: { disabled: !task.disabled } });
                if (s.ok) {
                    task.disabled = !task.disabled;
                }
            }
            else if (r.item.name == 'main') {
                var s = await masterSock.patch('/set/robot/task/main', { id: task.id, robotId: this.robot.id });
                if (s.ok) {
                    task.main = !task.main;
                }
            }
        }
    }
    async add(event: React.MouseEvent) {
        var d = await useTaskContent(null);
        if (d) {
            var s = await masterSock.put('/robot/task', { data: d });
            if (s.ok) {
                this.tasks.push(s.data.task);
            }
        }
    }

    render() {
        return <div className="">
            <div>
                <div className="flex">
                    {this.robot && <Avatar user={this.robot}></Avatar>}
                </div>
            </div>
            <div className="">
                <div className="h3 flex"><span className="flex-auto">指令列表</span><span
                    className="flex-fixed size-24 cursor item-hover round"
                    onMouseDown={e => this.add(e)}><Icon icon={PlusSvg}></Icon></span></div>
                {this.loading && <Spin block></Spin>}
                {this.tasks.map(task => {
                    return <div key={task.id} className="shadow padding-14 gap-h-10 round">
                        <div className="flex">
                            <span className="flex-fixed">/{task.name}</span>
                            <span className="remark f-12 flex-auto">{task.description}</span>
                            <span className="flex-fixed flex-end size-24 round item-hover" onMouseDown={e => this.operator(e, task)}><Icon icon={DotsSvg}></Icon></span>
                        </div>
                    </div>
                })}
            </div>
        </div>
    }
}