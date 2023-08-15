import React from "react";
import { ChevronDownSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { S, Sp } from "rich/i18n/view";
import { PricingPackage, PricingValue } from "./common/pricing";
import { UsedView } from "./common/used";
import { SiteFeatures } from "./common/feature";
import { config } from "../common/config";
import { useSelectPayView } from "../src/component/pay/select";
import { surface } from "../src/surface/store";
import { ShyAlert } from "rich/component/lib/alert";
import { lst } from "rich/i18n/store";

export function PriceView() {
    async function openPay(kind: "fill" | "meal-1" | "meal-2") {
        if (!surface.user?.isSign) return ShyAlert(lst('请先登录'))
        var r = await useSelectPayView(kind);
        if (r) {
            ShyAlert(lst('支付成功'))
        }
    }
    return <div>
        <div className="shy-site-block">
            <div className="padding-b-50 ">
                <div className="flex-center padding-t-50">
                    <img className="w-350" src='static/img/dog.svg' />
                </div>
                <PricingValue></PricingValue>
            </div>
        </div>
        <div className="shy-site-block">
            <div className="gap-h-50">
                <PricingPackage openPay={openPay}></PricingPackage>
            </div></div>
        <div className="shy-site-block">
            <div className="gap-h-30">
                <h3 className="flex-center shy-site-block-head gap-t-30"><S>诗云与其它产品付费区别</S></h3>

                <div className="border-top padding-h-10">
                    <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                        <span className="flex-auto"><S text='诗云与本地免费的区别'>本地免费的区别？</S></span>
                        <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                    </div>
                    <div className="remark f-14 l-24">
                        <Sp text='诗云与本地免费的区别-description'>诗云支持本地、局域网、自建服务器免费，功能与云端无太大区别<br />
                            其它产品本地免费，一般只支持单机，不支持多人协作</Sp>
                    </div>
                </div>

                <div className="border-top padding-h-10">
                    <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                        <span className="flex-auto"><S text='订阅付费与按量计费的区别'>订阅付费与按量计费的区别？</S></span>
                        <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                    </div>
                    <div className="remark f-14 l-24">
                        <Sp text='订阅付费与按量计费的区别-description'>诗云依据空间消耗的资源来计费，付费空间对其它人无付费要求<br />
                            其它产品是按协作人数来计费的，协作者越多，费用越高</Sp>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="flex-center padding-t-100">
                <img className="w-300" src='static/img/no-pa.svg' />
            </div>
        </div>

        <UsedView></UsedView>

        <div className="shy-site-block"><SiteFeatures></SiteFeatures></div>


        <div className="shy-site-block">
            <div className="gap-h-100 margin-auto ">

                <h1 className="flex-center shy-site-block-head gap-t-30">
                    <S>常见问题</S>
                </h1>

                <h3 className="text-center f-16 remark"><S text='如仍然有问题请至'>如仍然有问题，请至</S><a style={{
                    color: 'inherit',
                    textDecoration: 'underline'
                }} href={config.isUS ? "https://community.shy.red" : 'https://org.shy.live'}><S>云云社区</S></a><S>联系</S></h3>

                <div className="r-gap-b-10">
                    <div className="border-top padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto"><S text='诗云的云端免费额度'>诗云的云端免费额度？</S></span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            <Sp text='诗云的云端免费额度-answer'>云端有200M的免费流量，协作空间无法公开分享至互联网，但页面可以分享给任何人。<br />
                                无法使用部分收费功能服务，如诗云AI。<br />
                                如果想使用免费的，建议选择本地的存储，本地存储没有任何限制。<br />
                                云端是按量计费的，最低充值99元，按量付费，充一次用很久。<br /></Sp>
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto"><S text='我如何为我的团队进行购买'>我如何为我的团队进行购买？</S></span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            <Sp text='我如何为我的团队进行购买-answer'>诗云是按使用量来计费的，没有按协作人数来收费<br />
                                团队成员需要他们自已充值<br />
                                诗云会提供团购功能，可以通过团购来为团队成员充值<br /></Sp>
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto"><S text='诗云AI的免费额度'>诗云AI的免费额度？</S></span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            <Sp text={'诗云AI的免费额度-answer'}>诗云AI目前没有免费额度，诗云AI基于文言一心或GPT。<br /></Sp>
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto"><S text="有什么优惠活动">有什么优惠活动？</S></span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            <Sp text="有什么优惠活动-answer"> 会有一系列的相关的优惠活动，请关注官网<br /></Sp>
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto"><S text={'诗云AI如何使用我的数据'}>诗云AI如何使用我的数据？</S></span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            <Sp text={'诗云AI如何使用我的数据-answer'}>诗云采用的是第三方AI，如果使用AI，诗云会将数据发送给大模型。<br /></Sp>
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto"><S text='什么是块'>什么是块？</S></span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            <Sp text='什么是块-answer'>块是您添加到页面的任何单个内容，例如一段文本、待办事项、图像、代码块、嵌入文件等。将您的页面视为由这些构建组成块。</Sp>
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto"><S text='你们给学生提供优惠'>你们给学生提供优惠吗？</S></span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            <Sp text='你们给学生提供优惠-answer'>会有八折的优惠，需要提供学生证明。</Sp>
                        </div>
                    </div>
                </div>



            </div>


        </div>

        <div className="min-h-200"></div>


    </div>
}