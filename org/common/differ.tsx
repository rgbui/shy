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
            <div className="remark f-14 l-24">
                我们认为产品最大价值在于更多的人使用它。在不大幅增加成本的情况下，我们很乐意的去支持大家对诗云的使用。
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
            <div className="remark f-14 l-24">
                我们认为按协作人数收费并不公平，每个人使用量不一样。 <br />
                依据自已的消耗来付费，这样更公平，也更合理。
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
            <div className="remark f-14 l-24">
                诗云是一个一体化知识协作工作台，诗云的<a href='https://shy.live/ws/help/page/240' target="_blank">构建块</a>可以让你十分灵活的构建所有网上美丽事物... <br />
                诗云是一个围绕信息内容与人协作的工作台，诗云在不断的拓宽你的办公边界，增强你的办公能力，你的想象力是我们的边界...<br />
                您可以用它构建网站、应用、文档、表格、PPT、视频、音频、图片、图表、问卷、投票、课程、考试、商城、社区、博客、论坛、电子书、知识库、工作流、CRM、ERP、OA、BI、AI等等。
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
            <div className="remark f-14 l-24" style={{ display: 'none' }}>
                协作与访客日活（DAU）是指在一个工作空间里，每天有多少人在线使用或访问。 <br />
                这个指标不仅反应您对诗云的使用量，也反应了您们服务的客户量。
            </div>
        </div>


        <div className="border-top padding-t-10 padding-b-20">
            <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">诗云与飞书有何区别？</span>
                <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                    <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                </span>
            </div>
            <div className="remark f-14 l-24" style={{ display: 'none' }}>

                诗云和飞书都提供了沟通、协作和管理功能。 <br />
                诗云侧重于以消费者（粉丝）为中心的经营式协作办公，注重内容和服务的优先性。而飞书则更倾向于服务企业用户。<br />
                我们认为，对于个人和中小企业而言，围绕自己的客户（粉丝）提供更好的数字服务，增加收入才是最重要的。


            </div>
        </div>

        <div className="border-top padding-t-10 padding-b-20">
            <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云与WPS有何区别？
                </span>
                <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                    <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                </span>
            </div>
            <div className="remark f-14 l-24" style={{ display: 'none' }}>
                诗云和WPS都提供文档、数据表和PPT等办公功能。
                <br />
                WPS适合于处理单一文档和满足基本的办公需求，而诗云则可以帮你直接开展办公业务、做生意。
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
            <div className="remark f-14 l-24" style={{ display: 'none' }}>
                诗云和印象笔记都擅长快速记录和整理信息。
                <br />一个人的成长不仅仅依赖于知识的积累，更在于沟通、交流、学习及实践。 <br />
                您可以用诗云搭建一个学习的圈子，就像课堂一样，不仅能安静的写作，还能与同学热烈讨论。
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
            <div className="remark f-14 l-24" style={{ display: 'none' }}>
                您可以用独立域名来搭建站点。<br />
                您可以发布独立的应用程序。<br />
                您可以按照自己的喜好来定制网站和应用，您可以更好开展商业化运营。
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
            <div className="remark f-14 l-24" style={{ display: 'none' }}>
                诗云集成更多的国内AI大模型，寻找最有性价比的AI大模型。支持更好的AI写作、创作、检索、推荐、分析、统计等功能。
            </div>
        </div>

    </div>
}