import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { ShyAlert } from "rich/component/lib/alert";
import { EditSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { Icon } from "rich/component/view/icon";
import { Textarea } from "rich/component/view/input/textarea";
import { Markdown } from "rich/component/view/markdown";
import { RobotInfo } from "rich/types/user";
import { masterSock } from "../../../../net/sock";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";

@observer
export class RobotInfoDescriptionView extends React.Component<{ robot: RobotInfo }>{
    constructor(props) {
        super(props);
        if (!this.props.robot.remark) this.isEdit = true;
        this.remark = this.props.robot.remark;
        makeObservable(this, {
            isEdit: observable,
            remark: observable
        });
    }
    isEdit: boolean = false;
    remark: string = '';
    onSave = async (b: Button) => {
        if (!this.remark) return ShyAlert(lst('请介绍一下机器人,如何使用它'))
        try {
            b.loading = true;
            await masterSock.patch('/robot/set', {
                id: this.props.robot.id,
                data: {
                    remark: this.remark
                }
            })
            b.loading = false;
            this.props.robot.remark = this.remark;
            this.isEdit = false;
        }
        catch (ex) {
            console.error(ex)
            b.loading = false;
        }
        finally {

        }
    }
    render() {
        var robot = this.props.robot;
        return <div>
            {this.isEdit && <div>
                <div className="flex gap-h-10">
                    <div className="flex-auto remark"><S>介绍一下机器人</S></div>
                    <div className="flex-fixed flex  r-gap-l-10">
                        <Button onClick={(e, b) => this.onSave(b)} ><S>保存</S></Button>
                        <Button onClick={e => this.isEdit = false} ghost><S>退出编辑</S></Button>
                    </div>
                </div>
                <Textarea
                    style={{ height: 500 }}
                    placeholder={lst("介绍一下机器人,如何使用它，支持markdown语法")}
                    value={robot.remark}
                    onChange={e => this.remark = e}
                ></Textarea>
            </div>}
            {!this.isEdit && <div className="visible-hover">
                <div className="visible flex h-30">
                    <span className="flex-auto"></span>
                    <span className="flex-fixed link underline cursor flex r-gap-l-5 f-12"
                        onMouseDown={e => this.isEdit = true}
                    >
                        <Icon size={14} icon={EditSvg}></Icon>
                        <span><S>编辑</S></span>
                    </span>
                </div>
                <Markdown md={this.remark}></Markdown>
            </div>}
        </div>
    }
}