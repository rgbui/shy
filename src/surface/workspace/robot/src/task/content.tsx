import { EventsComponent } from "rich/component/lib/events.component";
import { makeObservable, observable } from "mobx";
import React from "react";
import { Input } from "rich/component/view/input";
import { Textarea } from "rich/component/view/input/textarea";
import { SelectBox } from "rich/component/view/select/box";
import { observer } from "mobx-react";
import { util } from "rich/util/util";
import { PlusSvg, TrashSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import lodash from "lodash";
import { RobotTask } from "rich/types/user";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { PopoverSingleton } from "rich/component/popover/popover";

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
        if (!this.task) return <div className="w-800 h-400"></div>
        return <div className="w-800 h-400 overflow-y padding-14 round r-gap-h-10">
            <div><Input placeholder={lst("指令名称")} value={this.task.name} onChange={e => this.task.name = e}></Input></div>
            <div className="flex">
                <div className="flex-fixed  gap-r-10"><SelectBox
                    value={this.task.method}
                    onChange={e => this.task.method = e as string}
                    options={[
                        { value: 'GET', text: 'GET' },
                        { value: 'POST', text: 'POST' },
                        { value: 'PUT', text: 'PUT' },
                        { value: 'PATCH', text: 'PAT' },
                        { value: 'DELETE', text: 'DEL' },
                    ]}></SelectBox></div>
                <div className="flex-auto gap-l-10"><Input placeholder={lst("请求网址")} value={this.task.url} onChange={e => this.task.url = e}></Input></div>
            </div>
            <div className="flex">
                <div className="flex-fixed flex w-160 gap-r-10">
                    <label className="remark gap-r-5"><S>响应</S>:</label>
                    <div>
                        <SelectBox value={this.task.handle} onChange={e => this.task.handle = e as any} options={[
                            { value: 'sync', text: lst('同步') },
                            { value: 'stream', text: lst('响应流') },
                            { value: 'async', text: lst('异步') }]}>
                        </SelectBox>
                    </div>
                </div>
                <div className="flex-fixed flex w-160">
                    <label className="remark gap-r-5"><S>处理</S>:</label>
                    <div>
                        <SelectBox value={this.task.flag} onChange={e => this.task.flag = e as any} options={[
                            { value: 'write', text: lst('写入') },
                            { value: 'append', text: lst('追加') },
                        ]}></SelectBox>
                    </div>
                </div>
            </div>
            <div><Textarea placeholder={lst("输入指令描述")} value={this.task.description} onChange={e => this.task.description = e}></Textarea></div>
            <div>
                <div className="h4 gap-h-10 gap-t-30"><S>请求</S></div>
                <div className="flex h-30 r-padding-w-10 r-flex-center r-cursor">
                    <span onClick={e => this.requestTab = 'args'} className={this.requestTab == 'args' ? " border-b-p" : ""}><S>参数</S></span>
                    <span onClick={e => this.requestTab = 'head'} className={this.requestTab == 'head' ? "border-b-p" : ""}><S>请求头</S></span>
                </div>
                {this.requestTab == 'args' && <div>
                    <div className="flex bg-light  padding-h-3 round r-gap-r-10">
                        <div className="flex-fixed w-150 gap-l-10 flex-center"><S>参数名</S></div>
                        <div className="flex-fixed w-80 flex-center"><S>类型</S></div>
                        <div className="flex-fixed w-150 flex-center"><S>名称</S></div>
                        <div className="flex-fixed w-150 flex-center"><S>说明</S></div>
                        <div className="flex-fixed w-80 flex-center"><span onClick={e => this.task.args.push({ id: util.guid(), name: '', text: '', type: 'string' })} className="flex-center size-20 round cursor item-hover"><Icon icon={PlusSvg}></Icon></span></div>
                    </div>
                    {this.task.args.map(arg => {
                        return <div key={arg.id} className='flex item-hover round visible-hover padding-h-3 gap-h-10 r-gap-r-10'>
                            <div className="flex-fixed w-150 gap-l-10"><Input size="small" placeholder={lst("输入参数英文")} value={arg.name} onChange={e => arg.name = e}></Input></div>
                            <div className="flex-fixed w-80"><SelectBox value={arg.type} onChange={e => arg.type = e as any} options={[{ text: 'string', value: 'string' }]}></SelectBox></div>
                            <div className="flex-fixed w-150"><Input size="small" placeholder={lst("输入中文名称")} value={arg.text} onChange={e => arg.text = e}></Input></div>
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
                        <div className="flex-fixed w-150 gap-l-10 flex-center"><S>键</S></div>
                        <div className="flex-fixed w-150 flex-center"><S>值</S></div>
                        <div className="flex-fixed w-80 flex-center"><span onClick={e => this.task.headers.push({ id: util.guid(), name: "", value: '' })} className="flex-center size-20 round cursor item-hover"><Icon icon={PlusSvg}></Icon></span></div>
                    </div>
                    {this.task.headers.map(head => {
                        return <div key={head.id} className='flex  item-hover round  visible-hover padding-h-3 gap-h-10  r-gap-r-10'>
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
        </div>
    }
    open(task: RobotTask) {
        if (!task) this.task = {
            id: util.guid(),
            name: '',
            method: 'GET',
            url: '',
            handle: 'sync',
            flag: 'write',
            description: '',
            args: [],
            headers: []
        }
        else this.task = task;
        if (!this.task.handle) this.task.handle = 'sync';

        if (!this.task.flag) this.task.flag = 'write';

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