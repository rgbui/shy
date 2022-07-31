
import React from "react";
import { Confirm } from "rich/component/lib/confirm";
import { SuccessSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { Divider } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
import { channel } from "rich/net/channel";
import { useWeixinOpen } from "../../../../component/winxin/open";
export class ShyOpen extends React.Component {
    async load() {
        var r = await channel.get('/open/list');
        if (r.ok) {
            this.list = r.data.list;
            this.forceUpdate();
        }
    }
    componentDidMount(): void {
        this.load();
    }
    async onMouseDownPlatform(event: React.MouseEvent, platform: string) {
        if (this.list.some(s => s.platform == platform && s.disabled != true)) {
            if (await Confirm('确定要解除微信登录的扫码绑定吗?')) {
                var s = this.list.find(s => s.platform == platform && s.disabled != true)
                await channel.del('/open/weixin/unbind', { id: s.id });
                await this.load();
            }
        }
        else {
            var r = await useWeixinOpen();
            if (r) {
                await channel.put('/open/weixin/bind', { weixinOpen: r.open });
                await this.load();
            }
        }
    }
    list: { platform: string, id: string, disabled: boolean }[] = [];
    render() {
        return <div className="shy-open">
            <h2 className="h2">第三方帐户</h2>
            <Divider></Divider>
            <div className="gap-p-10">
                <div className="gap-p-20">
                    <div className="h4">微信</div>
                    <div className="flex gap-b-10">
                        {this.list.some(s => s.platform == 'weixin' && s.disabled != true) && <span className="green f-14 flex-auto flex">
                            <Icon icon={SuccessSvg}></Icon>
                            <span>已成功绑定微信</span>
                        </span>}
                        {!this.list.some(s => s.platform == 'weixin' && s.disabled != true) && <span className="remark f-14 flex-auto flex">
                            <span>未绑定微信</span>
                        </span>}
                        <span className="flex-fixed w-100 inline-block text-right">
                            <Button onClick={e => this.onMouseDownPlatform(e, 'weixin')} ghost>{this.list.some(s => s.platform == 'weixin') ? "解绑微信" : "绑定微信"}</Button>
                        </span>
                    </div>
                    <Divider></Divider>
                </div>
            </div>


        </div>
    }
}