import React from "react";
import { UrlRoute } from "../../src/history";
import { config } from "../../common/config";
import { S, Sp } from "rich/i18n/view";
import { AiStartSvg, BoardToolFrameSvg, ChevronDownSvg, CollectTableSvg, DocCardsSvg, MenuSvg, PageSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { getEle, getTypeColor, refShyPage } from "../util";
import { surface } from "../../src/surface/store";
import { Avatar } from "rich/component/view/avator/face";
export function HeadView() {
    function bindEvents()
    {
        var ele = getEle('.shy-site-head-menu');
        ele.addEventListener('mousedown', e => {
            var nv = getEle('.shy-site-head-navs');
            nv.style.display = 'block'
        })
        var eb = getEle('.shy-site-head-navs');
        if (eb) {
            eb.addEventListener('mousedown', g => {
                if (getComputedStyle(ele).display == 'none') return;
                var te = g.target as HTMLElement;
                if (te.tagName.toLowerCase() != 'a') eb.style.display = 'none';
            })
        }
    }
    React.useEffect(() => {
        bindEvents();
    }, [])

    return <div className="shy-site-head">
        <a className="w-120 flex-center flex-fixed" href={UrlRoute.getUrl()}>
            <span className="flex">
                <img className="size-50" src={UrlRoute.getUrl('static/img/shy.logo.256.png')} />
                <img className="h-25" src={UrlRoute.getUrl(config.isUS ? 'static/img/shy.png' : 'static/img/shy.text.png')} />
            </span>
        </a>
        <div className="shy-site-head-navs flex">
            <div className="relative visible-hover h-40 flex-center">
                <div className="shy-site-head-navs-item"><span className="flex"><S>产品</S><span className="gap-l-5"><Icon size={12} icon={ChevronDownSvg}></Icon></span></span></div>
                <div className="shy-site-head-navs-pop visible pos w-500 max-vw90 flex-top padding-10 " style={{ width: 520, top: 40, left: 10 }}>
                    <div className="flex-fixed w-300" >
                        <div className="remark f-14 padding-l-10 bold-500"><S>为什么选择诗云</S></div>
                        <div className="gap-h-10 r-item-hover r-padding-h-5 r-gap-h-10 r-padding-w-10 r-round r-cursor">
                            <a className="flex-top" href={UrlRoute.getUrl('product/ai')}>
                                <span className="flex-fixed flex-center  size-40 " style={getTypeColor('ai')}><Icon icon={AiStartSvg} size={45}></Icon></span>
                                <span className="flex-auto gap-l-10">
                                    <span className="text bold f-16"><S>诗云 AI</S></span>
                                    <span className="block remark f-14"><Sp text='why-select你的私人AI写作肋手'>你的私人AI写作肋手，带给你全新的休验</Sp></span>
                                </span>
                            </a>
                            <a className="flex-top" href={UrlRoute.getUrl('pricing')}>
                                <span className="flex-fixed flex-center size-40 "><img className="size-40" src={UrlRoute.getUrl('static/img/fuli.svg')} /></span>
                                <span className="flex-auto  gap-l-10">
                                    <span className="text bold f-16"><S>免费又省钱</S></span>
                                    <span className="block remark f-14">
                                        <Sp text='why-select本地及私有化部署免费'>本地及私有化部署免费，云端按量计费，功能无限制</Sp>
                                    </span>
                                </span>
                            </a>
                            <a className="flex-top" href={UrlRoute.getUrl('make-money')}>
                                <span className="flex-fixed flex-center  size-40 ">
                                    <img className="size-40" src={UrlRoute.getUrl('static/img/save-money.svg')} />
                                </span>
                                <span className="flex-auto  gap-l-10">
                                    <span className="text bold f-16"><S>赚钱计划</S></span>
                                    <span className="block remark f-14"><Sp text='why-select站式社区协作平台'>一站式社区协作平台，积累知识、维护关系，做自已的小生意，赚更多的钱</Sp></span>
                                </span>
                            </a>
                        </div>
                    </div>
                    <div className="flex-auto ">
                        <div className="remark f-14 padding-l-10 gap-b-10 bold-500"><S>一体化知识系统</S></div>
                        <div className="r-padding-h-5 r-gap-h-5 r-padding-l-10     r-round r-cursor r-item-hover r-flex r-text-1 f-14">

                            <a href={UrlRoute.getUrl("product/doc")}><span className="size-24 flex-center gap-r-5" style={getTypeColor('page')}><Icon size={24} icon={PageSvg}></Icon></span><span className="text bold"><S>文档</S></span><span className="remark flex-auto flex-end padding-r-10"><S text='写作-名词'>写作</S></span></a>
                            <a href={UrlRoute.getUrl("product/datatable")}><span className="size-24 flex-center gap-r-5" style={getTypeColor('datatable')}><Icon size={22} icon={CollectTableSvg}></Icon></span><span className="text bold"><S>数据表</S></span><span className="remark flex-auto flex-end padding-r-10"><S text='计划-名词'>计划</S></span></a>
                            <a href={UrlRoute.getUrl("product/whiteboard")} target="_blank"><span className="size-24 flex-center gap-r-5" style={getTypeColor('whiteboard')}><Icon size={24} icon={{ name: 'bytedance-icon', code: 'enter-the-keyboard' }}></Icon></span><span className="text bold"><S>白板</S></span><span className="remark flex-auto flex-end padding-r-10"><S text='绘图-名词'>绘图</S></span></a>
                            <a href={UrlRoute.getUrl("product/ppt")} target="_blank"><span className="size-24 flex-center gap-r-5" style={getTypeColor('ppt')}><Icon size={24} icon={DocCardsSvg}></Icon></span><span className="text bold"><S>PPT</S></span><span className="remark flex-auto flex-end padding-r-10"><S text='表达-名词'>表达</S></span></a>

                        </div>
                        <div className="remark f-14   padding-l-10 gap-t-10  gap-b-10 bold-500"><S>自定义社交网络</S></div>
                        <div className="r-padding-h-5  r-gap-h-5  r-padding-l-10    r-round r-cursor r-item-hover r-flex r-text-1 f-14">
                            <a href={UrlRoute.getUrl("product/channel")} target="_blank"><span className="size-24 flex-center gap-r-5" style={getTypeColor('channel')}><Icon size={24} icon={BoardToolFrameSvg}></Icon></span><span className="text bold"><S>频道</S></span><span className="remark flex-auto flex-end padding-r-10"><S text='沟通-名词'>沟通</S></span></a>
                            <a href={UrlRoute.getUrl("product/channel")} target="_blank"><span className="size-24 flex-center gap-r-5" style={getTypeColor('friends-circle')}><Icon size={24} icon={{ name: 'bytedance-icon', code: 'friends-circle' }}></Icon></span><span className="text bold"><S>社群</S></span><span className="remark flex-auto flex-end padding-r-10"><S text='互动-名词'>互动</S></span></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="shy-site-head-navs-item"><a href={UrlRoute.getUrl('download')}><S>下载</S></a> </div>
            <div className="shy-site-head-navs-item"><a href={UrlRoute.getUrl('pricing')}><S>定价</S></a> </div>
            <div className="shy-site-head-navs-item"><a href={refShyPage(config.isUS ? "community" : "org")}><S>社区</S></a> </div>
            <div className="shy-site-head-navs-item"><a href={refShyPage('template')}><S>模板中心</S></a> </div>
            <div className="shy-site-head-navs-item"><a href={refShyPage('help')}><S>帮助中心</S></a> </div>
        </div>
        <div className="shy-site-head-user">
            {!surface.user?.id && <a className="shy-site-head-user-sign" href={UrlRoute.getUrl('/sign/in')}><S>登录/注册</S></a>}
            {surface.user?.id && <a href={UrlRoute.getUrl('/home')}><Avatar hideStatus user={surface.user} size={36}></Avatar></a>}
            <a className="shy-site-head-menu">
                <Icon icon={MenuSvg} size={24} />
            </a>
        </div>
    </div>
}