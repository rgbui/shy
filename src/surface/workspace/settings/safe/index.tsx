import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Divider } from "rich/component/view/grid";
import { Textarea } from "rich/component/view/input/textarea";
import { SelectBox } from "rich/component/view/select/box";
import { Switch } from "rich/component/view/switch";
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
    data: { access: number, accessJoinTip: boolean, accessTalkLimit: string, accessJoinLimit: string, acessJoinAgree: string } = {
        access: 1,
        accessJoinTip: false,
        accessTalkLimit: 'none',
        accessJoinLimit: 'none',
        acessJoinAgree: ''
    };
    error: Record<string, any> = {};
    tip: SaveTip;
    componentDidMount() {
        this.data = {
            access: surface.workspace.access,
            accessJoinTip: surface.workspace.accessJoinTip,
            accessTalkLimit: surface.workspace.accessTalkLimit,
            accessJoinLimit: surface.workspace.accessJoinLimit,
            acessJoinAgree: surface.workspace.acessJoinAgree
        };
        this.forceUpdate();
    }
    change(key: string, value: any) {
        lodash.set(this.data, key, value);
        if (this.tip) {
            if (lodash.isEqual(this.data, lodash.pick(surface.workspace, [
                'access',
                'accessJoinTip',
                'accessTalkLimit',
                'accessJoinLimit',
                'acessJoinAgree:'
            ])))
                this.tip.close()
            else this.tip.open();
        }
    }
    async save() {
        var r = await channel.patch('/ws/patch', { data: this.data });
        if (r.ok) {
            Object.assign(surface.workspace, this.data);
            this.tip.close();
        }
    }
    reset() {
        runInAction(() => {
            this.data = lodash.pick(surface.workspace, [
                'access',
                'accessJoinTip',
                'accessTalkLimit',
                'accessJoinLimit',
                'acessJoinAgree:'
            ]) as any;
            this.error = {};
            this.tip.close();
        })
    }
    render() {
        return <div className='shy-ws-manage'>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            <div className="h2">空全设置</div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14 gap-t-10">通用的设置</div>
                <div className="remark f-12 gap-h-10">设置后该空间将对互联网完全的公开，请谨慎设置。公开的空间可能会产生大量的流量消耗</div>
                <div className="flex gap-h-10">
                    <div className="flex-auto f-14">允许任何人可以访问空间</div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('access', e ? 1 : 0)} checked={this.data.access == 1}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14">允许访客加入空间成为成员</div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('accessJoinTip', e)} checked={this.data.accessJoinTip}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14">访客发言限制</div>
                    <div className="flex-fixed">
                        <SelectBox border width={200} value={this.data.accessTalkLimit} onChange={e => this.change('accessTalkLimit', e)} options={[
                            { text: '无限制', value: 'none' },
                            { text: '访问5分钟后可发言', value: '5' },
                            { text: '访问10分后可发言', value: '10' },
                            { text: '在诗云有验证过的手机', value: 'checkPhone' }
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
                    <div className="flex-fixed f-14 gap-r-10">加入限制</div>
                    <div className="flex-fixed" ><SelectBox border value={this.data.accessJoinLimit} onChange={e => this.change('accessJoinLimit', e)} width={200} options={[
                        { text: '无限制', value: 'none' },
                        { text: '访问5分钟后可申请加入', value: '5' },
                        { text: '访问10分后可申请加入', value: '10' },
                        { text: '在诗云有验证过的手机', value: 'checkPhone' },
                    ]}>
                    </SelectBox></div>
                </div>
                <div className="gap-h-10">
                    <div className="f-14">服务协议</div>
                    <div className="remark f-12 gap-h-10">加入空间时，用户需要同意该协议才可以成为成员。</div>
                    <div className="max-w-500">
                        <Textarea value={this.data.acessJoinAgree} onChange={e => this.change('acessJoinAgree', e)} placeholder="支持markdown语法" ></Textarea>
                    </div>
                </div>
            </div>
        </div>
    }
}