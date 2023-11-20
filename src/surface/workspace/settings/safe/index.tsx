import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Divider } from "rich/component/view/grid";
import { Textarea } from "rich/component/view/input/textarea";
import { Switch } from "rich/component/view/switch";
import { channel } from "rich/net/channel";
import { surface } from "../../../store";
import { SaveTip } from "../../../../component/tip/save.tip";
import { Workspace } from "../..";
import { ShyAlert } from "rich/component/lib/alert";
import { config } from "../../../../../common/config";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";

@observer
export class SafeSetting extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            data: observable,
            error: observable
        })
    }
    data: {
        access: number,
        accessProfile: Workspace['accessProfile']
    } = {
            access: 1,
            accessProfile: {
                disabledJoin: false,
                joinProtocol: '',
                checkJoinProtocol: false
            }
        };
    error: Record<string, any> = {};
    tip: SaveTip;
    componentDidMount() {
        this.data = {
            access: surface.workspace.access,
            accessProfile: lodash.cloneDeep(surface.workspace.accessProfile)
        };
        this.forceUpdate();
    }
    change(key: string, value: any) {
        lodash.set(this.data, key, value);
        if (this.tip) {
            if (lodash.isEqual(this.data, lodash.pick(surface.workspace, [
                'access',
                'accessProfile'
            ]))) this.tip.close()
            else this.tip.open();
        }
    }
    async save() {
        var r = await channel.patch('/ws/patch', { data: this.data });
        if (r.ok) {
            Object.assign(surface.workspace, lodash.cloneDeep(this.data));
            this.tip.close();
            ShyAlert(lst('更改成功'))
        }
    }
    reset() {
        runInAction(() => {
            this.data = lodash.cloneDeep(lodash.pick(surface.workspace, [
                'access',
                'accessProfile'
            ]) as any);
            this.error = {};
            this.tip.close();
        })
    }
    async openAccess(access: number) {
        if (access == 1) {
            var us = await surface.user.wallet();
            if (config.isTestBeta || us.money > 5 || !us.isDue && (us.meal == 'meal-1' || us.meal == 'meal-2')) {

            }
            else {
                ShyAlert(lst('需要充值才能公开至互联网'))
                return;
            }
        }
        this.change('access', access);
    }
    render() {
        return <div className='shy-ws-manage'>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            <div className="h2"><S>安全设置</S></div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14 gap-t-10"><S>通用的设置</S></div>
                <div className="remark f-12 gap-h-10"><S text='设置空间公开提示'>设置后该空间将对互联网完全的公开。公开的空间可能会产生大量的流量消耗，请谨慎设置</S></div>
                <div className="flex gap-h-10">
                    <div className="flex-auto f-14"><S>公开至互联网</S></div>
                    <div className="flex-fixed"><Switch onChange={e => this.openAccess(e ? 1 : 0)} checked={this.data.access == 1}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14"><S>禁止访客加入空间成为成员</S></div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('accessProfile.disabledJoin', e)} checked={this.data.accessProfile.disabledJoin ? true : false}></Switch></div>
                </div>
            </div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14 gap-t-10"><S>加入空间成为成员的准入条件</S></div>
                <div className="gap-h-10">
                    <div className="flex gap-h-10">
                        <div className="flex-auto  f-14"><S>服务协议</S></div>
                        <div className="flex-fixed"><Switch onChange={e => this.change('accessProfile.checkJoinProtocol', e)} checked={this.data.accessProfile.checkJoinProtocol ? true : false}></Switch></div>
                    </div>
                    {this.data.accessProfile.checkJoinProtocol &&
                        <><div className="remark f-12 gap-h-10"><S text='加入空间时用户需要同意以下协议才可以成为成员'>加入空间时，用户需要同意以下协议才可以成为成员。</S></div>
                            <div className="max-w-600">
                                <Textarea style={{ minHeight: 250 }} value={this.data.accessProfile.joinProtocol} onChange={e => this.change('accessProfile.joinProtocol', e)} placeholder={lst("支持markdown语法")} ></Textarea>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    }
}