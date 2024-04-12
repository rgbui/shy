
import React from "react";
import { Confirm } from "rich/component/lib/confirm";
import { SuccessSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { Divider } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
import { channel } from "rich/net/channel";
import { useWeixinOpen } from "../../../../component/winxin/open";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { config } from "../../../../../common/config";
import { HelpText } from "rich/component/view/text";

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
            if (await Confirm(lst('确定要解除微信登录的扫码绑定吗?'))) {
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
            <h2 className="h2 flex">
                <S>第三方帐户</S>
                <HelpText style={{ fontWeight: 'normal', marginLeft: 3 }} url={window.shyConfig?.isUS ? "https://help.shy.red/page/66#7cBsxuorRroyR63s7TfkLu" : 'https://help.shy.live/page/1898#r4xa5y6t4bN4qpgLhp1yyJ'}>了解如何绑定第三方帐号</HelpText>
            </h2>
            <Divider></Divider>
            <div className="gap-p-10">
                {!config.isUS && <div className="gap-p-20">
                    <div className="h4"><S>微信</S></div>
                    <div className="flex gap-b-10">
                        {this.list.some(s => s.platform == 'weixin' && s.disabled != true) && <span className="green f-14 flex-auto flex">
                            <Icon icon={SuccessSvg}></Icon>
                            <span><S>已成功绑定微信</S></span>
                        </span>}
                        {!this.list.some(s => s.platform == 'weixin' && s.disabled != true) && <span className="remark f-14 flex-auto flex">
                            <span><S>未绑定微信</S></span>
                        </span>}
                        <span className="flex-fixed w-100 inline-block text-right">
                            <Button size="small" onClick={e => this.onMouseDownPlatform(e, 'weixin')} ghost>{this.list.some(s => s.platform == 'weixin') ? lst("解绑微信") : lst("绑定微信")}</Button>
                        </span>
                    </div>
                    <Divider></Divider>
                </div>}
            </div>
        </div>
    }
}