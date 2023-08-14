import React from "react";
import { S } from "rich/i18n/view";
import { config } from "../../common/config";
import { UrlRoute } from "../../src/history";



export function SiteFeatures() {


    return <div>
        <h3 className="shy-site-block-head flex-center gap-b-40"><S text='丰富的功能性助你协作事半功倍'>丰富的功能性，助你协作事半功倍</S></h3>
        <div className="flex flex-top r-gap-10">
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>Markdown语法</S></div>
                <div className="remark f-18 padding-l-30 l-30"><S text='Markdown语法-description'>支持Markdown语法的键入输入</S></div>
            </div>
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>数学公式</S></div>
                <div className="remark f-18 padding-l-30 l-30 min-h-60"><S text='数学公式-description'>支持Latex公式</S></div>
            </div>
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>时实更新</S></div>
                <div className="remark f-18 padding-l-30 l-30"><S text='时实更新-description'>多个文档展示同一信息，一处更新，全局时实同步</S></div>
            </div>

        </div>
        <div className="flex flex-top r-gap-10">
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>大纲</S></div>
                <div className="remark f-18 padding-l-30 l-30 min-h-60"><S text='大纲-description'>组织页面大纲结构</S></div>
            </div>
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>双链</S></div>
                <div className="remark f-18 padding-l-30 l-30"><S text='双链-description'>支持页面关系相互引用</S></div>
            </div>
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>标签</S></div>
                <div className="remark f-18 padding-l-30 l-30"><S text='标签-description'>支持页面标签索引</S></div>
            </div>
        </div>

        <div className="flex flex-top r-gap-10">
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>关键词搜索</S></div>
                <div className="remark f-18 padding-l-30 l-30"><S text='关键词搜索-description'>基于Elasticsearch服务搜索</S></div>
            </div>
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>语义搜索</S></div>
                <div className="remark f-18 padding-l-30 l-30 min-h-60"><S text='语义搜索-description'>基于空间知识库的AI机器人语义搜索</S></div>
            </div>
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>自定义按钮工作流</S></div>
                <div className="remark f-18 padding-l-30 l-30"><S text='自定义按钮工作流-description'>自定义页面的按钮点击事件</S></div>
            </div>
        </div>
        <div className="flex flex-top r-gap-10">
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>角色权限控制</S></div>
                <div className="remark f-18 padding-l-30 l-30"><S text='角色权限控制-description'>支持设置不同的角色页面权限访问</S></div>
            </div>
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>自定义表单收集</S></div>
                <div className="remark f-18 padding-l-30 l-30 min-h-60"><S text='自定义表单收集-description'>支持自定义数据表的表单</S></div>
            </div>
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S text='页面点评点赞等'>页面点评、点赞等</S></div>
                <div className="remark f-18 padding-l-30 l-30"><S text='页面点评点赞等-description'>支持页面的点评、点赞、打赏</S></div>
            </div>
        </div>
        <div className="flex flex-top r-gap-10">
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>历史记录</S></div>
                <div className="remark f-18 padding-l-30 l-30"><S text='历史记录-description'>页面历史版本回滚，保存60天</S></div>
            </div>
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>数据视图</S></div>
                <div className="remark f-18 padding-l-30 l-30 min-h-60"><S text='数据视图-description'>支持丰富的数据表记录模板</S></div>
            </div>
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>页面分享</S></div>
                <div className="remark f-18 padding-l-30 l-30"><S text='页面分享-description'>支持分享至微信、微博、朋友圈</S></div>
            </div>
        </div>

        <div className="flex flex-top r-gap-10">
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>应用发布</S></div>
                <div className="remark f-18 padding-l-30 l-30"><S text='应用发布-description'>将协作空间发布成知识库、应用站点，支持自定义头部导航菜单</S></div>
            </div>
            {!config.isUS && <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>微信/Web Clipper剪藏</S></div>
                <div className="remark f-18 padding-l-30 l-30 min-h-60"><S>年内支持</S></div>
            </div>}
            <div className="w33">
                <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src={UrlRoute.getUrl('static/img/check.svg') } /><S>开放API</S></div>
                <div className="remark f-18 padding-l-30 l-30"><S>计划中</S></div>
            </div>
        </div>
    </div>
}