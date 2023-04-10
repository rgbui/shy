import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { DotsSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Spin } from "rich/component/view/spin";
import { Point } from "rich/src/common/vector/point";
import { masterSock } from "../../../../../net/sock";
import { RobotInfo, RobotTask } from "../declare";

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
        var r = await useSelectMenuItem({ roundPoint: Point.from(event) }, [{ name: 'edit' }, { name: "main" }, { name: 'disabled' }, { name: 'delete' }]);
        if (r) {
            if (r.item.name == 'delete') {
                var s = await masterSock.delete('/robot/task', { robot: this.robot.id, id: task.id });
                if (s.ok) {
                    this.tasks = this.tasks.filter(t => t.id != task.id);
                }
            }
            else if (r.item.name == 'edit') {
                var s = await masterSock.patch('/robot/task', { id: task.id, data: {} });
                if (s.ok) {
                    this.tasks = this.tasks.filter(t => t.id != task.id);
                }
            }
            else if (r.item.name == 'disabled') {
                var s = await masterSock.put('/robot/task', { id: task.id, data: { disabled: !task.disabled } });
                if (s.ok) {
                    task.disabled = !task.disabled;
                }
            }
            else if (r.item.name == 'main') {
                var s = await masterSock.patch('/robot/task', { id: task.id, data: { main: !task.main } });
                if (s.ok) {
                    task.main = !task.main;
                }
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
                {this.loading && <Spin block></Spin>}
                {this.tasks.map(task => {
                    return <div key={task.id}>
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