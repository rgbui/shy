import React from "react";
import { CheckSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { config } from "../../common/config";
import { UrlRoute } from "../../src/history";
import { MEAL_1_PRICE, MEAL_2_PRICE, MEAL_FOREVER_PRICE } from "../../src/component/pay/select";
import tinycolor2 from "tinycolor2";

export function PricingValue(props: {
    small?: boolean,
    isNav?: boolean
}) {
    //诗云
    return <div>
        <h3 className="flex-center shy-site-block-head">
            本地及私有云免费，云端按量付费
        </h3>
        <div className="flex-center remark f-24 gap-b-40">诗意栖息，云端漫步，让生活与工作富有创造力</div>
        <div className="flex-center-full   flex-auto-mobile-wrap  r-padding-30 r-round-8 r-bg-white gap-t-20">
            <div className="gap-r-10 gap-b-20 w40 r-gap-b-10 shy-site-block-card" >
                <div className={" shy-site-block-head h-40   flex r-gap-r-5 "} ><img style={{ height: config.isUS ? 28 * 2 : undefined }} src={UrlRoute.getUrl('/static/img/local.svg')} /><span className={"f-28"}>本地及私有云免费</span></div>
                <div className="f-18 text-1 l-22 " style={{ height: props.small ? 80 : undefined }} >
                    全力支持本地及私有云部署(包括局域网）
                </div>
                <div className={"bold " + (props.small ? "f-16" : "f-20")}>信任</div>
                <div className="r-gap-b-10" >
                    <div className=" f-14 l-20 text-1 flex-top"> <span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span>无功能限制、无广告、无歧视</div>
                    <div className=" f-14 l-20 text-1 flex-top"> <span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span>支持私有云多人协作</div>
                    <div className=" f-14 l-20 text-1 flex-top"> <span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span>安装<a href='download' style={{ color: 'inherit', textDecoration: 'underline' }}>诗云服务端</a>，安装在那里，数据存那里</div>
                    <div className=" f-14 l-20 text-1 flex-top"> <span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span>我们想让更多的人用上诗云，仅此而已</div>
                </div>
                {props.isNav && <div className=" flex gap-t-20"><a className="flex bg-hover-define padding-w-14 padding-h-5 round-8 cursor text-white" style={{
                    background: '#0BDCC0',
                    ['--define-color' as any]: tinycolor2('#0BDCC0').darken(5).toString()
                }} href={UrlRoute.getUrl('/pricing')}>了解详情<Icon className={'gap-l-10'} size={16} icon={{ name: 'byte', code: 'arrow-right' }}></Icon></a></div>}
            </div>
            <div className="gap-l-10 gap-b-20 w40 r-gap-b-10 shy-site-block-card">
                <div className={" shy-site-block-head flex  h-40   r-gap-r-5 "}  ><img style={{ height: config.isUS ? 28 * 2 : undefined }} src={UrlRoute.getUrl('/static/img/online.svg')} /><span className={"f-28"}>云端按量付费</span></div>
                <div className="f-18 text-1 l-22 " style={{ height: props.small ? 80 : undefined }} >您的收入增长，才是诗云前行的动力。</div>
                <div className={"bold " + (props.small ? "f-16" : "f-20")}>承诺</div>
                <div className="r-gap-b-10" >
                    <div className=" f-14 l-20 text-1 flex-top" >
                        <span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span>生产力即云资源，按需付费。
                    </div>
                    <div className=" f-14 l-20 text-1 flex-top"><span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span>不限功能、不限人数、不限空间</div>
                    <div className=" f-14 l-20 text-1 flex-top"><span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span>无会员，无超级会员，无广告、无套路</div>
                    <div className=" f-14 l-20 text-1 flex-top"><span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span>无乱收费，按量计费</div>
                </div>
                {props.isNav && <div className=" flex gap-t-20"><a className=" flex bg-hover-define padding-w-14 padding-h-5 round-8 cursor text-white" style={{
                    background: '#ADA9FF',
                    ['--define-color' as any]: tinycolor2('#ADA9FF').darken(5).toString()
                }} href={UrlRoute.getUrl('/pricing')}>了解详情<Icon className={'gap-l-10'} size={16} icon={{ name: 'byte', code: 'arrow-right' }}></Icon></a></div>}
            </div>
        </div>
    </div >
}

export function PricingPackage(props: { wrap?: boolean, openPay?: (kind: "fill" | "meal-1" | "meal-2") => void }) {

    var [isTeam, setTeam] = React.useState(false);

    var free = <div className="gap-10 padding-14 shy-site-block-card">
        <div className="bold f-24">免费版</div>
        <div className="remark gap-h-10 f-14 l-20">适用于本地及私有云</div>
        <div className="bg-ghost-hover gap-h-20 text-white flex-center h-50 round cursor" >免费使用</div>

        <div className="r-gap-b-10">
            <div className="remark f-14 l-20">本地及私有云：</div>
            <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>社区支持</div>
            <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>支持多人协作</div>
            <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>支持AI协作功能</div>
            <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>支持API</div>

            <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>支持公开互联网(需备案)</div>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto">支持独立域名</label><span className="flex-fixed">1个</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span>超出按量付费</p>

            <div className="remark f-14 l-20 gap-t-10">云端免费：</div>
            <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>存储容量<span className="flex-auto flex-end">100M</span></div>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>协作及访客<span className="flex-auto flex-end">5人/日</span></p>
            <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>仅协作分享</div>

        </div>

    </div>

    var personal = <div className="gap-10  padding-14 shy-site-block-card">
        <div className="bold f-24">个人版</div>
        <div className="remark gap-h-10 f-14 l-20">适用于云端知识工作者</div>
        <div className="text-center link-red"><span className="f-20">￥<em className="f-50 bold ">{MEAL_1_PRICE}</em></span><span>年</span><span className="remark del f-12 gap-l-5">180元/年</span></div>
        <div className="bg-primary-hover  gap-h-20  text-white flex-center h-50 round cursor" onClick={e => props.openPay && props.openPay('meal-1')}>升级购买</div>

        <div className="r-gap-b-10">
            <div className="remark f-14 l-20 ">个人版:</div>

            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>协作及访客DAU<span className="flex-auto flex-end">50人/日</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>存储容量<span className="flex-auto flex-end">20G</span></p>

            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>数据行数<span className="flex-auto flex-end">30万条</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>语言大模型<span className="flex-auto flex-end">300万字</span></p>
            <p className="text-1 flex-top f-14 l-20 "><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto">AI生图</label><span className="flex-fixed">20张</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto">二级域名</label><span className="flex-fixed">2个</span></p>
            <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>支持API</div>
            <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20 flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>支持公开互联网、SEO优化</div>
            <p className="text-1 flex-top f-14 l-20 "><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>支持AI协作、搜索、客服</p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span>超出按量付费</p>

        </div>

    </div>

    var personals = <div className="gap-10 padding-14 shy-site-block-card">
        <div className="bold f-24">协作版</div>
        <div className="remark gap-h-10 f-14 l-20">适用于多人协作，经营服务，价值变现</div>
        <div className="text-center  link-red"><span className="f-20">￥<em className="f-50 bold">{MEAL_2_PRICE}</em></span><span>年</span></div>
        <div className="bg-primary-hover  gap-h-20  text-white flex-center h-50 round cursor" onClick={e => props.openPay && props.openPay('meal-2')}>升级购买</div>
        <div className="r-gap-b-10">

            <div className="remark f-14 l-20">个人版的所有内容，以及</div>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>协作及访客DAU<span className="flex-auto flex-end">1000人/日</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>空间存储<span className="flex-auto flex-end">100G</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>数据行数<span className="flex-auto flex-end">200行</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>语言大模型<span className="flex-auto flex-end">2000万字</span></p>
            <p className="text-1 flex-top f-14 l-20 "><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto">AI生图</label><span className="flex-fixed">100张</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto">支持独立域名</label><span className="flex-fixed">3个</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto">支持独立app发布</label><span className="flex-fixed">
                {/* <S text='{count}个' data={{ count: 1 }}>1个 */}
                敬请期待
            </span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>支持商业化运营</p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>特色功能优先体验</p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span>超出按量计费</p></div>

    </div>

    var fill = <div className="gap-10 padding-14 shy-site-block-card">
        <div className="bold f-24">充值</div>
        <div className="remark gap-h-10 f-14 l-20">按量付费，用多少，付多少</div>
        <div className="bg-p-1-hover gap-h-20 text-white flex-center h-50 round cursor" onClick={e => props.openPay && props.openPay('fill')}>立即充值</div>

        <div className="r-gap-b-10">
            <div className="remark f-14 l-20">付费标准</div>

            <p className="text-1 flex-top flex f-14 l-20"><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto">协作及访客DAU≤1万</label><span className="flex-fixed w-80 flex-end">1元/10人/月</span></p>
            <p className="text-1 flex-top flex f-14 l-20"><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto">协作及访客DAU&gt;1万</label><span className="flex-fixed w-90 flex-end">1元/30人/月</span></p>
            <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto">空间存储</label><span className="flex-fixed">元/年/G</span></p>
            <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto">数据行数</label><span className="flex-fixed">元/1万行</span></p>
            <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20 flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto">语言大模型(最低)</label><span className="flex-fixed">1元/10万字</span></p>
            <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto">AI生图</label><span className="flex-fixed">3元/10张</span></p>
            <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto">二级域名</label><span className="flex-fixed">20元/域名</span></p>
            <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto">独立域名(需备案)</label><span className="flex-fixed">100元/域名/年</span></p>
            <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto">独立app发布</label><span className="flex-fixed">
                敬请期待
                {/* <S text='{money}元/个/年' data={{ count: 1, money: 300 }}>元/个/年 */}
            </span></p>
            <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto">开通商业化</label><span className="flex-fixed">
                敬请期待
                {/* <S text='{money}元/个/年' data={{ count: 1, money: 300 }}>元/个/年 */}
            </span></p>
        </div>
    </div>

    var community = <div className="gap-10  padding-14 shy-site-block-card">
        <div className="bold f-24">社区版</div>
        <div className="remark gap-h-10 f-14 l-20">致力为更广泛的人群提供公共性社区服务</div>
        <div className="text-center  link-red"><span className="f-20">￥<em className="f-50 bold">{0}</em></span></div>
        <div className="bg-primary-hover  gap-h-20  text-white flex-center h-50 round cursor" onClick={e => { alert('加入诗云用户群，联系创始人面议') }}>申请</div>

        <div className="r-gap-b-10">

            <div className="remark f-14 l-20 ">申请资格:</div>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>有idea,有热情想做一些有更有意义的事</p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>有很强的自我价值驱动力</p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>需要一定的网络影响力</p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>具备主理运营社区的能力</p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>多人运营为佳</p>

            <div className="remark f-14 l-20 ">我们提供:</div>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>基础的空间服务支持</p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>诗云社区资源倾斜</p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>支持商业化落地</p>

            {/* <div className="remark f-14 l-20 ">合作基础:</div> */}
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>依据服务的公益性程度，诗云持股比0%~15%</p>

        </div>

    </div>

    var business = <div className="gap-10 padding-14 shy-site-block-card">
        <div className="bold f-24">商业版</div>
        <div className="remark gap-h-10 f-14 l-20">适用于企业商业化运作</div>
        <div className="text-center  link-red"><span className="f-20">￥<em className="f-50 bold">5000</em></span><span>年</span></div>
        <div className="bg-primary-hover  gap-h-20  text-white flex-center h-50 round cursor" onClick={e => { }}>敬请期待</div>
        <div className="r-gap-b-10">

            <div className="remark f-14 l-20">所有内容，以及</div>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>协作及访客DAU<span className="flex-auto flex-end">100000人/日</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>空间存储<span className="flex-auto flex-end">1T</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>数据行数<span className="flex-auto flex-end">不限</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>语言大模型<span className="flex-auto flex-end">10亿字</span></p>
            <p className="text-1 flex-top f-14 l-20 "><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto">AI生图</label><span className="flex-fixed">10000张</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto">支持独立域名</label><span className="flex-fixed">不限</span></p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span>超出按量计费</p></div>

    </div>

    var forever = <div className="gap-10 padding-14 shy-site-block-card">
        <div className="flex"><span className="flex-auto bold f-24 ">终身版</span><span style={{ fontStyle: 'normal', fontWeight: 'normal' }} className="flex-fixed f-14 remark">限量300份</span></div>
        <div className="remark gap-h-10 f-14 l-20">终身协作版权限。</div>
        <div className="text-center link-red"><span className="f-20">￥<em className="f-50 bold ">{MEAL_FOREVER_PRICE}</em></span><span>年</span></div>
        <div className="bg-primary-hover  gap-h-20  text-white flex-center h-50 round cursor" onClick={e => { }}>购买</div>
        <div className="r-gap-b-10">

            <div className="remark f-14 l-20">协作版内容，以及:</div>

            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>终身徽章标识</p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span>赠送480小红点（10000小红点送完为止）</p>
            <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span>超出按量计费</p></div>

    </div>

    return <div>
        <h2 className="flex-center shy-site-block-head gap-t-30">文档、数据表、白板、PPT、即时通信、AI协作</h2>
        <div className="flex-center remark f-24" >一体化知识协作工作台，你的想象力，就是我们的边界</div>

        <div className={"flex  gap-h-20 r-box-border  " + "col-3-g20"}>
            {free}{personal}{personals}
        </div>

        <div className={"flex  gap-h-20 r-box-border  " + "col-3-g20"}>
            {fill} {community}
        </div>
    </div>


}