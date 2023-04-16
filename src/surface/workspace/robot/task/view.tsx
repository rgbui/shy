import lodash from "lodash";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { ButtonSvg, DotsSvg, EditSvg, ForbidSvg, PlusSvg, TrashSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Spin } from "rich/component/view/spin";
import { Point } from "rich/src/common/vector/point";
import { masterSock } from "../../../../../net/sock";
import { RobotInfo, RobotTask } from "../declare";
import { useTaskContent } from "./content";
import { MenuItemType } from "rich/component/view/menu/declare";
import { surface } from "../../../store";
import { Confirm } from "rich/component/lib/confirm";

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
            { name: 'edit', text: '编辑', icon: EditSvg },
            { text: '设为主入口', name: "main", icon: ButtonSvg },
            { text: '禁用', name: 'disabled', icon: ForbidSvg, checkLabel: task.disabled ? true : false },
            { type: MenuItemType.divide },
            { text: '删除', name: 'delete', icon: TrashSvg }
        ]);
        if (r) {
            if (r.item.name == 'delete') {
                if (await Confirm('确认删除指令吗')) {
                    var s = await masterSock.delete('/robot/task', { id: task.id });
                    if (s.ok) {
                        this.tasks = this.tasks.filter(t => t.id != task.id);
                    }
                }
            }
            else if (r.item.name == 'edit') {
                var d = await useTaskContent(lodash.cloneDeep(task));
                if (d && d.name && d.url && lodash.isEqual(d, task) == false) {
                    var s = await masterSock.patch('/robot/task', { id: task.id, data: d });
                    if (s.ok) {
                        Object.assign(task, d)
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
        if (d && d.name) {
            var s = await masterSock.put('/robot/task', { wsId: surface.workspace.id, robotId: this.robot.id, data: d });
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
            <div >
                <div className="h3 flex"><span className="flex-auto">指令列表</span><span
                    className="flex-fixed size-24 cursor item-hover round flex-center"
                    onMouseDown={e => this.add(e)}><Icon icon={PlusSvg}></Icon></span></div>
                {this.loading && <Spin block></Spin>}
                {this.tasks.map(task => {
                    return <div key={task.id} className={"shadow padding-14 gap-h-10 round" + (task.disabled == true ? " op-6" : "")}>
                        <div className="flex">
                            <span className="flex-auto"><span className=" bg-primary padding-w-10 round h-30 text-white">/{task.name}</span></span>
                            <span className="flex-fixed flex-end size-24 cursor round item-hover flex-center" onMouseDown={e => this.operator(e, task)}><Icon icon={DotsSvg}></Icon></span>
                        </div>
                        <div>
                            <span className="remark f-12 flex-auto">{task.description}</span>
                        </div>
                    </div>
                })}
            </div>
        </div>
    }
}