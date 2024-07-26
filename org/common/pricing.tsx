import React from "react";
import { CheckSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { S, Sp } from "rich/i18n/view";
import { config } from "../../common/config";
import { UrlRoute } from "../../src/history";
import { MEAL_1_PRICE, MEAL_2_PRICE } from "../../src/component/pay/select";

export function PricingValue(props: {
    small?: boolean,
    isNav?: boolean
}) {
    //诗云
    return <div>
        <h3 className="flex-center shy-site-block-head">
            <S text='本地及私有化免费云端按量计费'>本地及私有云免费，云端按量付费</S>
        </h3>
        <div className="flex-center remark f-24 gap-b-40"><S text='按需付费套餐包-description'>诗意栖息，云端漫步，让生活与工作富有创造力</S></div>

        <div className="flex-center-full   flex-auto-mobile-wrap  r-padding-30 r-round-8 r-bg-white gap-t-20">
            <div className="gap-r-10 gap-b-20 w40 r-gap-b-10 shy-site-block-card" >
                <div className={" shy-site-block-head h-40   flex r-gap-r-5 "} ><img style={{ height: config.isUS ? 28 * 2 : undefined }} src={UrlRoute.getUrl('/static/img/local.svg')} /><span className={"f-28"}><S>本地及私有云免费</S></span></div>
                <div className="f-14 text-1 l-22 " style={{ height: props.small ? 80 : undefined }} ><Sp text='适用于本地数据安全敏感的用户'>您的数据，您做主。<br />无条件的支持您本地及私有云(包括局域网），确保您数据安全无忧</Sp></div>
                <div className={"bold " + (props.small ? "f-16" : "f-20")}><S>信任</S></div>
                <div className="r-gap-b-5" >
                    <div className=" f-14 l-20 text-1 flex-top"> <span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span><S text='无功能限制无广告无歧视'>无功能限制、无广告、无歧视</S></div>
                    <div className=" f-14 l-20 text-1 flex-top"> <span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span><S>支持私有云多人协作</S></div>
                    <div className=" f-14 l-20 text-1 flex-top"> <span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span><Sp text='安装诗云服务端安装在那里，数据存那里'>安装<a href='download' style={{ color: 'inherit', textDecoration: 'underline' }}>诗云服务端</a>，安装在那里，数据存那里</Sp></div>
                    <div className=" f-14 l-20 text-1 flex-top"> <span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span><S text='我们想让更多的人用上诗云仅此而已'>我们想让更多的人用上诗云，仅此而已</S></div></div>
                {props.isNav && <div className=" flex gap-t-20"><a className="padding-w-14 padding-h-5 round-8 cursor text-white" style={{ background: '#0BDCC0' }} href={UrlRoute.getUrl('/pricing')}><S>了解详情</S></a></div>}
            </div>
            <div className="gap-l-10 gap-b-20 w40 r-gap-b-10 shy-site-block-card">
                <div className={" shy-site-block-head flex  h-40   r-gap-r-5 "}  ><img style={{ height: config.isUS ? 28 * 2 : undefined }} src={UrlRoute.getUrl('/static/img/online.svg')} /><span className={"f-28"}><S>云端按量付费</S></span></div>
                <div className="f-14 text-1 l-22 " style={{ height: props.small ? 80 : undefined }} ><Sp text='适用于云端协作办公'>云端协作，成果付费，为您增加的收入买单。<br />您的收入增长才是诗云前进的动力。</Sp></div>
                <div className={"bold " + (props.small ? "f-16" : "f-20")}><S>承诺</S></div>
                <div className="r-gap-b-5" >
                    <div className=" f-14 l-20 text-1 flex-top" >
                        <span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span><S text='生产力是一种云资源'>生产力是一种云资源，用多少付多少</S>
                    </div>
                    <div className=" f-14 l-20 text-1 flex-top"><span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span><S text='不限功能不限人数不限空间'>不限功能、不限人数、不限空间</S></div>
                    <div className=" f-14 l-20 text-1 flex-top"><span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span><S text='无会员无超级会员无广告无套路'>无会员，无超级会员，无广告、无套路</S></div>
                    <div className=" f-14 l-20 text-1 flex-top"><span className="flex-center size-20 flex-fixed"><Icon icon={CheckSvg} size={12}></Icon></span><S text='无乱收费按量计费的标准参照云服务商'>无乱收费，按量计费的标准参照云服务商</S></div>
                </div>
                {props.isNav && <div className=" flex gap-t-20"><a className="padding-w-14 padding-h-5 round-8 cursor text-white" style={{ background: '#0BDCC0' }} href={UrlRoute.getUrl('/pricing')}><S>了解详情</S></a></div>}
            </div>
        </div>
    </div>
}

export function PricingPackage(props: { wrap?: boolean, openPay?: (kind: "fill" | "meal-1" | "meal-2") => void }) {
    var pres = <>
        <div className="gap-10 padding-14 shy-site-block-card">
            <div className="bold f-24"><S>免费版</S></div>
            <div className="remark gap-h-10 f-14 l-20"><S text='免费版-description'>适用于本地及私有云</S></div>
            <div className="bg-ghost-hover gap-h-20 text-white flex-center h-50 round cursor" ><S>免费使用</S></div>


            <div className="r-gap-b-10">
                <div className="remark f-14 l-20"><S>本地及私有云：</S></div>
                <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>社区支持</S></div>
                <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>支持多人协作</S></div>
                <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>支持AI协作功能</S></div>
                <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>支持API</S></div>

                <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>支持公开互联网(需备案)</S></div>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto"><S>支持独立域名</S></label><span className="flex-fixed"><S text='{count}个' data={{ count: 1 }}>1个</S></span></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><S>超出按量付费</S></p>

                <div className="remark f-14 l-20 gap-t-10"><S>云端免费：</S></div>
                <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>存储容量</S><span className="flex-auto flex-end">100M</span></div>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>协作及访客</S><span className="flex-auto flex-end"><S text='{count}人/日' data={{ count: 5 }}>5人/日</S></span></p>
                <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>仅协作分享</S></div>

            </div>

        </div>
        <div className="gap-10  padding-14 shy-site-block-card">
            <div className="bold f-24"><S>个人版</S></div>
            <div className="remark gap-h-10 f-14 l-20"><S text='个人版-description'>适用于云端知识工作者</S></div>
            <div className="text-center link-red"><span className="f-20"><S>￥</S><em className="f-50 bold ">{MEAL_1_PRICE}</em></span><span><S>年</S></span><span className="remark del f-12 gap-l-5"><S text='{count}元/年' data={{ count: 180 }}>180元/年</S></span></div>
            <div className="bg-primary-hover  gap-h-20  text-white flex-center h-50 round cursor" onClick={e => props.openPay && props.openPay('meal-1')}><S>升级购买</S></div>

            <div className="r-gap-b-10">
                <div className="remark f-14 l-20 "><S >个人版</S>:</div>

                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>协作及访客DAU</S><span className="flex-auto flex-end"><S text='{count}人/日' data={{ count: 50 }}>200人/日</S></span></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>存储容量</S><span className="flex-auto flex-end">20G</span></p>

                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>数据行数</S><span className="flex-auto flex-end"><S text='{count}行' data={{ count: config.isUS ? "300K" : "30万" }}>30万条</S></span></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>语言大模型</S><span className="flex-auto flex-end"><S text='{count}万字' data={{ count: 300 }}>300万字</S></span></p>
                <p className="text-1 flex-top f-14 l-20 "><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto"><S>AI生图</S></label><span className="flex-fixed"><S text='{count}张' data={{ count: 20 }}>20张</S></span></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto"><S>二级域名</S></label><span className="flex-fixed"><S text='{count}个' data={{ count: 2 }}>2个</S></span></p>
                <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>支持API</S></div>
                <div className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20 flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>支持公开互联网、SEO优化</S></div>
                <p className="text-1 flex-top f-14 l-20 "><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>支持AI协作、搜索、客服</S></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><S>超出按量付费</S></p>

            </div>

        </div>
    </>
    var lasts = <>
        <div className="gap-10 padding-14 shy-site-block-card">
            <div className="bold f-24"><S>协作版</S></div>
            <div className="remark gap-h-10 f-14 l-20"><S text='专业版-description'>适用于多人协作，经营服务，价值变现</S></div>
            <div className="text-center  link-red"><span className="f-20"><S>￥</S><em className="f-50 bold">{MEAL_2_PRICE}</em></span><span><S>年</S></span></div>
            <div className="bg-primary-hover  gap-h-20  text-white flex-center h-50 round cursor" onClick={e => props.openPay && props.openPay('meal-2')}><S>升级购买</S></div>

            <div className="r-gap-b-10">

                <div className="remark f-14 l-20"><S text='专业版-features'>个人版的所有内容，以及</S></div>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>协作及访客DAU</S><span className="flex-auto flex-end"><S text='{count}人/日' data={{ count: 1000 }}>1000人/日</S></span></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>空间存储</S><span className="flex-auto flex-end">100G</span></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>数据行数</S><span className="flex-auto flex-end"><S text='{count}行' data={{ count: config.isUS ? "2000K" : "200万" }}>200万条</S></span></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>语言大模型</S><span className="flex-auto flex-end"><S text='{count}万字' data={{ count: 2000 }}>2000万字</S></span></p>
                <p className="text-1 flex-top f-14 l-20 "><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto"><S>AI生图</S></label><span className="flex-fixed"><S text='{count}张' data={{ count: 100 }}>100张</S></span></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto"><S>支持独立域名</S></label><span className="flex-fixed"><S text='{count}个' data={{ count: 3 }}>3个</S></span></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><label className="flex-auto"><S>支持独立app发布</S></label><span className="flex-fixed">
                    {/* <S text='{count}个' data={{ count: 1 }}>1个</S> */}
                    <S>敬请期待</S>
                </span></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>支持商业化运营</S></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={12} ></Icon></span><S>特色功能优先体验</S></p>
                <p className="text-1 flex-top f-14 l-20"><span className={'remark flex-fixed size-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><S>超出按量计费</S></p></div>

        </div>
        <div className="gap-10 padding-14 shy-site-block-card">
            <div className="bold f-24"><S>充值</S></div>
            <div className="remark gap-h-10 f-14 l-20"><S text='按量计费-description'>按量付费，用多少，付多少</S></div>
            <div className="bg-p-1-hover gap-h-20 text-white flex-center h-50 round cursor" onClick={e => props.openPay && props.openPay('fill')}><S>立即充值</S></div>

            <div className="r-gap-b-10">
                <div className="remark f-14 l-20"><S text='付费标准'>付费标准</S></div>

                <p className="text-1 flex-top flex f-14 l-20"><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto"><S>协作及访客DAU≤1万</S></label><span className="flex-fixed w-80 flex-end"><S text='{money}元/{count}人/月' data={{ count: 10, money: 1 }}>1元/10人/月</S></span></p>
                <p className="text-1 flex-top flex f-14 l-20"><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto"><S>协作及访客DAU&gt;1万</S></label><span className="flex-fixed w-90 flex-end"><S text='{money}元/{count}人/月' data={{ count: 30, money: 1 }}>1元/10人/月</S></span></p>
                <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto"><S>空间存储</S></label><span className="flex-fixed"><S text='元/年/G' data={{ count: 5 }}>元/年/G</S></span></p>
                <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto"><S>数据行数</S></label><span className="flex-fixed"><S text='元/1万行' data={{ count: 5 }}>元/1万行</S></span></p>
                <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20 flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto"><S>语言大模型(最低)</S></label><span className="flex-fixed"><S text='{money}元/{count}万字' data={{ count: 10, money: 1 }}>元/10万字</S></span></p>
                <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto"><S>AI生图</S></label><span className="flex-fixed"><S text='{money}元/{count}张' data={{ count: 10, money: 3 }}>元/10张</S></span></p>
                <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto"><S>二级域名</S></label><span className="flex-fixed"><S text='{money}元/域名' data={{ count: 1, money: 20 }}>元/域名</S></span></p>
                <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto"><S>独立域名(需备案)</S></label><span className="flex-fixed"><S text='{money}元/域名' data={{ count: 1, money: 100 }}>元/域名/年</S></span></p>
                <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto"><S>独立app发布</S></label><span className="flex-fixed">
                    <S>敬请期待</S>
                    {/* <S text='{money}元/个/年' data={{ count: 1, money: 300 }}>元/个/年</S> */}
                </span></p>
                <p className="text-1 flex f-14 l-20 "><span className={'remark flex-fixed w-12 h-20  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'dot' }} size={12} ></Icon></span><label className="flex-auto"><S>开通商业化</S></label><span className="flex-fixed">
                    <S>敬请期待</S>
                    {/* <S text='{money}元/个/年' data={{ count: 1, money: 300 }}>元/个/年</S> */}
                </span></p>
            </div>

        </div>
    </>

    return <div>
        <h2 className="flex-center shy-site-block-head gap-t-30"><S text=''>文档、数据表、白板、PPT、即时通信、AI</S></h2>
        <div className="flex-center remark f-24" ><S text='简单而美的收费用户是我们的朋友'>一体化知识协作工作台，你的想象力，就是我们的边界</S></div>
        {props.wrap && <><div className="flex flex-full gap-t-20 r-w50">
            {pres}
        </div><div className="flex  flex-full  gap-t-20 r-w50">
                {lasts}
            </div>
        </>}
        {!props.wrap && <div className="flex gap-t-20  flex-auto-mobile-wrap  r-w25 r-gap-b-20"> {pres}{lasts}</div>}
    </div>


}