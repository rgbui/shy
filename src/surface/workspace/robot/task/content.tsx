import { EventsComponent } from "rich/component/lib/events.component";
import { makeObservable, observable } from "mobx";
import React from "react";
import { RobotTask } from "../declare";
import { Input } from "rich/component/view/input";
import { Textarea } from "rich/component/view/input/textarea";
import { SelectBox } from "rich/component/view/select/box";
import { PopoverSingleton } from "rich/extensions/popover/popover";
export class TaskContent extends EventsComponent {
    constructor(props) {
        super(props)
        makeObservable(this, { task: observable })
    }
    task: RobotTask = null;
    render() {
        if (!this.task) return <div>
        </div>
        return <div className="w-500 max-h-300 overflow-y">
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
                        return <div key={reply.id} className='flex'>
                            <div><SelectBox value={reply.mime} onChange={e => reply.mime = e as any} options={[
                                { name: 'markdown', value: 'markdown' },
                                { name: 'json', value: 'json' },
                                { name: 'error', value: 'error' },
                                { name: 'image', value: 'image' },
                            ]}></SelectBox></div>
                            <div><Input value={reply.content} onChange={e => reply.content = e}></Input></div>
                            <div><Input value={reply.template} onChange={e => reply.template = e}></Input></div>
                        </div>
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
        if (!task) this.task = { nextActions: [], name: '', method: 'GET', url: '', handle: 'sync', flag: 'write', description: '', args: [], headers: [], replys: [], template: '' }
        else this.task = task;
    }
}

export async function useTaskContent(task?: RobotTask) {
    let popover = await PopoverSingleton(TaskContent, { mask: true, shadow: true });
    let fv = await popover.open({ center: true, centerTop: 100 });
    fv.open(task);
    return new Promise((resolve: (task: RobotTask) => void, reject) => {
        fv.only('close', () => {
            popover.close();
            resolve(fv.task);
        });
        fv.only('save', () => {
            popover.close();
            resolve(fv.task);
        })
        popover.only('close', () => {
            resolve(fv.task);
        });
    })
}