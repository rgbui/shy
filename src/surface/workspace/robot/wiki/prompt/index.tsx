import { observer } from "mobx-react";
import React from "react";
import { DebugSvg, DotsSvg, Edit1Svg, EditSvg, NoneSvg, PlusAreaSvg, PlusSvg, TrashSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { GetRobotApplyOptions, RobotApply, RobotInfo } from "rich/types/user";
import { useRobotInfoPromputForm } from "./dialoug";
import { util } from "rich/util/util";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Point, Rect } from "rich/src/common/vector/point";
import { MenuItemType } from "rich/component/view/menu/declare";
import lodash from "lodash";
import { masterSock } from "../../../../../../net/sock";
import { useIconPicker } from "rich/extensions/icon";
import { useRobotDebug } from "../debug";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { usePropTemplates } from "./template";

@observer
export class RobotInfoPromptView extends React.Component<{ robot: RobotInfo }>{
    constructor(props) {
        super(props);
    }
    async addPrompt(event: React.MouseEvent) {
        var rg = await useSelectMenuItem({ roundPoint: Point.from(event) }, [
            { name: 'custom', text: lst('添加prompt'), icon: PlusSvg },
            { name: 'template', text: lst('选择模板promp'), icon: PlusAreaSvg }
        ])
        if (rg?.item.name == 'custom') {
            var g = await useRobotInfoPromputForm();
            if (g) {
                g.id = util.guid()
                g.createDate = new Date()
                if (Array.isArray(this.props.robot.prompts)) this.props.robot.prompts.push(g);
                else {
                    this.props.robot.prompts = [g];
                }
                await masterSock.patch('/robotInfo/set', { id: this.props.robot.id, data: { prompts: this.props.robot.prompts } })
            }
        }
        else {
            var rc = await usePropTemplates();
            if (rc) {
                var gc: ArrayOf<RobotInfo['prompts']> = {} as any;
                gc.id = util.guid()
                gc.createDate = new Date()
                gc.text = rc.text;
                gc.apply = rc.apply;
                gc.prompt = rc.prompt;
                if (Array.isArray(this.props.robot.prompts)) this.props.robot.prompts.push(gc);
                else {
                    this.props.robot.prompts = [gc];
                }
                await masterSock.patch('/robotInfo/set', { id: this.props.robot.id, data: { prompts: this.props.robot.prompts } })
            }
        }
    }
    async onProperty(event: React.MouseEvent, pro: RobotInfo['prompts'][0]) {
        var r = await useSelectMenuItem({ roundPoint: Point.from(event) },
            [
                { text: lst('编辑'), icon: EditSvg, name: 'edit' },
                { text: lst('调试'), icon: DebugSvg, name: 'debug' },
                { text: lst("禁用"), icon: { name: "bytedance-icon", code: 'invalid-files' }, checkLabel: pro.abled ? false : true, name: 'abled' },
                { type: MenuItemType.divide },
                { text: lst('删除'), icon: TrashSvg, name: 'delete' }
            ]
        );
        if (r) {
            if (r.item.name == 'debug') {
                var g = await useRobotDebug(this.props.robot, pro);
                if (r) {

                }
            }
            else if (r.item.name == 'abled') {
                pro.abled = !pro.abled;
                await masterSock.patch('/robotInfo/set', { id: this.props.robot.id, data: { prompts: this.props.robot.prompts } })
            }
            else if (r.item.name == 'edit') {
                var g = await useRobotInfoPromputForm(pro);
                if (g) {
                    Object.assign(pro, g);
                    await masterSock.patch('/robotInfo/set', { id: this.props.robot.id, data: { prompts: this.props.robot.prompts } })
                }
            }
            else if (r.item.name == 'delete') {
                lodash.remove(this.props.robot.prompts, g => g.id == pro.id)
                await masterSock.patch('/robotInfo/set', { id: this.props.robot.id, data: { prompts: this.props.robot.prompts } })
            }
        }
    }
    async changeIcon(event: React.MouseEvent, pro: RobotInfo['prompts'][0]) {
        var r = await useIconPicker({ roundArea: Rect.fromEle(event.currentTarget as HTMLElement) });
        if (r) {
            pro.icon = r;
            await masterSock.patch('/robotInfo/set', { id: this.props.robot.id, data: { prompts: this.props.robot.prompts } })
        }
    }
    render() {
        var robot = this.props.robot;
        return <div>
            <div className="h4 flex"><span className="flex-auto"><S>Prompt模板</S></span><span onClick={e => {
                e.stopPropagation();
                this.addPrompt(e);
            }} className=" flex-fixed size-24 item-hover round cursor flex-center"><Icon icon={PlusSvg}></Icon></span></div>
            <div className="flex flex-wrap r-gap-r-10 r-gap-b-10">
                {(robot.prompts || []).map(pro => {
                    var ra = GetRobotApplyOptions().find(g => g.value == pro.apply);
                    if (ra?.value == RobotApply.none) ra = null;
                    return <div className={"border flex-fixed w-250 h-180 round padding-10 " + (pro.abled == false ? " op-4" : "")} key={pro.id}>
                        <div className="flex h-30">
                            <span className="flex-fixed size-24 round item-hover cursor flex-center gap-r-5" onClick={e => this.changeIcon(e, pro)}><Icon size={16} icon={pro.icon || Edit1Svg}></Icon></span>
                            <span className="flex-auto bold flex text-overflow"><span>{pro.text}</span>{ra && <em className="gap-l-10 remark padding-w-3 padding-h-1  round cursor f-12">{ra.text}</em>}</span>
                            <span onClick={e => this.onProperty(e, pro)} className="flex-fixed flex-center size-24 item-hover round cursor">
                                <Icon size={20} icon={DotsSvg}></Icon>
                            </span>
                        </div>
                        <div className="text-1 h-150 overflow-y pre gap-t-10" dangerouslySetInnerHTML={{ __html: pro.prompt }}>
                        </div>
                    </div>
                })}
            </div>
        </div>
    }
}
