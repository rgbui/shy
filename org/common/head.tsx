import React from "react";
import { UrlRoute } from "../../src/history";
import { config } from "../../common/config";
import { S } from "rich/i18n/view";

import {
    AiStartSvg,
    BoardToolFrameSvg,
    ChevronDownSvg,
    DocCardsSvg,
    PageSvg
} from "rich/component/svgs";

import { Icon } from "rich/component/view/icon";
import { getEle, getTypeColor, refShyPage } from "../util";
import { surface } from "../../src/surface/app/store";
import { Avatar } from "rich/component/view/avator/face";

export function HeadView() {
    function bindEvents() {
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

    return <div className="shy-site-head ">
        <a className="w-120 flex-center flex-fixed" href={UrlRoute.getUrl()}>
            <span className="flex">
                <img style={{
                    height: 50
                }} src={UrlRoute.getUrl(config.isUS ? 'static/img/shy.red.svg' : 'static/img/shy.live.svg')} />
            </span>
        </a>
        <div className="shy-site-head-navs flex">
            <div className="relative visible-hover h-40 flex-center">
                <div className="shy-site-head-navs-item"><span className="flex"><S>产品</S><span className="gap-l-5"><Icon size={12} icon={ChevronDownSvg}></Icon></span></span></div>
                <div className="shy-site-head-navs-pop shadow-s visible pos  max-vw90 flex-top padding-10 " style={{ width: 210, top: 40, left: 10 }}>
                    <div className="w100">
                        <div className="remark f-12 padding-l-10 gap-b-10 "><S>一体化知识系统</S></div>
                        <div className="r-padding-h-5 r-gap-h-5 r-padding-l-10     r-round r-cursor r-item-hover r-flex r-text-1 f-14">

                            <a href={UrlRoute.getUrl("product/doc")}><span className="size-24 flex-center gap-r-5" style={getTypeColor('page')}><Icon size={24} icon={PageSvg}></Icon></span><span className="text b-500"><S>文档</S></span><span className="remark flex-auto flex-end padding-r-10"><S text='写作-名词'>写作</S></span></a>
                            <a href={UrlRoute.getUrl("product/datatable")}><span className="size-24 flex-center gap-r-5" style={getTypeColor('datatable')}><Icon size={24} icon={{ name: 'byte', code: 'trace' }}></Icon></span><span className="text b-500"><S>数据表</S></span><span className="remark flex-auto flex-end padding-r-10"><S text='计划-名词'>计划</S></span></a>
                            <a href={UrlRoute.getUrl("product/whiteboard")} ><span className="size-24 flex-center gap-r-5" style={getTypeColor('whiteboard')}><Icon size={24} icon={{ name: 'bytedance-icon', code: 'enter-the-keyboard' }}></Icon></span><span className="text b-500"><S>白板</S></span><span className="remark flex-auto flex-end padding-r-10"><S text='绘图-名词'>创作</S></span></a>
                            <a href={UrlRoute.getUrl("product/ppt")} ><span className="size-24 flex-center gap-r-5" style={getTypeColor('ppt')}><Icon size={24} icon={DocCardsSvg}></Icon></span><span className="text b-500"><S>PPT</S></span><span className="remark flex-auto flex-end padding-r-10"><S text='表达-名词'>表达</S></span></a>
                            <a href={UrlRoute.getUrl("product/ai")} ><span className="size-24 flex-center gap-r-5" style={getTypeColor('ai')}><Icon size={24} icon={AiStartSvg}></Icon></span><span className="text b-500"><S>AI</S></span><span className="remark flex-auto flex-end padding-r-10"><S >协作</S></span></a>

                        </div>
                        <div className="remark f-12   padding-l-10 gap-t-10  gap-b-10 ">自定义社区圈子</div>
                        <div className="r-padding-h-5  r-gap-h-5  r-padding-l-10    r-round r-cursor r-item-hover r-flex r-text-1 f-14">
                            <a href={UrlRoute.getUrl("product/channel")} ><span className="size-24 flex-center gap-r-5" style={getTypeColor('channel')}><Icon size={24} icon={BoardToolFrameSvg}></Icon></span><span className="text b-500"><S>频道</S></span><span className="remark flex-auto flex-end padding-r-10"><S text='沟通-名词'>沟通</S></span></a>
                            <a href={UrlRoute.getUrl("product/channel")} ><span className="size-24 flex-center gap-r-5" style={getTypeColor('friends-circle')}><Icon size={24} icon={{ name: 'bytedance-icon', code: 'friends-circle' }}></Icon></span><span className="text b-500"><S>社群</S></span><span className="remark flex-auto flex-end padding-r-10">圈子</span></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="shy-site-head-navs-item"><a href={UrlRoute.getUrl('download')}><S>下载</S></a> </div>
            <div className="shy-site-head-navs-item"><a href={refShyPage("community")}><S>社区</S></a> </div>
            <div className="shy-site-head-navs-item"><a href={refShyPage('template')}><S>模板</S></a> </div>
            <div className="shy-site-head-navs-item"><a href={refShyPage('help')}><S>帮助中心</S></a> </div>
            <div className="shy-site-head-navs-item"><a href={UrlRoute.getUrl('pricing')}><S>定价</S></a> </div>
        </div>
        <div className="shy-site-head-user">
            {!surface.user?.id && <a className="shy-site-head-user-sign bg-button-dark" href={UrlRoute.getUrl('/sign/in')}><S>登录/注册</S></a>}
            {surface.user?.id && <a href={UrlRoute.getUrl('/home')}><Avatar hideStatus user={surface.user} size={36}></Avatar></a>}
            <a className="shy-site-head-menu">
                <Icon icon={{ name: 'bytedance-icon', code: 'hamburger-button' }} size={24} />
            </a>
        </div>
    </div>
}