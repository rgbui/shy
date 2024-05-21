import React from "react";
import { ChevronDownSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { S, Sp } from "rich/i18n/view";
import { config } from "../../common/config";


export function QuestionView(){
    return   <div className="gap-h-100 margin-auto ">

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

}