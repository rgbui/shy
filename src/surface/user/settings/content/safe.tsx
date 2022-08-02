import React from "react";
import { Divider } from "rich/component/view/grid";
import { Switch } from "rich/component/view/switch";

export class ShySafe extends React.Component {
    render() {
        return <div className="shy-open">
            <h2 className="h2">隐私与安全</h2>
            <Divider></Divider>
            <div>
                <div className="gap-h-10">
                    <div className="f-12 remark">加好友设置</div>
                    <div className="flex">
                        <div className="h4 flex-auto">允许Ta人向您直接发起好友邀请</div>
                        <div className="flex-fixed w-100  flex-end flex-inline"><Switch onChange={e => { }} checked={false}></Switch></div>
                    </div>
                    <div className="text-1">
                        您可以设置防止Ta人对您的骚扰
                    </div>
                </div>
                <Divider></Divider>
                <div className="gap-h-10">
                    <div className="f-12 remark">私聊设置</div>
                    <div className="flex">
                        <div className="h4 flex-auto">允许Ta人向您直接发起私聊</div>
                        <div className="flex-fixed w-100 flex-end flex-inline"><Switch onChange={e => { }} checked={false}></Switch></div>
                    </div>
                    <div className="text-1">
                        您可以设置防止Ta人对您的骚扰
                    </div>
                </div>
                <Divider></Divider>
                <div className="gap-h-10">
                    <div className="flex">
                        <div className="h4 flex-auto">允许诗云对屏屏幕的使用操作进行追踪</div>
                        <div className="flex-fixed w-100 flex-end flex-inline"><Switch onChange={e => { }} checked={false}></Switch></div>
                    </div>
                    <div className="text-1">
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