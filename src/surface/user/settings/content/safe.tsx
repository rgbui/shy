import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import React from "react";
import { Divider } from "rich/component/view/grid";
import { Switch } from "rich/component/view/switch";
import { channel } from "rich/net/channel";
import { surface } from "../../..";
import { SaveTip } from "../../../../component/tip/save.tip";

export class ShySafe extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            data: observable,
            error: observable
        })
    }
    error = {
        text: '',
        slogan: ''
    }
    data = {
        allowSendLetter: true,
        allowAddFriend: true,
        experienceHelp: true
    }
    componentDidMount() {
        this.data = {
            allowSendLetter: surface.user.allowSendLetter,
            allowAddFriend: surface.user.allowAddFriend,
            experienceHelp: surface.user.experienceHelp
        };
        this.forceUpdate();
    }
    change(key: string, value: any) {
        lodash.set(this.data, key, value);
        if (this.tip) {
            if (lodash.isEqual(this.data, lodash.pick(surface.workspace, [
                'allowSendLetter',
                'allowAddFriend',
                'aexperienceHelp'
            ])))
                this.tip.close()
            else this.tip.open();
        }
    }
    tip: SaveTip;
    async save() {
        var r = await channel.patch('/user/patch', { data: this.data });
        if (r.ok) {
            Object.assign(surface.user, this.data);
            this.tip.close();
        }
    }
    reset() {
        runInAction(() => {
            this.data = {
                allowSendLetter: surface.user.allowSendLetter,
                allowAddFriend: surface.user.allowAddFriend,
                experienceHelp: surface.user.experienceHelp
            };
            this.error = { text: '', slogan: '' };
            this.tip.close();
        })
    }
    render() {
        return <div className="shy-open">
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            <h2 className="h2">隐私与安全</h2>
            <Divider></Divider>
            <div>
                <div className="gap-h-10">
                    <div className="f-12 remark">加好友设置</div>
                    <div className="flex gap-h-5">
                        <div className="bold flex-auto">允许Ta人向您直接发起好友邀请</div>
                        <div className="flex-fixed w-100  flex-end flex-inline"><Switch onChange={e => this.change('allowAddFriend', e)} checked={this.data.allowAddFriend}></Switch></div>
                    </div>
                    <div className="text-1 f-12">
                        您可以设置防止Ta人对您的骚扰
                    </div>
                </div>
                <Divider></Divider>
                <div className="gap-h-10">
                    <div className="f-12 remark">私聊设置</div>
                    <div className="flex gap-h-5">
                        <div className="bold flex-auto">允许Ta人向您直接发起私聊</div>
                        <div className="flex-fixed w-100 flex-end flex-inline"><Switch onChange={e => this.change('allowSendLetter', e)} checked={this.data.allowSendLetter}></Switch></div>
                    </div>
                    <div className="text-1 f-12">
                        您可以设置防止Ta人对您的骚扰
                    </div>
                </div>
                <Divider></Divider>
                <div className="gap-h-10">
                    <div className="flex ">
                        <div className="bold flex-auto">允许诗云对屏幕的使用操作进行追踪</div>
                        <div className="flex-fixed w-100 flex-end flex-inline"><Switch onChange={e => this.change('experienceHelp', e)} checked={this.data.experienceHelp}></Switch></div>
                    </div>
                    <div className="text-1 f-12">
                        该设置允许我们收集您在使用诗云与屏幕进行交互记录，我们可以用该数据更好的完善诗云。
                    </div>
                </div>
                <Divider></Divider>
                <div className="code-block gap-t-20 flex f-14 padding-20 round-8">
                    快来阅读一下我们的《<a className="link" href='https://shy.live/service_protocol' target="_blank">服务条款</a>》和《<a className="link" href='https://shy.live/privacy_protocol' target="_blank">隐私条款</a>》
                </div>
            </div>
        </div>
    }
}