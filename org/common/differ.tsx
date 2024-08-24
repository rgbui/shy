import React from "react";
import { ChevronDownSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { S } from "rich/i18n/view";


export function DifferView() {
    return <div className="gap-h-30">
        <h3 className="flex-center shy-site-block-head gap-t-30"><S>诗云与其它产品区别</S></h3>

        <div className="border-top padding-t-10 padding-b-20">
            <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云为什么免费支持本地及私有云？
                </span>
                <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                    <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                </span>
            </div>
            <div className="remark f-16 l-24">
                我们坚信产品的最大价值在于广泛的使用。在不显著提高成本的前提下，我们乐意支持大家便捷使用诗云。
            </div>
        </div>

        <div className="border-top padding-t-10 padding-b-20">
            <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云为什么按量付费而不是按协作人数来收费？
                </span>
                <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                    <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                </span>
            </div>
            <div className="remark f-16 l-24">
                诗云采用按量付费而非按协作人数收费，因为每个人的使用情况不同。<br />
                按消耗付费，既公平又合理。
            </div>
        </div>
        <div className="border-top padding-t-10 padding-b-20">
            <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云能帮我做什么？
                </span>
                <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                    <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                </span>
            </div>
            <div className="remark f-16 l-24">
                诗云，一体化知识协作平台，提供灵活的<a href='https://shy.live/ws/help/page/240' target="_blank">构建块</a>，助你创造网络上的各种精美作品。它扩展办公领域，提升工作效率，以你的想象力为界。 <br />
                通过诗云，轻松打造个人互动交流、学习创作及商务往来的微型平台，自主经营。
                <br />
            </div>
        </div>
        <div className="border-top padding-t-10 padding-b-20">
            <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云协作与访客日活DAU(高峰）是什么？
                </span>

                <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                    <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                </span>

            </div>
            <div className="remark f-16 l-24" style={{ display: 'none' }}>
                协作与访客日活（DAU）衡量的是工作空间内每天的在线使用或访问人数。 <br />
                这一指标不仅体现了您对诗云的使用程度，也反映了您服务的客户规模。
            </div>
        </div>


        <div className="border-top padding-t-10 padding-b-20">
            <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">诗云与飞书有什么区别？</span>
                <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                    <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                </span>
            </div>
            <div className="remark f-16 l-24" style={{ display: 'none' }}>

                诗云和飞书都提供了沟通、协作和管理功能。 <br />
                诗云侧重于以消费者（粉丝）为中心的经营式协作办公，注重内容和服务的优先性。而飞书则更倾向于服务企业用户。<br />
                我们认为，对于个人和中小企业而言，围绕自己的客户（粉丝）提供更好的数字服务，增加收入才是最重要的。


            </div>
        </div>

        <div className="border-top padding-t-10 padding-b-20">
            <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云与WPS有什么区别？ 
                </span>
                <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                    <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                </span>
            </div>
            <div className="remark f-16 l-24" style={{ display: 'none' }}>
                诗云和WPS都提供文档、数据表和PPT等办公功能。
                <br />
                WPS适合于处理单一文档和满足基本的办公需求，而诗云则可以帮你直接开展办公业务、做生意。
            </div>
        </div>

        <div className="border-top padding-t-10 padding-b-20">
            <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云与Notion有什么区别？
                </span>
                <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                    <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                </span>
            </div>
            <div className="remark f-16 l-24" style={{ display: 'none' }}>
                notion是知识管理工具，诗云是知识协作工具。  <br />
                知识不仅仅是记录，还在于分享、交流、学习与实践。 <br />
                现在，构建你的网络交流圈，连接知识与见解
            </div>
        </div>

        <div className="border-top padding-t-10 padding-b-20">
            <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云与印象笔记有何区别？
                </span>
                <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                    <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                </span>
            </div>
            <div className="remark f-16 l-24" style={{ display: 'none' }}>
                诗云与印象笔记均精通于信息的快速记录与整理。<br />
                个人成长不仅依靠知识积累，更在于沟通、交流、学习与实践。
                <br />使用诗云，您可以构建一个学习社群，如同课堂一般，既可静心写作，也能与同伴热烈交流。
            </div>
        </div>



        <div className="border-top padding-t-10 padding-b-20">
            <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云的独立域名及独立app指什么？
                </span>
                <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                    <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                </span>
            </div>
            <div className="remark f-16 l-24" style={{ display: 'none' }}>
                您可以使用独立域名建立站点，发布专属应用，并根据个人喜好定制网站和应用，以便更好地进行商业化运营。
            </div>
        </div>

        <div className="border-top padding-t-10 padding-b-20">
            <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云是如何使用AI大模型的？
                </span>
                <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                    <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                </span>
            </div>
            <div className="remark f-16 l-24" style={{ display: 'none' }}>
                诗云集成更多的国内AI大模型，寻找最有性价比的AI大模型。支持更好的AI写作、创作、检索、推荐、分析、统计等功能。
            </div>
        </div>

    </div>
}