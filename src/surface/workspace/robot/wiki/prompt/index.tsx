import { observer } from "mobx-react";
import React from "react";
import { ButtonSvg, CheckSvg, DebugSvg, DotsSvg, Edit1Svg, EditSvg, NoneSvg, PlusSvg, TrashSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { RobotApply, RobotApplyOptions, RobotInfo } from "rich/types/user";
import { useRobotInfoPromputForm } from "./dialoug";
import { util } from "rich/util/util";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Point, Rect } from "rich/src/common/vector/point";
import { MenuItemType } from "rich/component/view/menu/declare";
import lodash from "lodash";
import { masterSock } from "../../../../../../net/sock";
import { useIconPicker } from "rich/extensions/icon";
import { useRobotDebug } from "../debug";

@observer
export class RobotInfoPromptView extends React.Component<{ robot: RobotInfo }>{
    constructor(props) {
        super(props);
    }
    async addPrompt() {
        var g = await useRobotInfoPromputForm();
        if (g) {
            g.id = util.guid()
            g.createDate = new Date()
            if (Array.isArray(this.props.robot.prompts)) this.props.robot.prompts.push(g);
            else {
                this.props.robot.prompts = [g];
            }
            await masterSock.patch('/robot/set', { id: this.props.robot.id, data: { prompts: this.props.robot.prompts } })
        }
    }
    async onProperty(event: React.MouseEvent, pro: RobotInfo['prompts'][0]) {
        var r = await useSelectMenuItem({ roundPoint: Point.from(event) },
            [
                { text: '编辑', icon: EditSvg, name: 'edit' },
                { text: '调试', icon: DebugSvg, name: 'debug' },
                { text: pro.abled == false ? "启用" : "禁用", icon: pro.abled == false ? NoneSvg : CheckSvg, name: 'abled' },
                { type: MenuItemType.divide },
                { text: '删除', icon: TrashSvg, name: 'delete' }
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
                await masterSock.patch('/robot/set', { id: this.props.robot.id, data: { prompts: this.props.robot.prompts } })
            }
            else if (r.item.name == 'edit') {
                var g = await useRobotInfoPromputForm(pro);
                if (g) {
                    Object.assign(pro, g);
                    await masterSock.patch('/robot/set', { id: this.props.robot.id, data: { prompts: this.props.robot.prompts } })
                }
            }
            else if (r.item.name == 'delete') {
                lodash.remove(this.props.robot.prompts, g => g.id == pro.id)
                await masterSock.patch('/robot/set', { id: this.props.robot.id, data: { prompts: this.props.robot.prompts } })
            }
        }
    }
    async changeIcon(event: React.MouseEvent, pro: RobotInfo['prompts'][0]) {
        var r = await useIconPicker({ roundArea: Rect.fromEle(event.currentTarget as HTMLElement) });
        if (r) {
            pro.icon = r;
            await masterSock.patch('/robot/set', { id: this.props.robot.id, data: { prompts: this.props.robot.prompts } })
        }
    }
    render() {
        var robot = this.props.robot;
        return <div>
            <div className="h4 flex"><span className="flex-auto">Prompt模板</span><span onClick={e => this.addPrompt()} className=" flex-fixed size-24 item-hover round cursor flex-center"><Icon icon={PlusSvg}></Icon></span></div>
            <div className="flex flex-wrap r-gap-r-10 r-gap-b-10">
                {(robot.prompts || []).map(pro => {
                    var ra = RobotApplyOptions.find(g => g.value == pro.apply);
                    if (ra?.value == RobotApply.none) ra = null;
                    return <div className={"border flex-fixed w-250 h-180 round padding-10 " + (pro.abled == false ? " op-4" : "")} key={pro.id}>
                        <div className="flex h-30">
                            <span className="flex-fixed size-24 round item-hover cursor flex-center" onClick={e => this.changeIcon(e, pro)}><Icon size={16} icon={pro.icon || Edit1Svg}></Icon></span>
                            <span className="flex-auto bold flex"><span>{pro.text}</span>{ra && <em className="gap-l-10 bg-primary padding-w-3 padding-h-1 text-white round cursor">{ra.text}</em>}</span>
                            <span onClick={e => this.onProperty(e, pro)} className="flex-fixed flex-center size-24 item-hover round cursor">
                                <Icon size={20} icon={DotsSvg}></Icon>
                            </span>
                        </div>
                        <div className="text-1 h-150 overflow-y pre" dangerouslySetInnerHTML={{ __html: pro.prompt }}>
                        </div>
                    </div>
                })}
            </div>
        </div>
    }
}
