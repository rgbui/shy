import lodash from "lodash";
import { makeAutoObservable, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { ReactNode } from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Edit1Svg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { Divider } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
import { Input } from "rich/component/view/input";
import { Textarea } from "rich/component/view/input/textarea";
import { SelectBox } from "rich/component/view/select/box";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { RobotApply, RobotApplyOptions, RobotInfo } from "rich/types/user";

@observer
export class RobotInfoPromptForm extends EventsComponent {
    constructor(props) {
        super(props)
        makeObservable(this, {
            prompt: observable
        })
    }
    async open(prompt: ArrayOf<RobotInfo['prompts']>) {
        this.prompt = lodash.cloneDeep(prompt) || { apply: RobotApply.channel, text: '', prompt: '' };
    }
    onSave() {
        this.emit('save');
    }
    onClose() {
        this.emit('close');
    }
    prompt: ArrayOf<RobotInfo['prompts']> = { icon: null, text: '', prompt: '' };
    render(): ReactNode {
        return <div className="w-450 padding-14 round ">
            <div className="h-20"><span>Prompt模板</span></div>
            <div className="flex gap-h-10">
                <span className="flex-fixed size-30 flex-center round item-hover cursor"><Icon icon={this.prompt.icon || Edit1Svg}></Icon></span>
                <span className="flex-auto"><Input value={this.prompt.text} onChange={e => this.prompt.text = e}></Input></span>
            </div>
            <div className="h-20"><span>应用:</span></div>
            <div className="h-30 gap-h-10">
                <SelectBox border onChange={e => this.prompt.apply = e} value={this.prompt.apply || RobotApply.none} options={RobotApplyOptions}></SelectBox>
            </div>
            <div className="h-20"><span>模板:</span></div>
            <div className="flex gap-h-10">
                <Textarea style={{ height: 80 }} value={this.prompt.prompt} onChange={e => this.prompt.prompt = e}></Textarea>
            </div>
            <div>
                {this.prompt.apply == RobotApply.channel && <div className="remark f-14 gap-b-10">模板参数{'{prompt}:提示，{context}:上下文'}</div>}
                {this.prompt.apply == RobotApply.search && <div className="remark f-14 gap-b-10">模板参数{'{prompt}:提示，{context}:上下文'}</div>}
                {this.prompt.apply == RobotApply.aDraft && <div className="remark f-14 gap-b-10">模板参数{'{title}:标题，{context}:上下文'}</div>}
                {this.prompt.apply == RobotApply.pageContinue && <div className="remark f-14 gap-b-10">模板参数{'{content}:前文，{context}:上下文'}</div>}
                {this.prompt.apply == RobotApply.pageSumit && <div className="remark f-14 gap-b-10">模板参数{'{content}:上文，{context}:上下文'}</div>}
                {this.prompt.apply == RobotApply.askWrite && <div className="remark f-14 gap-b-10">模板参数{'{prompt}:提示，{context}:上下文'}</div>}
                {this.prompt.apply == RobotApply.selectionAskWrite && <div className="remark f-14 gap-b-10">模板参数{'{selection}:选中内容，{context}:上下文'}</div>}
            </div>
            <Divider></Divider>
            <div className="flex-end ">
                <Button ghost className="gap-r-10" onClick={e => this.onClose()}>取消</Button>
                <Button onClick={e => this.onSave()}>保存</Button>
            </div>
        </div>
    }
}

export async function useRobotInfoPromputForm(prompt?: ArrayOf<RobotInfo['prompts']>) {
    var popover = await PopoverSingleton(RobotInfoPromptForm);
    var uf = await popover.open({ center: true, centerTop: 100 });
    uf.open(prompt);
    return new Promise((resolve: (d: ArrayOf<RobotInfo['prompts']>) => void, reject) => {
        uf.on('close', () => {
            popover.close()
            resolve(null);
        })
        uf.on('save', () => {
            popover.close()
            resolve(lodash.cloneDeep(uf.prompt));
        })
        popover.on('close', () => {
            resolve(null);
        })
    })
}
