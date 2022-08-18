import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Col, Divider, Row } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { Switch } from "rich/component/view/switch";
import { Remark } from "rich/component/view/text";
import { channel } from "rich/net/channel";
import { surface } from "../../..";
import { SaveTip } from "../../../../component/tip/save.tip";

@observer
export class WorkspaceManage extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            data: observable,
            error: observable
        })
    }
    data: { access: number, accessJoinTip: boolean } = { access: 1, accessJoinTip: false };
    error: Record<string, any> = {};
    tip: SaveTip;
    componentDidMount() {
        // this.data = {
        //     access: surface.workspace.access,
        //     accessJoinTip: surface.workspace.accessJoinTip
        // };
        this.forceUpdate();
    }
    change(data: Partial<WorkspaceManage['data']>) {
        // if (data.access == 1) data.accessJoinTip = true;
        // if (data.access == 0) data.accessJoinTip = false;
        // Object.assign(this.data, data);
        // if (this.tip) {
        //     if (lodash.isEqual(this.data, lodash.pick(surface.workspace, ['public', 'allowJoin'])))
        //         this.tip.close()
        //     else
        //         this.tip.open();
        // }
    }
    async save() {
        // var r = await channel.patch('/ws/patch', { data: this.data });
        // if (r.ok) {
        //     surface.workspace.access = this.data.access;
        //     surface.workspace.accessJoinTip = this.data.accessJoinTip;
        //     this.tip.close();
        // }
    }
    reset() {
        runInAction(() => {
            // this.data = {
            //     access: surface.workspace.access,
            //     accessJoinTip: surface.workspace.accessJoinTip
            // };
            this.error = {};
            this.tip.close();
        })
    }
    render() {
        return <div className='shy-ws-manage'>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            <div className="h2">空间管理</div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14">新页面默认选项</div>
                <div className="remark f-12 gap-h-10">在创建新页面时，默认开启以下配置</div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1">自适应宽度</div>
                    <div className="flex-fixed"><Switch onChange={e => { }} checked={false}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1">小字体</div>
                    <div className="flex-fixed"><Switch onChange={e => { }} checked={false}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1">标题目录</div>
                    <div className="flex-fixed"><Switch onChange={e => { }} checked={false}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1">页面自动显示关联引用</div>
                    <div className="flex-fixed"><Switch onChange={e => { }} checked={false}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1">父页面自动引用子页面</div>
                    <div className="flex-fixed"><Switch onChange={e => { }} checked={false}></Switch></div>
                </div>
            </div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14">空间默认首页</div>
                <div className="remark f-12 gap-h-10">通过自定义域名打开时，默认显示实始页面</div>
                <div>
                   <Input></Input>
                </div>
            </div>
        </div>
    }
}