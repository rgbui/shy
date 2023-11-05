import { observer } from "mobx-react";
import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { RobotApply, RobotInfo } from "rich/types/user";
import { ShyPromptTemplates } from "./temps";
import { AiStartSvg, DuplicateSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { getTypeColor } from "../../../../../../org/util";
import { CopyAlert } from "rich/component/copy";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { Button } from "rich/component/view/button";
import { Tip } from "rich/component/view/tooltip/tip";
import { PopoverSingleton } from "rich/component/popover/popover";

@observer
export class PropTemplates extends EventsComponent {
    constructor(props) {
        super(props)
    }
    async open() {

    }
    onSave() {
        this.emit('save');
    }
    onClose() {
        this.emit('close');
    }
    prompt: { text: string, template: string } = null;
    getPrompt() {
        if (this.prompt) {
            return {
                text: this.prompt.text,
                prompt: this.prompt.template,
                apply: RobotApply[this.prompt_apply] || undefined
            }
        }
    }
    render() {
        return <div style={{ width: 212 * 3 + 14 * 2 }} className="padding-14 round ">
            <div className="flex gap-h-10 r-gap-r-10">
                <span className="f-12 remark"><S>应用</S></span>
                <span className={'round padding-w-5 padding-h-3 cursor' + (this.prompt_apply == 'channel' ? " item-hover-focus" : " item-hover")} onMouseDown={e => { this.prompt_apply = 'channel'; this.forceUpdate() }}><S>频道</S></span>
                <span className={'round padding-w-5 padding-h-3 cursor' + (this.prompt_apply == 'askWrite' ? " item-hover-focus" : " item-hover")} onMouseDown={e => { this.prompt_apply = 'askWrite'; this.forceUpdate() }}><S>内容生成</S></span>
                <span className={'round padding-w-5 padding-h-3 cursor' + (this.prompt_apply == 'selectionAskWrite' ? " item-hover-focus" : " item-hover")} onMouseDown={e => { this.prompt_apply = 'selectionAskWrite'; this.forceUpdate() }}><S>内容润色</S></span>
            </div>
            <div className="flex gap-h-10   r-gap-r-10">
                <span className="f-12 remark"><S>分类</S></span>
                <span className={'round padding-w-5 padding-h-3 cursor ' + (this.tag == '' ? "item-hover-focus" : "item-hover")} onMouseDown={e => { this.tag = ''; this.forceUpdate() }}><S>所有</S></span>
                <span className={'round padding-w-5 padding-h-3 cursor ' + (this.tag == '创意写作' ? "item-hover-focus" : "item-hover")} onMouseDown={e => { this.tag = '创意写作'; this.forceUpdate() }}>创意写作</span>
                <span className={'round padding-w-5 padding-h-3 cursor ' + (this.tag == '编程辅助' ? "item-hover-focus" : "item-hover")} onMouseDown={e => { this.tag = '编程辅助'; this.forceUpdate() }}>编程辅助</span>
                <span className={'round padding-w-5 padding-h-3 cursor ' + (this.tag == '灵感策划' ? "item-hover-focus" : "item-hover")} onMouseDown={e => { this.tag = '灵感策划'; this.forceUpdate() }}>灵感策划</span>
                <span className={'round padding-w-5 padding-h-3 cursor ' + (this.tag == '功能写作' ? "item-hover-focus" : "item-hover")} onMouseDown={e => { this.tag = '功能写作'; this.forceUpdate() }}>功能写作</span>
            </div>
            <div className="max-h-400 overflow-y padding-b-100">
                <div className="flex flex-wrap">
                    {this.getTemplates().map(g => {
                        return <div onMouseDown={e => {
                            this.prompt = g;
                            this.forceUpdate()
                        }
                        } className="border w-180 padding-10 round h-250 flex flex-col  flex-full gap-r-10 gap-b-10" key={g.text} >
                            <div className="flex-fixed h-30 flex">
                                <span className="flex-fixed gap-r-3"><Icon style={getTypeColor('ai')} size={20} icon={AiStartSvg}></Icon></span>
                                <span className="flex-auto bold ">{g.text}</span>
                                <Tip text='复制'><span className="flex-fixed cursor item-hover size-20 round" onMouseDown={e => {
                                    e.stopPropagation();
                                    CopyAlert(g.template, lst('复制成功'))
                                }}>
                                    <Icon size={16} icon={DuplicateSvg}></Icon>
                                </span></Tip >
                            </div>
                            <div className="flex-auto  w-180 overflow-y"><div className="w100 h100">{g.template}</div></div>
                            <div className="flex-fixed flex-center">
                                <Button onClick={e => {
                                    this.prompt = g;
                                    this.emit('save')
                                }}><S>使用</S></Button>
                            </div>
                        </div>
                    })}
                </div>
            </div>

        </div >
    }
    prompt_apply: string = '';
    tag: string = '';
    getTemplates() {
        return ShyPromptTemplates.findAll(g => {
            if (this.prompt_apply) {
                if (!g.applys.includes(this.prompt_apply)) return false;
            }
            if (this.tag) {
                if (!g.tags.includes(this.tag)) return false;
            }
            return true;
        })
    }
}

export async function usePropTemplates() {
    var popover = await PopoverSingleton(PropTemplates);
    var uf = await popover.open({ center: true, centerTop: 100 });
    return new Promise((resolve: (d: ArrayOf<RobotInfo['prompts']>) => void, reject) => {
        uf.on('close', () => {
            popover.close()
            resolve(null);
        })
        uf.on('save', () => {
            popover.close()
            resolve(uf.getPrompt());
        })
        popover.on('close', () => {
            resolve(null);
        })
    })
}