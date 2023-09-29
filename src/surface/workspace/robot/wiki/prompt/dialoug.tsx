import lodash from "lodash";
import { makeObservable, observable } from "mobx";
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
import { MeasureView } from "rich/component/view/progress";
import { SelectBox } from "rich/component/view/select/box";
import { HelpText, HelpTip } from "rich/component/view/text";
import { useIconPicker } from "rich/extensions/icon";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { Rect } from "rich/src/common/vector/point";
import { GetRobotApplyOptions, RobotApply, RobotInfo } from "rich/types/user";

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
    async changeIcon(event: React.MouseEvent) {
        var r = await useIconPicker({ roundArea: Rect.fromEle(event.currentTarget as HTMLElement) });
        if (r) {
            this.prompt.icon = r;
        }
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
            <div className="h-20"><span><S>Prompt模板</S></span></div>
            <div className="flex gap-h-10">
                <span className="flex-fixed size-30 gap-r-5 flex-center round item-hover cursor" onClick={e => this.changeIcon(e)}><Icon icon={this.prompt.icon || Edit1Svg}></Icon></span>
                <span className="flex-auto"><Input placeholder="prompt名称" value={this.prompt.text} onChange={e => this.prompt.text = e}></Input></span>
            </div>
            <div className="h-20"><span><S>应用</S>:</span></div>
            <div className="h-30 gap-h-10">
                <SelectBox border onChange={e => this.prompt.apply = e} value={this.prompt.apply || RobotApply.none} options={GetRobotApplyOptions()}></SelectBox>
            </div>
            <div className="h-20"><span><S>热度</S>:</span><HelpTip overlay={lst('热度-tip', '较高的数值会使输出更加随机，而较低的数值会使其更加集中和确定')}></HelpTip></div>
            <div className="h-30">
                <MeasureView onChange={e => { this.prompt.temperature = e }} min={0} max={1} ratio={0.1} value={(typeof this.prompt.temperature == 'number' ? this.prompt.temperature : 0.9) * 1}></MeasureView>
            </div>
            <div className="h-20"><span><S>模板</S>:</span></div>
            <div className="flex gap-h-10">
                <Textarea style={{ height: 80 }} value={this.prompt.prompt} onChange={e => this.prompt.prompt = e}></Textarea>
            </div>
            <div>
                {this.prompt.apply == RobotApply.channel && <div className="remark f-14 gap-b-10"><S>模板参数</S>&nbsp;{lst('prompt提示context上下文', '{prompt}:提示，{context}:上下文')}</div>}
                {/* {this.prompt.apply == RobotApply.search && <div className="remark f-14 gap-b-10"><S>模板参数</S>{lst('{prompt}:提示，{context}:上下文')}</div>}
                {this.prompt.apply == RobotApply.aDraft && <div className="remark f-14 gap-b-10"><S>模板参数</S>{lst('{title}:标题，{context}:上下文')}</div>}
                {this.prompt.apply == RobotApply.pageContinue && <div className="remark f-14 gap-b-10"><S>模板参数</S>{lst('{content}:前文，{context}:上下文')}</div>}
                {this.prompt.apply == RobotApply.pageSumit && <div className="remark f-14 gap-b-10"><S>模板参数</S>{lst('{content}:上文，{context}:上下文')}</div>} */}
                {this.prompt.apply == RobotApply.askWrite && <div className="remark f-14 gap-b-10"><S>模板参数</S>&nbsp;{lst('prompt提示context上下文', '{prompt}:提示，{context}:上下文')}</div>}
                {this.prompt.apply == RobotApply.selectionAskWrite && <div className="remark f-14 gap-b-10"><S>模板参数</S>&nbsp;{lst('selection待处理内容prompt提示context上下文', '{selection}:待处理内容，{prompt}:提示，{context}:上下文')}</div>}
            </div>
            <Divider></Divider>
            <div className="flex-end ">
                <Button ghost className="gap-r-10" onClick={e => this.onClose()}><S>取消</S></Button>
                <Button onClick={e => this.onSave()}><S>保存</S></Button>
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
