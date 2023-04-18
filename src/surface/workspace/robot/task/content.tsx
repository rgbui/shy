import { EventsComponent } from "rich/component/lib/events.component";
import { makeObservable, observable } from "mobx";
import React from "react";
import { Input } from "rich/component/view/input";
import { Textarea } from "rich/component/view/input/textarea";
import { SelectBox } from "rich/component/view/select/box";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { observer } from "mobx-react";
import { util } from "rich/util/util";
import { PlusSvg, TrashSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import lodash from "lodash";
import { RobotTask } from "rich/types/user";

@observer
export class TaskContent extends EventsComponent {
    constructor(props) {
        super(props)
        makeObservable(this, {
            task: observable,
            requestTab: observable
        })
    }
    task: RobotTask = null;
    requestTab: 'args' | 'head' = 'args';
    render() {
        if (!this.task) return <div className="w-500 h-400"></div>
        return <div className="w-500 h-400 overflow-y padding-14 round r-gap-h-10">
            <div><Input placeholder="指令名称" value={this.task.name} onChange={e => this.task.name = e}></Input></div>
            <div className="flex">
                <div className="flex-fixed w-80"><SelectBox value={this.task.method} onChange={e => this.task.method = e as string} options={[
                    { value: 'GET', text: 'GET' },
                    { value: 'POST', text: 'POST' },
                    { value: 'PUT', text: 'PUT' },
                    { value: 'PATCH', text: 'PAT' },
                    { value: 'DELETE', text: 'DEL' },
                ]}></SelectBox></div>
                <div className="flex-auto gap-l-10"><Input placeholder="请求网址" value={this.task.url} onChange={e => this.task.url = e}></Input></div>
            </div>
            <div className="flex">
                <div className="flex-fixed flex w-160 gap-r-10">
                    <label className="remark gap-r-5">响应:</label>
                    <div>
                        <SelectBox value={this.task.handle} onChange={e => this.task.handle = e as any} options={[
                            { value: 'sync', text: '同步' },
                            { value: 'stream', text: '响应流' },
                            { value: 'async', text: '异步' }]}>
                        </SelectBox>
                    </div>
                </div>
                <div className="flex-fixed flex w-160">
                    <label className="remark gap-r-5">处理:</label>
                    <div>
                        <SelectBox value={this.task.flag} onChange={e => this.task.flag = e as any} options={[
                            { value: 'write', text: '写入' },
                            { value: 'append', text: '追加' },
                        ]}></SelectBox>
                    </div>
                </div>
            </div>
            <div><Textarea placeholder="输入指令描述" value={this.task.description} onChange={e => this.task.description = e}></Textarea></div>
            <div>
                <div className="h4 gap-h-10 gap-t-30">请求</div>
                <div className="flex h-30 r-padding-w-10 r-flex-center r-cursor">
                    <span onClick={e => this.requestTab = 'args'} className={this.requestTab == 'args' ? " border-b-p" : ""}>参数</span>
                    <span onClick={e => this.requestTab = 'head'} className={this.requestTab == 'head' ? "border-b-p" : ""}>请求头</span>
                </div>
                {this.requestTab == 'args' && <div>
                    <div className="flex bg-light h-30 round r-gap-r-10">
                        <div className="flex-fixed w-150 gap-l-10 flex-center">参数名</div>
                        <div className="flex-fixed w-80 flex-center">类型</div>
                        <div className="flex-fixed w-150 flex-center">名称</div>
                        <div className="flex-fixed w-80 flex-center"><span onClick={e => this.task.args.push({ id: util.guid(), name: '', text: '', type: 'string' })} className="flex-center size-20 round cursor item-hover"><Icon icon={PlusSvg}></Icon></span></div>
                    </div>
                    {this.task.args.map(arg => {
                        return <div key={arg.id} className='flex item-hover round visible-hover h-min-40 gap-h-10 r-gap-r-10'>
                            <div className="flex-fixed w-150 gap-l-10"><Input size="small" placeholder="输入参数英文" value={arg.name} onChange={e => arg.name = e}></Input></div>
                            <div className="flex-fixed w-80"><SelectBox value={arg.type} onChange={e => arg.type = e as any} options={[{ text: 'string', value: 'string' }]}></SelectBox></div>
                            <div className="flex-fixed w-150"><Input size="small" placeholder="输入中文名称" value={arg.text} onChange={e => arg.text = e}></Input></div>
                            <div className="flex-fixed w-80 flex-center">
                                <span onClick={e => lodash.remove(this.task.args, c => c == arg)} className="visible cursor size-24 flex-center item-hover round">
                                    <Icon size={16} icon={TrashSvg}></Icon>
                                </span>
                            </div>
                        </div>
                    })}
                </div>}
                {this.requestTab == 'head' && <div>
                    <div className="flex bg-light h-30 round r-gap-r-10">
                        <div className="flex-fixed w-150 gap-l-10 flex-center">键</div>
                        <div className="flex-fixed w-150 flex-center">值</div>
                        <div className="flex-fixed w-80 flex-center"><span onClick={e => this.task.headers.push({ id: util.guid(), name: "", value: '' })} className="flex-center size-20 round cursor item-hover"><Icon icon={PlusSvg}></Icon></span></div>
                    </div>
                    {this.task.headers.map(head => {
                        return <div key={head.id} className='flex  item-hover round  visible-hover h-min-40 gap-h-10  r-gap-r-10'>
                            <div className="flex-fixed w-150 gap-l-10"><Input size="small" value={head.name} onChange={e => head.name = e}></Input></div>
                            <div className="flex-fixed w-150"><Input size="small" value={head.value} onChange={e => head.value = e}></Input></div>
                            <div className="flex-fixed w-80  flex-center">
                                <span onClick={e => lodash.remove(this.task.headers, c => c == head)} className="cursor visible size-24  flex-center item-hover round">
                                    <Icon size={16} icon={TrashSvg}></Icon>
                                </span>
                            </div>
                        </div>
                    })}
                </div>}
            </div>
            <div>
                <div className="h4 gap-h-10 gap-t-30">响应</div>
                <div>
                    <div className="flex bg-light h-30 round r-gap-r-10 visible-hover">
                        <div className="flex-fixed w-80 gap-l-10 flex-center">类型</div>
                        <div className="flex-fixed w-80 flex-center">编号</div>
                        <div className="flex-fixed w-150 flex-center">模板</div>
                        <div className="flex-fixed w-80 flex-center">
                            <span className="flex-center size-20 round visible cursor item-hover disabled"><Icon size={16} icon={PlusSvg}></Icon></span>
                        </div>
                    </div>
                    {this.task.replys.map(reply => {
                        return <div key={reply.id} className='flex h-min-40  gap-h-10  r-gap-r-10'>
                            <div className="flex-fixed w-80 gap-l-10"><SelectBox value={reply.mime} onChange={e => reply.mime = e as any} options={[
                                { text: 'markdown', value: 'markdown' },
                                { text: 'json', value: 'json' },
                                { text: 'error', value: 'error' },
                                { text: 'image', value: 'image' },
                            ]}></SelectBox></div>
                            <div className="flex-fixed w-80"><Input size="small" value={reply.code} onChange={e => reply.code = e}></Input></div>
                            <div className="flex-fixed w-150"><Input size="small" value={reply.template} onChange={e => reply.template = e}></Input></div>
                            <div className="flex-fixed w-80 flex-center">
                                <span
                                    // onClick={e => lodash.remove(this.task.replys, c => c == reply)}
                                    className="cursor  size-20 flex-center item-hover round disabled">
                                    <Icon size={16} icon={TrashSvg}></Icon>
                                </span>
                            </div>
                        </div>
                    })}
                </div>
            </div>
            <div >
                <div className="h4 gap-h-10 gap-t-30">显示</div>
                <div><Textarea placeholder="显示模板" value={this.task.template} onChange={e => this.task.template = e}></Textarea></div>
            </div>
        </div>
    }
    open(task: RobotTask) {
        console.log('open', task);
        if (!task) this.task = {
            nextActions: [],
            name: '',
            method: 'GET',
            url: '',
            handle: 'sync',
            flag: 'write',
            description: '',
            args: [],
            headers: [],
            replys: [{ id: util.guid(), mime: 'markdown', content: '', template: '' }],
            template: ''
        }
        else this.task = task;
        if (this.task.replys.length == 0) {
            this.task.replys = [{ id: util.guid(), mime: 'markdown', content: '', template: '' }]
        }
        if (!this.task.handle) this.task.handle = 'sync';

        if (!this.task.flag) this.task.flag = 'write';
        console.log('currentTask', this.task)
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