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
                <div className="text-center gap-h-20 f-14">不限空间、不限人数、不限功能、按量付费</div>
                <div className="flex flex-top flex-full">
                    <div style={{ width: 'calc(33% - 10px)' }} className="flex-fixed   box-border  gap-r-10 padding-14 shadow  round r-gap-10">
                        <div className="h3">个人免费版</div>
                        <div>本地100% 永久免费使用</div>
                        <div>社区支持</div>
                        <div>支持局域网多人协作</div>
                        <div className="flex"><span className="flex-auto">线上免费存储</span><span className="flex-fixed">200M</span></div>
                        <div>超出按量付费</div>
                        <div>充值用很久</div>
                    </div>
                    <div style={{ width: 'calc(33% - 10px)' }} className="flex-fixed  box-border  gap-l-10 padding-14 shadow  round r-gap-10">
                        <div className="h3">个人专业版</div>
                        <div className="flex"><span className="flex-auto">160<span className="del gap-l-10">199</span>元/年</span><span className="flex-fixed"><Button onClick={e => this.wallet.meal != 'meal-1' && openPay('meal-1')} ghost={this.wallet.meal == 'meal-1' ? true : false}>{this.wallet.meal == 'meal-1' ? "使用中" : "升级"}</Button></span></div>
                        <div className="flex"><span>适用于个人及小群体</span></div>
                        <div className="flex"><span className="flex-auto">空间</span><span className="flex-fixed">50G</span></div>
                        <div className="flex"><span className="flex-auto">流量</span><span className="flex-fixed">250G</span></div>
                        <div className="flex"><span className="flex-auto">数据</span><span className="flex-fixed">30万条</span></div>
                        <div className="flex"><span>支持自定义二级域名</span></div>
                        <div>超出按量付费</div>
                    </div>
                    <div style={{ width: 'calc(33% - 10px)' }} className="flex-fixed gap-l-10 box-border padding-14 shadow  round r-gap-5">
                        <div className="h3">社区版</div>
                        <div className="flex"><span className="flex-auto">800<span className="del gap-l-10">999</span>元/年</span><span className="flex-fixed"><Button onClick={e => this.wallet.meal != 'meal-2' && openPay('meal-2')} ghost={this.wallet.meal == 'meal-2' ? true : false}>{this.wallet.meal == 'meal-2' ? "使用中" : "升级"}</Button></span></div>
                        <div className="flex"><span>适用于开放性社区，流量无限</span></div>
                        <div className="flex"><span className="flex-auto">空间</span><span className="flex-fixed">200G</span></div>
                        <div className="flex"><span className="flex-auto">流量</span><span className="flex-fixed">无限</span></div>
                        <div className="flex"><span className="flex-auto">数据</span><span className="flex-fixed">200万条</span></div>
                        <div className="flex"><span>支持自定义域名</span></div>
                        <div className="flex"><span>支持商业独立运营</span></div>
                        <div className="flex"><span>支持发行独立app(待开发)</span></div>
                        <div>超出按量付费</div>
                    </div>
                </div>
            </div>

            <div className="gap-h-40">
                <div className="h2 flex-center">按量计费</div>
                <div className="flex flex-center">
                    <div style={{ width: 'calc(50% - 10px)' }} className=" gap-l-10 box-border padding-14 shadow  round r-gap-5">
                        {/* <div className="h3">社区版</div> */}
                        <div className="flex"><span className="flex-auto">空间</span><span className="flex-fixed">2元/G/年</span></div>
                        <div className="flex"><span className="flex-auto">流量</span><span className="flex-fixed">0.5元/G</span></div>
                        <div className="flex"><span className="flex-auto">数据</span><span className="flex-fixed">3元/1万条</span></div>
                        <div className="flex"><span className="flex-auto">语音</span><span className="flex-fixed">1元/1小时</span></div>
                        <div className="flex"><span className="flex-auto">AI写作</span><span className="flex-fixed">0.5元/1万字</span></div>
                    </div>
                </div>
            </div>

            <div className="gap-h-40">
                <div className="h2 flex-center">个人用户该如何付费</div>
                <div className="margin-auto  shadow  max-w-500 bg-white padding-14 round-8 l-30"  >
                    如果您想把知识存在本地，建议您找台空闲的电脑安装一下诗云的服务端。之后在局域网可以多人整理知识了。诗云对此是免费的，也不会特意限制功能，除了各别无法免费的功能如AI写作。
                    <br />
                    <br />
                    如果使用云端，建议充一下值，诗云是按使用量收费的，最低充99元。个人用量不大，用两三年都没什么问题，用完再充。功能及协作没什么限制，AI写作也能用。
                    <br />
                    <br />
                    如果您是知识整理的深度用户，有大量的数据文件，建议您购买个人专业版，它会比按量付费更实惠，支持自定义二级域名。
                </div>
            </div>


            <div className="gap-h-40">
                <div className="h2 flex-center">搭个团队社区该如何付费</div>
                <div className="margin-auto  shadow  max-w-500 bg-white padding-14 round-8 l-30"  >
                    如果您的社区用户几百人，个人专业版实际就够了。
                    <br />
                    <br />
                    如果您需要保持商业化独立运营，建议您选择社区版。它比站点更便宜、更容易维护。
                </div>
            </div>

            <div className="gap-h-40">

                <div className="h2 flex-center">功能列表</div>
                <div className="flex-center gap-h-20">专业的块编辑器，释放每一个人的创造性</div>
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



        </div>
    }
}