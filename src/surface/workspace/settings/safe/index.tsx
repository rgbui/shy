import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Col, Divider, Row } from "rich/component/view/grid";
import { Textarea } from "rich/component/view/input/textarea";
import { Select } from "rich/component/view/select";
import { SelectBox } from "rich/component/view/select/box";
import { Switch } from "rich/component/view/switch";
import { Remark } from "rich/component/view/text";
import { channel } from "rich/net/channel";
import { surface } from "../../..";
import { SaveTip } from "../../../../component/tip/save.tip";

@observer
export class SafeSetting extends React.Component {
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
        this.data = {
            access: surface.workspace.access,
            accessJoinTip: surface.workspace.accessJoinTip
        };
        this.forceUpdate();
    }
    change(data: Partial<SafeSetting['data']>) {
        if (data.access == 1) data.accessJoinTip = true;
        if (data.access == 0) data.accessJoinTip = false;
        Object.assign(this.data, data);
        if (this.tip) {
            if (lodash.isEqual(this.data, lodash.pick(surface.workspace, ['public', 'allowJoin'])))
                this.tip.close()
            else
                this.tip.open();
        }
    }
    async save() {
        var r = await channel.patch('/ws/patch', { data: this.data });
        if (r.ok) {
            surface.workspace.access = this.data.access;
            surface.workspace.accessJoinTip = this.data.accessJoinTip;
            this.tip.close();
        }
    }
    reset() {
        runInAction(() => {
            this.data = {
                access: surface.workspace.access,
                accessJoinTip: surface.workspace.accessJoinTip
            };
            this.error = {};
            this.tip.close();
        })
    }
    render() {
        return <div className='shy-ws-manage'>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            <div className="h2">空全设置</div>
            <div className="remark f-12 gap-b-10">这些安全设置选项可以更好地保护空间信息的安全性，请根据需要开启</div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14 gap-t-10">通用的设置</div>
                <div className="remark f-12 gap-h-10">设置后该空间将对互联网完全的公开，请谨慎设置。公开的空间可能会产生大量的流量消耗</div>
                <div className="flex gap-h-10">
                    <div className="flex-auto f-14">允许任何人可以访问空间</div>
                    <div className="flex-fixed"><Switch onChange={e => this.change({ access: e ? 1 : 0 })} checked={this.data.access == 1}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14">允许访客加入空间成为成员</div>
                    <div className="flex-fixed"><Switch onChange={e => this.change({ accessJoinTip: e })} checked={this.data.accessJoinTip}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14">访客发言限制</div>
                    <div className="flex-fixed">
                        <SelectBox width={200} options={[
                            { text: '无限制', value: '' },
                            { text: '5分钟后可发言', value: '' },
                            { text: '10分后可发言', value: '' },
                            { text: '在诗云有验证过的手机', value: '' }
                        ]}>
                        </SelectBox>
                    </div>
                </div>
            </div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14 gap-t-10">加入空间成为成员的准入条件</div>
                <div className="remark f-12 gap-h-10">设置后加入的成员需满足以下条件才可以加入</div>
                <div className="flex gap-h-10">
                    <div className="flex-auto f-14">加入限制</div>
                    <div className="flex-fixed"><SelectBox width={200} options={[
                        { text: '无限制', value: '' },
                        { text: '5分钟后可申请加入', value: '' },
                        { text: '10分后可申请加入', value: '' },
                        { text: '在诗云有验证过的手机', value: '' },
                    ]}>
                    </SelectBox></div>
                </div>
                <div className="gap-h-10">
                    <div className="f-14">服务协议</div>
                    <div className="remark f-12 gap-h-10">加成空间时，用户需要同意该协议才可以成为成员。</div>
                    <div className="max-w-500">
                        <Textarea ></Textarea>
                    </div>
                </div>
            </div>
        </div>
    }
}