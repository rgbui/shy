import { load } from "@fingerprintjs/fingerprintjs";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { CheckSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { Icon } from "rich/component/view/icon";
import { channel } from "rich/net/channel";
import { useSelectPayView } from "../../../../component/pay/select";
import "./style.less";

@observer
export class ShyFeature extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            feature: observable,
            wallet: observable
        })
    }
    componentDidMount() {
        this.load();
    }
    async load() {
        var r = await channel.get('/user/wallet');
        if (r?.ok) {
            this.wallet = r.data as any;
        }
    }
    wallet: { money: number, meal: string, due: Date } = { money: 0, meal: '', due: null }
    feature: { item: 'personal' | 'item' } = { item: 'personal' };
    render() {
        var self = this;
        async function openPay(kind: "fill" | "meal-1" | "meal-2") {
            var r = await useSelectPayView(kind);
            if (r) {
                load();
            }
        }
        return <div className="shy-app-lang">

            <div className="gap-h-10">
                <div className="h2 flex-center">价格</div>
                <div className="text-center gap-h-10 f-14">不限空间、不限人数、不限功能、按量付费</div>
                <div className="flex flex-top flex-full">
                    <div style={{ width: 'calc(50% - 10px)' }} className="flex-fixed   box-border  gap-r-10 padding-14 shadow  round r-gap-10">
                        <div className="h3">免费</div>
                        <div>本地100% 永久免费使用</div>
                        <div>社区支持</div>
                        <div>支持局域网多人协作</div>
                        <div className="flex">
                            <span className="flex-auto">线上免费存储</span><span className="flex-fixed">200M</span>
                        </div>
                        <div className="flex">安装诗云服务端(数据存储在本地)</div>
                    </div>
                    <div style={{ width: 'calc(50% - 10px)' }} className="flex-fixed  box-border  gap-l-10 padding-14 shadow  round r-gap-10">
                        <div className="h3">云端</div>
                        <div className="flex"><span className="flex-auto">按量付费</span><span className="flex-fixed"><Button onClick={e => openPay('fill')} >购买</Button></span></div>
                        <div className="flex"><span className="flex-auto">软件服务费</span><span className="flex-fixed"><span>60<span className="remark del f-12 gap-l-5">100</span>元/年</span></span></div>
                        <div className="flex"><span className="flex-auto">空间</span><span className="flex-fixed">2元/G/年</span></div>
                        <div className="flex"><span className="flex-auto">流量</span><span className="flex-fixed">0.5元/G</span></div>
                        <div className="flex"><span className="flex-auto">数据</span><span className="flex-fixed">3元/1万条</span></div>
                        <div className="flex"><span className="flex-auto">语音</span><span className="flex-fixed">1元/1小时</span></div>
                        <div className="flex"><span className="flex-auto">其它</span></div>
                    </div>
                </div>
            </div>

            <div className="gap-h-30">
                <div className="h2 flex-center">套餐包</div>
                <div className="flex-center   gap-h-20">不按人头收费、支持独立域名及app、自建服务器</div>
                <div className="flex flex-top flex-full">
                    <div style={{ width: 'calc(50% - 10px)' }} className="flex-fixed gap-r-10 box-border padding-14 shadow  round r-gap-5">
                        <div className="h3">团队版</div>
                        <div className="flex"><span className="flex-auto">199元/年</span><span className="flex-fixed"><Button onClick={e => this.wallet.meal != 'meal-1' && openPay('meal-1')} ghost={this.wallet.meal == 'meal-1' ? true : false}>{this.wallet.meal == 'meal-1' ? "使用中" : "升级"}</Button></span></div>
                        <div className="flex"><span>适用于小规模团队</span></div>
                        <div className="flex"><span className="flex-auto">空间</span><span className="flex-fixed">20G</span></div>
                        <div className="flex"><span className="flex-auto">流量</span><span className="flex-fixed">100G</span></div>
                        <div className="flex"><span className="flex-auto">数据</span><span className="flex-fixed">30万条</span></div>
                    </div>
                    <div style={{ width: 'calc(50% - 10px)' }} className="flex-fixed gap-l-10 box-border padding-14 shadow  round r-gap-5">
                        <div className="h3">社区版</div>
                        <div className="flex"><span className="flex-auto">360元/年</span><span className="flex-fixed"><Button onClick={e => this.wallet.meal != 'meal-2' && openPay('meal-2')} ghost={this.wallet.meal == 'meal-2' ? true : false}>{this.wallet.meal == 'meal-2' ? "使用中" : "升级"}</Button></span></div>
                        <div className="flex"><span>适用于开放性社区，流量无限</span></div>
                        <div className="flex"><span className="flex-auto">空间</span><span className="flex-fixed">50G</span></div>
                        <div className="flex"><span className="flex-auto">流量</span><span className="flex-fixed">无限</span></div>
                        <div className="flex"><span className="flex-auto">数据</span><span className="flex-fixed">100万条</span></div>
                        <div className="flex"><span>支持自定义域名</span></div>
                        <div className="flex"><span>支持发行独立app(待开发)</span></div>
                    </div>
                </div>
            </div>

            <div className="gap-h-30">

                <div className="h2 flex-center">功能列表</div>
                <div className="margin-auto  shadow  max-w-500 padding-14 round-8 bg-white r-gap-h-10  r-padding-10 r-border-bottom f-14">
                    <div className="flex"><span className="flex-auto">文档</span><span className="flex-fixed"><Icon size={20} icon={CheckSvg}></Icon></span></div>
                    <div className="flex"><span className="flex-auto">数据表格</span><span className="flex-fixed"><Icon size={20} icon={CheckSvg}></Icon></span></div>
                    <div className="flex"><span className="flex-auto">频道</span><span className="flex-fixed"><Icon size={20} icon={CheckSvg}></Icon></span></div>
                    <div className="flex"><span className="flex-auto">PPT</span><span className="flex-fixed"><Icon size={20} icon={CheckSvg}></Icon></span></div>
                    <div className="flex"><span className="flex-auto">白板</span><span className="flex-fixed">已开发，年内上线</span>
                    </div>
                    <div className="flex"><span className="flex-auto">微信剪藏</span><span className="flex-fixed">年内上线</span>
                    </div>
                    <div className="flex"><span className="flex-auto">Web Clipper 剪藏</span><span className="flex-fixed">年内支持</span>
                    </div>
                    <div className="flex"><span className="flex-auto">双链</span><span className="flex-fixed"><Icon size={20} icon={CheckSvg}></Icon></span>
                    </div>
                    <div className="flex"><span className="flex-auto">大纲目录</span><span className="flex-fixed"><Icon size={20} icon={CheckSvg}></Icon></span>
                    </div>
                    <div className="flex"><span className="flex-auto">知识搜索</span><span className="flex-fixed"><Icon size={20} icon={CheckSvg}></Icon></span>
                    </div>
                    <div className="flex"><span className="flex-auto">AI图文写作</span><span className="flex-fixed"><Icon size={20} icon={CheckSvg}></Icon></span>
                    </div>
                    <div className="flex"><span className="flex-auto">知识问答机器人</span><span className="flex-fixed"><Icon size={20} icon={CheckSvg}></Icon></span>
                    </div>
                    <div className="flex"><span className="flex-auto">导入导出</span><span className="flex-fixed"><Icon size={20} icon={CheckSvg}></Icon></span>
                    </div>
                    <div className="flex"><span className="flex-auto">本地云端</span><span className="flex-fixed"><Icon size={20} icon={CheckSvg}></Icon></span>
                    </div>
                    <div className="flex"><span className="flex-auto">手机端</span><span className="flex-fixed">年内上线</span>
                    </div>
                    <div className="flex"><span className="flex-auto">语音/视频</span><span className="flex-fixed">计划中</span>
                    </div>
                    <div className="flex"><span className="flex-auto">开放API</span><span className="flex-fixed">计划中</span>
                    </div>
                    <div className="flex"><span className="flex-auto">区块链</span><span className="flex-fixed">计划中</span>
                    </div>
                </div>
            </div>

            <div className="gap-h-30">
                <div className="h2 flex-center">为什么按量付费</div>
                <div className="margin-auto  shadow  max-w-500 bg-white padding-14 round-8 l-30"  >
                    诗云的商业模式很简单。我们组织人员开发了产品，用户使用产品需要支付基础的软件服务费。
                    余下的参考其它云服务商的价格，也支持你本地存储云端化、自建服务器。
                    <br />
                    <br />
                    诗云是一个社区化协作工具，我们提供一种基于富文本编辑器的方式支持大家灵活运营自已的小社区。
                    在这个小社区里创作、治理、营收、数据全归大家所拥有。
                    <br />
                    <br />
                    我们不是平台，我们只是想帮肋大家搭建一个独属于自已的网络世界。就像线下的店铺，你可以自已装修、自已经营、自已收款。
                    你搭建的网络世界就是你自已的数字资产(区块链确权）。你为自已打工，而不是为平台，你幸苦赚钱，别人不应该抽成。
                </div>
            </div>
            
        </div>
    }
}