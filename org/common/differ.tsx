import React from "react";
import { ChevronDownSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { S} from "rich/i18n/view";


export function DifferView() {
    return <div className="gap-h-30">
        <h3 className="flex-center shy-site-block-head gap-t-30"><S>诗云与其它产品区别</S></h3>
        <div className="border-top padding-h-10">
            <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云为什么免费支持本地及私有云？
                </span>
                <Icon style={{ transform: 'rotate(0deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
            </div>
            <div className="remark f-14 l-24">
                我们认为产品最大价值在于更多的人使用它。在不给我们增加成本的情况下，我们很乐意的去支持大家对诗云的使用。
            </div>
        </div>

        <div className="border-top padding-h-10">
            <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云为什么按量付费而不是按协作人数来收费？
                </span>
                <Icon style={{ transform: 'rotate(0deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
            </div>
            <div className="remark f-14 l-24">
                我们认为按协作人数收费并不公平，因为人数并不直接反映使用量，你在花冤枉钱。我们希望用户可以根据自己的实际需求来付费，这样更公平，也更合理。
            </div>
        </div>
        <div className="border-top padding-h-10">
            <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云能帮我做什么？
                </span>
                <Icon style={{ transform: 'rotate(0deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
            </div>
            <div className="remark f-14 l-24">
                我们也一直在思考，我们想要打造什么样的产品。
                <br />
                我们觉得互联网就像一个巨大的知识宝库，为什么我们不能开发一个强大的知识协作工具，帮助大家构建自己的知识网络呢？ <br />
                我们的日常工作几乎离不开手机和电脑。我们正在开发的办公软件，为什么不能让大家根据自己的需求来办公，开展自己的业务，甚至经营自己的小生意呢？这些都是我们想要探索的方向。
            </div>
        </div>
        <div className="border-top padding-h-10">
            <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云日活DAU(高峰）是什么？
                </span>
                <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
            </div>
            <div className="remark f-14 l-24"  style={{display:'none'}}>
                日活（DAU）是指一个工作空间里，每天有多少用户在使用。 <br />
                这个指标可以反映您们对诗云的使用情况，也反映了您们服务的客户流星。
                指标越大，说明您们的使用频度高，服务的客户更多，诗云给你们带来的价值也更大。
                <br />
                日活DAU(高峰）是指每月最高日活用户数，主要用于诗云计费标准。
            </div>
        </div>


        <div className="border-top padding-h-10">
            <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">诗云与飞书有何区别？</span>
                <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
            </div>
            <div className="remark f-14 l-24" style={{display:'none'}}>

                诗云和飞书都提供了沟通、协作和管理功能。 <br />
                诗云更侧重于以消费者（粉丝）为中心的经营式协作办公，注重内容和服务的优先性。而飞书则更倾向于服务企业用户。
                我们认为，对于个人和中小企业而言，围绕自己的客户（粉丝）提供更好的数字服务，增加收入才是最重要的。
                <br />

                诗云不像飞书那样提供大量的OA套件，用户真正用好的又有多少。 诗云提供了一套灵活可组合的‘构建块’，让用户能够像拼搭积木一样，根据自身需求灵活构建个性化的办公流。这种模式鼓励大家积极参与创新，通过实践不断探索和调整，以适应不断变化的企业需求。
                先进企业先用诗云，自已实践的才是最好的。

            </div>
        </div>

        <div className="border-top padding-h-10">
            <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云与WPS有何区别？
                </span>
                <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
            </div>
            <div className="remark f-14 l-24"  style={{display:'none'}}>
                诗云和WPS都提供文档、数据表和PPT等办公功能。WPS特别适合于处理单一文档和满足基本的办公需求，而诗云则更擅长于知识协作和知识共享，它不仅注重内容的生产，还强调内容的传播与消费。
            </div>
        </div>

        <div className="border-top padding-h-10">
            <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云与印象笔记有何区别？
                </span>
                <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
            </div>
            <div className="remark f-14 l-24"  style={{display:'none'}}>
                诗云和印象笔记都擅长快速记录和整理信息，但诗云更胜一筹，不仅支持写作，还支持绘图创作，并着重于知识沟通和协作。
                <br />一个人的成长不仅仅依赖于知识的积累，更在于沟通、交流、学习及实践。因此，我们希望能支持大家搭建一个自已学习氛围的圈子，就像课堂，不仅能安静做作业，还能热烈讨论。
            </div>
        </div>



        <div className="border-top padding-h-10">
            <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云的独立域名及独立app指什么？
                </span>
                <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
            </div>
            <div className="remark f-14 l-24" style={{display:'none'}}>
                我们允许您使用自己的独立域名来搭建个人站点，并且支持您发布独立的应用程序。除了诗云账号之外，您可以完全按照自己的喜好来定制网站和应用，这样可以帮助您更好地商业化运营。
            </div>
        </div>

        <div className="border-top padding-h-10">
            <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                <span className="flex-auto">
                    诗云是如何使用AI大模型的？
                </span>
                <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
            </div>
            <div className="remark f-14 l-24" style={{display:'none'}}>
                我们集成更多的国内AI大模型，帮大家寻找最有性价比的AI大模型。让大家有更多的选择性，支持更好的AI写作、创作、检索、推荐、分析等功能。
            </div>
        </div>

    </div>
}