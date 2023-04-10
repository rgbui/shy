import { EventsComponent } from "rich/component/lib/events.component";
import { makeObservable, observable } from "mobx";
import React from "react";
import { RobotTask } from "../declare";
import { Input } from "rich/component/view/input";
import { Textarea } from "rich/component/view/input/textarea";
import { SelectBox } from "rich/component/view/select/box";

export class TaskContent extends EventsComponent {
    constructor(props) {
        super(props)
        makeObservable(this, { task: observable })
    }
    task: RobotTask = null;
    render() {
        if (!this.task) return <div>
        </div>
        return <div>
            <div><Input value={this.task.name} onChange={e => this.task.name = e}></Input></div>
            <div className="flex">
                <div><SelectBox value={this.task.method} onChange={e => this.task.method = e as string} options={[{ name: 'GET', text: 'GET' }, { name: 'POST', text: 'POST' }, { name: '', text: '' }]}></SelectBox></div>
                <div><Input value={this.task.url} onChange={e => this.task.url = e}></Input></div>

            </div>
            <div>
                <div><label></label> <div><SelectBox value={this.task.handle} onChange={e => this.task.handle = e as any} options={[{ name: 'GET', text: 'GET' }, { name: 'POST', text: 'POST' }, { name: '', text: '' }]}></SelectBox></div></div>
                <div><label></label> <div><SelectBox value={this.task.flag} onChange={e => this.task.flag = e as any} options={[{ name: 'GET', text: 'GET' }, { name: 'POST', text: 'POST' }, { name: '', text: '' }]}></SelectBox></div></div>
            </div>
            <div><Textarea value={this.task.description} onChange={e => this.task.description = e}></Textarea></div>
            <div>
                <div className="h3">请求</div>
                <div className="flex"><span>args</span><span>headers</span></div>
                <div>
                    {this.task.args.map(arg => {
                        return <div key={arg.name} className='flex'>
                            <div><Input value={arg.text} onChange={e => arg.text = e}></Input></div>
                            <div><Input value={arg.name} onChange={e => arg.name = e}></Input></div>
                            <div><SelectBox value={arg.type} onChange={e => arg.type = e as any} options={[{ name: 'string', value: 'string' }]}></SelectBox></div>
                        </div>
                    })}
                </div>
                <div>
                    {this.task.headers.map(head => {
                        return <div key={head.name} className='flex'>
                            <div><Input value={head.name} onChange={e => head.name = e}></Input></div>
                            <div><Input value={head.value} onChange={e => head.value = e}></Input></div>
                        </div>
                    })}
                </div>
            </div>

            <div>
                <div className="h3">响应</div>
                <div>
                    {this.task.replys.map(reply => {
                        return <div key={reply.id}></div>
                    })}
                </div>
            </div>

            <div>
                <div className="h3">显示</div>
                <div><Textarea value={this.task.template} onChange={e => this.task.template = e}></Textarea></div>
            </div>
        </div>
    }
    open(task: RobotTask) {
        this.task = task;
    }
}