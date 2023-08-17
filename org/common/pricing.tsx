import React from "react";
import { CheckSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { S, Sp } from "rich/i18n/view";
import { config } from "../../common/config";
import { UrlRoute } from "../../src/history";

export function PricingValue(props: { small?: boolean }) {
    return <div>
        <h3 className="flex-center shy-site-block-head">
            <S text='本地及私有化免费云端按量计费'>本地及私有化免费，云端按量计费</S>
        </h3>
        <div className="flex-center remark f-24" ><S text='简单而美的收费用户是我们的朋友'>简单而美的收费，用户是我们的朋友</S></div>
        <div className="flex-center-full   flex-auto-mobile-wrap  r-padding-30 r-round-8 r-bg-white gap-t-20">
            <div className="gap-r-10 gap-b-20 w40 r-gap-b-10 shy-site-block-card" >
                <div className={" shy-site-block-head h-80   flex r-gap-r-5 "} ><img style={{ height: config.isUS ? 28 * 2 : undefined }} src={UrlRoute.getUrl('/static/img/local.svg')} /><span className={ "f-28"}><S>本地及私有化免费</S></span></div>
                <div className="f-14 text-1 l-24 " style={{ height: config.isUS ? 100 : 80 }}><Sp text='适用于本地数据安全敏感的用户'>适用于本地数据安全、敏感的用户。<br />支持自搭服务器，数据自主管理。</Sp></div>
                <div className={"bold " + (props.small ? "f-16" : "f-20")}><S>信任</S></div>
                <div className="r-gap-b-10" style={{ height: props.small ? 200 : undefined }}>
                    <div className=" f-14 l-24 text-1 flex-top"> <span className="flex-center size-24 flex-fixed gap-r-5"><Icon icon={CheckSvg} size={12}></Icon></span><S text='无功能限制无广告无歧视'>无功能限制、无广告、无歧视</S></div>
                    <div className=" f-14 l-24 text-1 flex-top"> <span className="flex-center size-24 flex-fixed gap-r-5"><Icon icon={CheckSvg} size={12}></Icon></span><S>局域网及自建服务器仍然支持多人协作</S></div>
                    <div className=" f-14 l-24 text-1 flex-top"> <span className="flex-center size-24 flex-fixed gap-r-5"><Icon icon={CheckSvg} size={12}></Icon></span><Sp text='安装诗云服务端安装在那里，数据存那里'>安装<a href='download' style={{ color: 'inherit', textDecoration: 'underline' }}>诗云服务端</a>，安装在那里，数据存那里</Sp></div>
                    <div className=" f-14 l-24 text-1 flex-top"> <span className="flex-center size-24 flex-fixed gap-r-5"><Icon icon={CheckSvg} size={12}></Icon></span><S text='我们想让更多的人用上诗云仅此而已'>我们想让更多的人用上诗云，仅此而已</S></div></div>
                <div className=" flex gap-t-20"><a className="padding-w-14 padding-h-5 round-8 cursor text-white" style={{ background: '#0BDCC0' }} href={UrlRoute.getUrl('/pricing')}><S>了解详情</S></a></div>
            </div>
            <div className="gap-l-10 gap-b-20 w40 r-gap-b-10 shy-site-block-card">
                <div className={" shy-site-block-head flex  h-80   r-gap-r-5 "}  ><img style={{ height: config.isUS ? 28 * 2 : undefined }} src={UrlRoute.getUrl('/static/img/online.svg')} /><span className={ "f-28"}><S>云端按量计费</S></span></div>
                <div className="f-14 text-1 l-24 " style={{ height: config.isUS ? 100 : 80 }}><Sp text='适用于云端协作办公'>适用于云端协作办公。<br />为个人及团队的生产效率、社区协作而买单。</Sp></div>
                <div className={"bold " + (props.small ? "f-16" : "f-20")}><S>承诺</S></div>
                <div className="r-gap-b-10" style={{ height: props.small ? 200 : undefined }}>
                    <div className=" f-14 l-24 text-1 flex-top" >
                        <span className="flex-center size-24 flex-fixed gap-r-5"><Icon icon={CheckSvg} size={12}></Icon></span><S text='生产力是一种云资源'>生产力是一种云资源，用多少收多少</S>
                    </div>
                    <div className=" f-14 l-24 text-1 flex-top"><span className="flex-center size-24 flex-fixed gap-r-5"><Icon icon={CheckSvg} size={12}></Icon></span><S text='不限功能不限人数不限空间'>不限功能、不限人数、不限空间</S></div>
                    <div className=" f-14 l-24 text-1 flex-top"><span className="flex-center size-24 flex-fixed gap-r-5"><Icon icon={CheckSvg} size={12}></Icon></span><S text='无会员无超级会员无广告无套路'>无会员，无超级会员，无广告、无套路</S></div>
                    <div className=" f-14 l-24 text-1 flex-top"><span className="flex-center size-24 flex-fixed gap-r-5"><Icon icon={CheckSvg} size={12}></Icon></span><S text='无乱收费按量计费的标准参照云服务商'>无乱收费，按量计费的标准参照云服务商</S></div>
                </div>
                <div className=" flex  gap-t-20"><a className="padding-w-14 padding-h-5 round-8 cursor text-white bg-primary bg-primary-hover" href={UrlRoute.getUrl('/pricing')}><S>了解详情</S></a></div>
            </div>
        </div>
    </div>
}
export function PricingPackage(props: { wrap?: boolean, openPay?: (kind: "fill" | "meal-1" | "meal-2") => void }) {
    var pres = <>
        <div className="gap-10 padding-14 shy-site-block-card">
            <div className="bold f-24"><S>云端版</S></div>
            <div className="remark gap-h-10 f-14 l-24"><S text='云端版-description'>适用于知识工作者</S></div>
            <div className="text-center link-red"><span className="f-20"><S>￥</S><em className="f-50 bold ">99</em></span></div>
            <div className="bg-primary bg-primary-hover gap-h-20 text-white flex-center h-50 round cursor" onClick={e => props.openPay && props.openPay('fill')}><S>立即充值</S></div>
            <div className="remark f-14 l-24"><S text='云端版-features'>包含以下功能：</S></div>
            <div className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>云端免费存储</S><span className="flex-auto flex-end">200M</span></div>
            <div className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>社区支持</S></div>
            <div className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>支持多人协作</S></div>
            <div className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>支持诗云AI</S></div>
            <div className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24 flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>支持公开分享至互联网</S></div>
        </div>
        <div className="gap-10  padding-14 shy-site-block-card">
            <div className="bold f-24"><S>专业版</S></div>
            <div className="remark gap-h-10 f-14 l-24"><S text='专业版-description'>适用于个人及小群体,搭建自己的数字花园</S></div>
            <div className="text-center link-red"><span className="f-20"><S>￥</S><em className="f-50 bold ">160</em></span><span><S>年</S></span><span className="remark del f-12 gap-l-5"><S text='元/年' data={{ count: 199 }}>元/年</S></span></div>
            <div className="bg-primary bg-primary-hover  gap-h-20  text-white flex-center h-50 round cursor" onClick={e => props.openPay && props.openPay('meal-1')}><S>升级购买</S></div>
            <div className="remark f-14 l-24"><S text='专业版-features'>云端版中的所有内容，以及：</S></div>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>空间</S><span className="flex-auto flex-end">50G</span></p>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>流量</S><span className="flex-auto flex-end">250G</span></p>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>数据</S><span className="flex-auto flex-end"><S text='{count}条' data={{ count: config.isUS ? "300K" : "30万" }}>30万条</S></span></p>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>支持自定义二级域名</S></p>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>支持开通付费业务</S></p>
            <div className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>支持SEO优化</S></div>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>超出按量计费</S></p>
        </div>
    </>
    var lasts = <>
        <div className="gap-10 padding-14 shy-site-block-card">
            <div className="bold f-24"><S>社区版</S></div>
            <div className="remark gap-h-10 f-14 l-24"><S text='社区版-description'>适用于开放性社区，流量无限</S></div>
            <div className="text-center  link-red"><span className="f-20"><S>￥</S><em className="f-50 bold">800</em></span><span><S>年</S></span><span className="remark del f-12 gap-l-5"><S text='元/年' data={{ count: 999 }}>元/年</S></span></div>
            <div className="bg-primary-1  bg-primary-1-hover  gap-h-20  text-white flex-center h-50 round cursor" onClick={e => props.openPay && props.openPay('meal-2')}><S>升级购买</S></div>
            <div className="remark f-14 l-24"><S text='社区版-features'>专业版中的所有内容，以及</S>：</div>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>空间</S><span className="flex-auto flex-end">200G</span></p>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>流量</S><span className="flex-auto flex-end"><S>无限</S></span></p>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>数据</S><span className="flex-auto flex-end"><S text='{count}条' data={{ count: config.isUS ? "2000K" : "200万" }}>200万条</S></span></p>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>支持自定义域名</S></p>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>支持独立app发布</S></p>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>支持商业化运营</S></p>
            <p className="text-1 flex-top f-14 l-24"><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><S>超出按量计费</S></p>
        </div>
        <div className="gap-10 padding-14 shy-site-block-card">
            <div className="bold f-24"><S>按量计费</S></div>
            <div className="remark gap-h-10 f-14 l-24"><S text='按量计费-description'>适用于用多少，付多少</S></div>
            <div className="bg-primary bg-primary-hover gap-h-20 text-white flex-center h-50 round cursor" onClick={e => props.openPay && props.openPay('fill')}><S>立即充值</S></div>
            <div className="remark f-14 l-24"><S text='按量计费'>计费标准：</S></div>
            <p className="text-1 flex-top f-14 l-24 "><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><label className="flex-auto"><S>存储</S></label><span className="flex-fixed"><S text='元/年/G' data={{ count: 2 }}>元/年/G</S></span></p>
            <p className="text-1 flex-top f-14 l-24 "><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><label className="flex-auto"><S>流量</S></label><span className="flex-fixed"><S text='元/G' data={{ count: 0.5 }}>元/G</S></span></p>
            <p className="text-1 flex-top f-14 l-24 "><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><label className="flex-auto"><S>数据条数</S></label><span className="flex-fixed"><S text='元/1万行' data={{ count: 3 }}>元/1万行</S></span></p>
            <p className="text-1 flex-top f-14 l-24 "><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><label className="flex-auto"><S>AI写作</S></label><span className="flex-fixed"><S text='元/1万字' data={{ count: 0.5 }}>元/1万字</S></span></p>
            <p className="text-1 flex-top f-14 l-24 "><span className={'gap-r-5 remark flex-fixed size-24  flex-center '}><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} ></Icon></span><label className="flex-auto"><S>语音</S></label><span className="flex-fixed"><S text='元/1小时' data={{ count: 1 }}>元/1小时</S></span></p>
        </div>
    </>

    return <div>
        <h2 className="flex-center shy-site-block-head gap-t-30"><S>按需付费套餐包</S></h2>
        <div className="flex-center remark f-24"><S text='按需付费套餐包-description'>不限空间、不限人数、不限功能、按量付费</S></div>
        {props.wrap && <><div className="flex flex-full gap-t-20 r-w50">
            {pres}
        </div><div className="flex  flex-full  gap-t-20 r-w50">
                {lasts}
            </div>
        </>}
        {!props.wrap && <div className="flex gap-t-20  flex-auto-mobile-wrap  r-w25 r-gap-b-20"> {pres}{lasts}</div>}
    </div>


}