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
                <div className="flex-center gap-h-20">本地永久免费，云端按量计费</div>
                <div className="flex flex-top flex-full">
                    <div style={{ width: 'calc(50% - 10px)' }} className="flex-fixed   box-border  gap-r-10 padding-14 shadow  round r-gap-5">
                        <div className="h3">免费</div>
                        <div className="remark">安装诗云服务端(数据存储在本地)</div>
                        <div>本地100% 永久免费使用</div>
                        <div>支持局域网多人协作</div>
                        <div>社区支持</div>
                        <div>云端免费 200M</div>
                    </div>
                    <div style={{ width: 'calc(50% - 10px)' }} className="flex-fixed  box-border  gap-l-10 padding-14 shadow  round r-gap-5">
                        <div className="h3">云端</div>
                        <div className="flex"><span className="flex-auto">按量付费</span><span className="flex-fixed"><Button onClick={e => openPay('fill')} >购买</Button></span></div>
                        <div className="flex"><span className="flex-auto">软件服务费</span><span className="flex-fixed">80元/年</span></div>
                        <div className="flex"><span className="flex-auto">空间</span><span className="flex-fixed">2元/G/年</span></div>
                        <div className="flex"><span className="flex-auto">流量</span><span className="flex-fixed">0.6元/G</span></div>
                        <div className="flex"><span className="flex-auto">数据</span><span className="flex-fixed">3元/1万条</span></div>
                        <div className="flex"><span className="flex-auto">语音</span><span className="flex-fixed">1元/1小时</span></div>
                        <div className="flex"><span className="flex-auto">其它</span></div>
                    </div>
                </div>
            </div>
            <div className="gap-h-30">
                <div className="h2 flex-center">套餐包</div>
                <div className="flex-center   gap-h-20">不按人头收费,支持独立域名及app</div>
                <div className="flex flex-top flex-full">
                    <div style={{ width: 'calc(50% - 10px)' }} className="flex-fixed gap-r-10 box-border padding-14 shadow  round r-gap-5">
                        <div className="h3">团队版</div>
                        <div className="flex"><span className="flex-auto">150元/年</span><span className="flex-fixed"><Button onClick={e => this.wallet.meal != 'meal-1' && openPay('meal-1')} ghost={this.wallet.meal == 'meal-1' ? true : false}>{this.wallet.meal == 'meal-1' ? "使用中" : "升级"}</Button></span></div>
                        <div className="flex"><span>适用于小规模团队</span></div>
                        <div className="flex"><span className="flex-auto">空间</span><span className="flex-fixed">20G</span></div>
                        <div className="flex"><span className="flex-auto">流量</span><span className="flex-fixed">100G</span></div>
                        <div className="flex"><span className="flex-auto">数据</span><span className="flex-fixed">50万条</span></div>
                    </div>
                    <div style={{ width: 'calc(50% - 10px)' }} className="flex-fixed gap-l-10 box-border padding-14 shadow  round r-gap-5">
                        <div className="h3">社区版</div>
                        <div className="flex"><span className="flex-auto">360元/年</span><span className="flex-fixed"><Button onClick={e => this.wallet.meal != 'meal-2' && openPay('meal-2')} ghost={this.wallet.meal == 'meal-2' ? true : false}>{this.wallet.meal == 'meal-2' ? "使用中" : "升级"}</Button></span></div>
                        <div className="flex"><span>适用于开放性社区，流量无限</span></div>
                        <div className="flex"><span className="flex-auto">空间</span><span className="flex-fixed">50G</span></div>
                        <div className="flex"><span className="flex-auto">流量</span><span className="flex-fixed">无限</span></div>
                        <div className="flex"><span className="flex-auto">数据</span><span className="flex-fixed">200万条</span></div>
                        <div className="flex"><span>支持自定义域名</span></div>
                        <div className="flex"><span>支持发行独立app</span></div>
                    </div>
                </div>
            </div>

            <div className="gap-h-10">
                <div className="h4">已支持的功能</div>
                <div className="r-flex r-gap-h-5">
                    <div><Icon size={14} icon={CheckSvg}></Icon><span className="gap-l-5">文档</span></div>
                    <div><Icon size={14} icon={CheckSvg}></Icon><span className="gap-l-5">数据表格</span></div>
                    <div><Icon size={14} icon={CheckSvg}></Icon><span className="gap-l-5">频道</span></div>
                    <div><Icon size={14} icon={CheckSvg}></Icon><span className="gap-l-5">想法</span></div>
                    <div><Icon size={14} icon={CheckSvg}></Icon><span className="gap-l-5">演示稿</span></div>
                    <div><Icon size={14} icon={CheckSvg}></Icon><span className="gap-l-5">微信剪藏</span></div>
                    <div><Icon size={14} icon={CheckSvg}></Icon><span className="gap-l-5">诗云AI机器人</span></div>
                    <div><Icon size={14} icon={CheckSvg}></Icon><span className="gap-l-5">训练自已的知识问答机器人</span></div>
                </div>

                <div className="h4">计划支持的功能</div>
                <div className="r-flex r-gap-h-5">
                    <div>白板</div>
                </div>
            </div>

            {/* <div className="shy-feature-card-box">
                <div className="shy-feature-card-head">
                    <a onMouseDown={e => this.feature.item = 'personal'} className={this.feature.item == 'personal' ? "hover" : ""}>个人使用</a>
                    <a onMouseDown={e => this.feature.item = 'item'} className={this.feature.item == 'item' ? "hover" : ""}>团队使用</a>
                </div>
                <div className="shy-feature-cards">
                    {this.feature.item == 'personal' && <>
                        <div className="shy-feature-card">
                            <h2 className="h2">免费版</h2>
                            <Row className='gap-h-10'><Col><label>本地离线免费</label></Col></Row>
                            <Row className='gap-h-10'><Col>2022年底上线</Col></Row>
                            <Row className='gap-h-10'><Col>支持本地文档</Col></Row>
                            <Row className='gap-h-10'><Col>支持本地白板</Col></Row>
                            <Row className='gap-h-10'><Col><i>支持本地多维表</i></Col></Row>
                            <Row className='gap-h-10'><Col><i>支持能够离线的所有功能</i></Col></Row>
                            <Row className='gap-h-10'><Col></Col></Row>
                        </div>
                        <div className="shy-feature-card">
                            <h2 className="h2">个人版</h2>
                            <Row className='gap-h-10'><Col span={12}><label>按量付费</label></Col><Col span={12} align="end" ><Button onClick={e => openPay('fill')} >购买</Button></Col></Row>
                            <Row className='gap-h-10'><Col span={12}>空间</Col><Col span={12} align="end">3元/G/年</Col></Row>
                            <Row className='gap-h-10'><Col span={12}>流量</Col><Col span={12} align="end">1元/G</Col></Row>
                            <Row className='gap-h-10'><Col span={12}>数据</Col><Col span={12} align="end">3元/1万条</Col></Row>
                            <Row className='gap-h-10'><Col span={12}>API</Col><Col span={12} align="end">待定</Col></Row>
                            <Row className='gap-h-10'><Col><i>软件服务费50元/年</i></Col></Row>
                            <Row className='gap-h-10'><Col><i>功能全开，协作成员数无限制</i></Col></Row>
                        </div>
                    </>}
                    {this.feature.item == 'item' && <>
                        <div className="shy-feature-card">
                            <h2 className="h2">团队版</h2>
                            <Row className='gap-h-10'><Col span={12}><label>150元/年</label></Col><Col align="end" span={12}><Button onClick={e => this.wallet.meal != 'meal-1' && openPay('meal-1')} ghost={this.wallet.meal == 'meal-1' ? true : false}>{this.wallet.meal == 'meal-1' ? "使用中" : "升级"}</Button></Col></Row>
                            <Row className='gap-h-10'><Col>适用于小规模团队</Col></Row>
                            <Row className='gap-h-10'><Col span={12}>空间</Col><Col align="end" span={12}>20G</Col></Row>
                            <Row className='gap-h-10'><Col span={12}>流量</Col><Col align="end" span={12}>100G</Col></Row>
                            <Row className='gap-h-10'><Col span={12}>数据</Col><Col align="end" span={12}>50万条</Col></Row>
                            <Row className='gap-h-10'><Col><i>功能全开，协作成员数无限制</i></Col></Row>
                        </div>
                        <div className="shy-feature-card">
                            <h2 className="h2">社区版</h2>
                            <Row className='gap-h-10'><Col span={12}><label>480元/年</label></Col><Col span={12} align="end" ><Button onClick={e => this.wallet.meal != 'meal-2' && openPay('meal-2')} ghost={this.wallet.meal == 'meal-2' ? true : false}>{this.wallet.meal == 'meal-2' ? "使用中" : "升级"}</Button></Col></Row>
                            <Row className='gap-h-10'><Col>适用于开放性社区，<i>流量无限</i></Col></Row>
                            <Row className='gap-h-10'><Col span={12}>空间</Col><Col align="end" span={12}>50G</Col></Row>
                            <Row className='gap-h-10'><Col span={12}>流量</Col><Col align="end" span={12}>无限</Col></Row>
                            <Row className='gap-h-10'><Col span={12}>数据</Col><Col align="end" span={12}>200万条</Col></Row>
                            <Row className='gap-h-10'><Col><i>支持自定义域名</i></Col></Row>
                            <Row className='gap-h-10'><Col><i>支持发行独立app(待开发）</i></Col></Row>
                        </div>
                    </>}
                </div>
            </div>
            <div className="shy-feature-compare">
                <h2>功能对比</h2>
                <table>
                    <thead><tr><th></th><th>本地离线</th><th>个人版</th><th>团队版</th><th>社区版</th></tr></thead>
                    <tbody>
                        <tr><td>页面/块数量</td><td></td><td><Icon size={14} icon={CheckSvg}></Icon></td><td></td><td></td></tr>
                        <tr><td>成员数</td><td></td><td><Icon size={14} icon={CheckSvg}></Icon></td><td></td><td></td></tr>
                        <tr><td>外部协作者人数</td><td></td><td><Icon size={14} icon={CheckSvg}></Icon></td><td></td><td></td></tr>
                        <tr><td>文件上传</td><td></td><td></td><td></td><td></td></tr>
                        <tr><td>存储空间</td><td></td><td></td><td></td><td><Icon size={14} icon={CheckSvg}></Icon></td></tr>
                        <tr><td>单个块字数限制</td><td></td><td></td><td></td><td><Icon size={14} icon={CheckSvg}></Icon></td></tr>
                        <tr><td>页面历史</td><td></td><td></td><td></td><td><Icon size={14} icon={CheckSvg}></Icon></td></tr>
                        <tr><td>协作</td><td></td><td></td><td></td><td><Icon size={14} icon={CheckSvg}></Icon></td></tr>
                        <tr><td>实时协作</td><td></td><td></td><td></td><td><Icon size={14} icon={CheckSvg}></Icon></td></tr>
                        <tr><td>链接分享</td><td></td><td></td><td></td><td><Icon size={14} icon={CheckSvg}></Icon></td></tr>
                        <tr><td>多端同步（Web+APP）</td><td></td><td></td><td></td><td><Icon size={14} icon={CheckSvg}></Icon></td></tr>
                        <tr><td>多维表全部属性</td><td></td><td></td><td></td><td><Icon size={14} icon={CheckSvg}></Icon></td></tr>
                    </tbody>
                </table>
            </div> */}

        </div>
    }
}