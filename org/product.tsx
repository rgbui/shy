import React from "react";
import { ArrowRightSvg, BoardToolFrameSvg, CheckSvg, CollectTableSvg, DocCardsSvg, PageSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
/***
 * 
 * 讲清楚
 * 1. 诗云是什么
 * 2. 诗云有那些功能特性
 * 3. 诗云能做什么
 * 4. 用户使用诗云的流程
 * 5. 诗云的价格
 * 6. 与其它产品相比的优势
 * 7. 有那些公司在用
 * 8. 有那些用户在用
 * 9. 诗云产品的价值（价值主张，逻辑自恰）
 * 10. 最后劝服用户，你来试用吧。
 * 页面效果
 * 1. 突出动态性，强调诗云的时实性
 * 2. 突出参与性，要有很多人参与使用的氛围感
 * 3. 突出专业性，就是编辑器的那种专业感设计
 * 4. 官网看起来了是完整的，有清晰叙事路线脉络
 * 
 * 
 * 当前问题：
 * 用户使用的价值流程不清晰
 * 没有动态实时性，动图太少
 * 没有很强的参与感
 * 编辑器的专业感不够
 * 前后看起来没有逻辑自恰，很难有很强的说服力
 * 
 */
export function ProductView() {
    return <div className="padding-t-60">
        <div className="shy-site-block">
            <div>
                <div className="padding-t-50 relative">
                    <h1 className="flex-center " style={{ fontSize: '72px' }}>知识<span>社区协作</span>生产力工具</h1>
                    <p className="flex-center remark" style={{ fontSize: '24px', display: 'none' }}>全新的人机协作、自由创作、灵活经营专属于自已的产品、项目、设计、自媒体等知识社区</p>
                    <p className="flex-center remark text-center" style={{ fontSize: '24px' }}>
                        以文稿编辑的方式，配合沟通社交和AI机器人，为个人及团队提供
                        <br />
                        一站式社区协作平台，服务好自已的受众群体
                    </p>
                    <p className="flex-center gap-h-10">
                        <a href="https://shy.live/sign/in"
                            className="text-white bg-primary bg-primary-hover cursor round-8 padding-h-15 padding-w-30   flex"
                            style={{ fontSize: '20px' }}
                        ><span className="gap-r-10">免费使用</span>
                            <Icon icon={ArrowRightSvg}></Icon>
                        </a>
                    </p>
                    <p className="flex-center remark" style={{ fontSize: 16 }}>积累知识，沉淀关系，做自已的小生意，赚自已的小钱钱</p>
                    <div className="gap-h-30 flex-center">
                        <img style={{ border: '8px solid #000', width: '80%' }} className="border round-16 obj-center " src="https://static.shy.live/static/img/pic.png" />
                    </div>
                    <div className="pos" style={{ width: 400, height: 387, right: -30, top: 580 }}>
                        <div className="pos" style={{ borderRadius: 8, width: 170, height: 340, overflow: 'hidden', top: 30, left: 116, zIndex: 3 }}>
                            <img src='static/img/mobile-content.png' className="w100" />
                        </div>
                        <img className="w-400 pos" style={{ top: 0, left: 0, zIndex: 2 }} src='static/img/mobile.png' />
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block ">

            <div className="padding-h-50">
                <h2 className="flex-center gap-t-40" style={{ fontSize: 36 }}><span className="bold">文档&nbsp;数据表&nbsp;白板&nbsp;PPT</span></h2>
                <div className="flex-center gap-h-20 remark" style={{ fontSize: 24 }}>
                    你的一体化知识系统，高度融合写作、计划、绘图、表达，释放你的创造力。
                </div>

                <div className="flex-full r-padding-l-20 r-padding-t-20 r-w50">

                    <div className="shy-site-block-card gap-r-10">

                        <div className="flex r-gap-r-10" style={{ color: "rgb(42, 157, 153)" }} ><Icon size={48} icon={PageSvg}></Icon><span style={{ fontSize: 40 }}>文档</span></div>
                        <div className="text-1 f-14 l-20 gap-t-10" >
                            简单 强大 美丽的乐高积木式<br />
                            使用灵活的内容块 <br />
                            更有效的进行协作编辑
                        </div>

                        <div className="padding-t-20">
                            <img className="w100 h-300 round obj-center" src='static/img/doc.png' />
                        </div>

                    </div>

                    <div className="shy-site-block-card gap-r-10">
                        <div className="flex r-gap-r-10" style={{ color: 'rgb(37, 79, 173)' }}><Icon size={48} icon={CollectTableSvg}></Icon><span style={{ fontSize: 40 }}>数据表</span></div>
                        <div className="text-1 f-14 l-20  gap-t-10" >
                            自定义数据流，按需定制你的专属业务系统。
                            <br />
                            丰富组件、灵活搭建
                            <br />
                            管理任何类型的项目，无论团队或规模如何。
                        </div>
                        <div className="flex-end padding-t-20">
                            <img className="w100  h-300   round  obj-center" src='static/img/database.png' />
                        </div>
                    </div>

                </div>

                <div className="gap-h-20 flex-full  r-padding-l-20 r-padding-t-20  r-w50">

                    <div className="shy-site-block-card gap-r-10">
                        <div className="flex r-gap-r-10" style={{ color: 'rgb(157, 52, 218)' }}><Icon size={48} icon={{ name: 'bytedance-icon', code: 'enter-the-keyboard' }}></Icon><span style={{ fontSize: 40 }}> 白板</span></div>
                        <div className="text-1 f-14 l-20 gap-t-10" >
                            无限画布，无限创意<br />
                            开创性地一起思考、计划和创造<br />
                            将您的想法变为现实
                        </div>
                        <div className="flex-end padding-t-20">
                            <img className="w100  h-300  round  obj-center" src='static/img/board.png' />
                        </div>
                    </div>

                    <div className="shy-site-block-card gap-r-10">
                        <div className="flex r-gap-r-10" style={{ color: "#ff76ad" }}><Icon size={48} icon={DocCardsSvg}></Icon><span className="f-40 text-linear-gradient">宣传页</span></div>
                        <div className="text-1 f-14 l-20 gap-t-10" >
                            精美优雅 新一代幻灯片PPT<br />
                            简洁、直观、互动 且品牌化 <br />
                            超越文字和无聊的剪贴画的墙壁。
                        </div>
                        <div className="flex-end padding-t-20">
                            <img className="w100  h-300  round obj-center" src='static/img/ppt.png' />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">

                <h2 className="flex-center bold  gap-t-40" style={{ fontSize: 36 }}>
                    实时沟通和互动
                </h2>

                <div className="flex-center gap-t-10 gap-b-40 remark" style={{ fontSize: 24 }}>输出你的影响力，自定义你的社交网络</div>
                <div className="flex flex-full">
                    <div className="w50 round-8 padding-14 shy-site-block-card bg-white gap-r-10">

                        <div className="flex r-gap-r-10" style={{ color: "var(--text-p-color)" }} ><Icon size={48} icon={BoardToolFrameSvg}></Icon><span style={{ fontSize: 40 }}>频道</span></div>
                        <div className="text-1 f-14 l-20 gap-t-10" >
                            使用 诗云 频道聊天，随时随地即时联系并保持互动<br />
                        </div>
                        <div className="padding-t-20">
                            <img className="w100 h-300 round obj-center" src='static/img/fr.png' />
                        </div>
                    </div>
                    <div className="w50 round-8 padding-14 shy-site-block-card bg-white gap-l-10">
                        <div className="flex r-gap-r-10" style={{ color: "#2aae67" }} ><Icon size={48} icon={{ name: 'bytedance-icon', code: 'friends-circle' }}></Icon><span style={{ fontSize: 40 }}>互动</span></div>
                        <div className="text-1 f-14 l-20 gap-t-10" >讨论、点赞、喜欢、投票、评论</div>
                        <div className="padding-t-20">
                            <img className="w100 h-300 round obj-center" src='static/img/tie.png' />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">
                <div className="flex">
                    <div className="flex-fixed">
                        <img className="min-300  max-w-600 obj-center  shy-site-block-card" src='static/img/cat.png' />
                    </div>
                    <div className="flex-auto gap-l-30">
                        <h3 className="shy-site-block-head">强大的模块化构建</h3>
                        <div className="remark f-20 l-30">
                            自由组合、无限表达、无限DIY
                            <br />
                            诗云适应您的需求。
                            <br />它可以是最小的，也可以是强大的，取决于您的需要。
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">

                <div className="flex">
                    <div className="flex-auto">
                        <h3 className="shy-site-block-head">多人协作</h3>
                        <div className="remark f-20 l-30">
                            全平台 实时性编辑
                            <br />
                            随时随地让协作更好的发生
                            <br />
                            在任何设备上吸引用户随处阅读
                        </div>
                    </div>
                    <div className="flex-fixed gap-l-30">
                        <img className="min-300  max-w-600 obj-center  shy-site-block-card" src='https://static.shy.live/static/img/pic.png' />
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">
                <div className="flex">
                    <div className="flex-fixed">
                        <img className="min-300  max-w-600 obj-center  shy-site-block-card" src='static/img/fr.png' />
                    </div>
                    <div className="flex-auto gap-l-30">
                        <h3 className="shy-site-block-head">社群</h3>
                        <div className="remark f-20 l-30">
                            可控的权限，成员角色、互动、社交
                            <br />
                            让社群更好的运营

                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div className="shy-site-block" >
            <div className="padding-h-50">
                <h3 className="shy-site-block-head flex-center gap-b-40">丰富的功能性，助你协作事半功倍</h3>
                <div className="flex flex-top r-gap-10">
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />Markdown语法</div>
                        <div className="remark f-18 padding-l-30 l-30">支持Markdown语法的键入输入</div>
                    </div>
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />数学公式</div>
                        <div className="remark f-18 padding-l-30 l-30 min-h-60">支持Latex公式</div>
                    </div>
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />时实更新</div>
                        <div className="remark f-18 padding-l-30 l-30">多个文档展示同一信息，一处更新，全局时实同步</div>
                    </div>

                </div>
                <div className="flex flex-top r-gap-10">
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />大纲</div>
                        <div className="remark f-18 padding-l-30 l-30 min-h-60">组织页面大纲结构</div>
                    </div>
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />双链</div>
                        <div className="remark f-18 padding-l-30 l-30">支持页面关系相互引用</div>
                    </div>
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />标签</div>
                        <div className="remark f-18 padding-l-30 l-30">支持页面标签索引</div>
                    </div>
                </div>

                <div className="flex flex-top r-gap-10">
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />关键词搜索</div>
                        <div className="remark f-18 padding-l-30 l-30">基于Elasticsearch服务搜索</div>
                    </div>
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />语义搜索</div>
                        <div className="remark f-18 padding-l-30 l-30 min-h-60">基于空间知识库的AI机器人语义搜索</div>
                    </div>
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />自定义按钮工作流</div>
                        <div className="remark f-18 padding-l-30 l-30">自定义页面的按钮点击事件</div>
                    </div>
                </div>

                <div className="flex flex-top r-gap-10">
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />角色权限控制</div>
                        <div className="remark f-18 padding-l-30 l-30">支持设置不同的角色页面权限访问</div>
                    </div>
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />自定义表单收集</div>
                        <div className="remark f-18 padding-l-30 l-30 min-h-60">支持自定义数据表的表单</div>
                    </div>
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />页面点评、点赞等</div>
                        <div className="remark f-18 padding-l-30 l-30">支持页面的点评、点赞、打赏</div>
                    </div>
                </div>
                <div className="flex flex-top r-gap-10">
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />历史记录</div>
                        <div className="remark f-18 padding-l-30 l-30">页面历史版本回滚，保存60天</div>
                    </div>
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />数据视图</div>
                        <div className="remark f-18 padding-l-30 l-30 min-h-60">支持丰富的数据表记录模板</div>
                    </div>
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />页面分享</div>
                        <div className="remark f-18 padding-l-30 l-30">支持分享至微信、微博、朋友圈</div>
                    </div>
                </div>

                <div className="flex flex-top r-gap-10">
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />应用发布</div>
                        <div className="remark f-18 padding-l-30 l-30">将协作空间发布成知识库、应用站点，支持自定义头部导航菜单</div>
                    </div>
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />微信/Web Clipper剪藏</div>
                        <div className="remark f-18 padding-l-30 l-30 min-h-60">年内支持</div>
                    </div>
                    <div className="w33">
                        <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />开放API</div>
                        <div className="remark f-18 padding-l-30 l-30">计划中</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block" style={{ display: 'none' }}>
            <div className="padding-h-50">
                <h3 className="flex-center" style={{ fontSize: '30px' }}>他们都在用诗云</h3>
                <div className="flex-center remark f-12 gap-h-20">（*排名不分先后顺序）</div>
                <div className="flex r-gap-w-20 r-gap-h-10 r-w-180 flex-center flex-wrap">
                    <img src='static/img/org/tsinghua.png' />
                    <img src='static/img/org/cpic.png' />
                    <img src='static/img/org/fl1.png' />
                    <img src='static/img/org/logo_beijing.png' />
                    <img src='static/img/org/mo1.png' />
                    <img src='static/img/org/nju.png' />
                    <img src='static/img/org/pa1.png' />
                    <img src='static/img/org/xm1.png' />
                    <img src='static/img/org/logo_xunfei.png' />
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50 flex ">
                <div className="flex-auto">
                    <h3 className="shy-site-block-head">AI 写作，佳文立现</h3>
                    <div className="remark f-20 l-30">
                        您可以在一分钟内完善和自定义工作文档、演示文稿。
                        <br />
                        即开即用、灵感自动产生
                        <br />文章一键生成、创作领先一步
                    </div>
                </div>
                <div className="flex-fixed  gap-l-30">
                    <video title="ai gen mp4" style={{ maxWidth: 600 }} width="100%" height="56.25%"
                        muted={true} loop={true} autoPlay={true} controls={false}
                    // poster="https://sanity-images.imgix.net/production/b7f2a0a42e872c4c29b78ceb086b4937e1d6a226-1040x1000.png?h=450&amp;dpr=2&amp;w=&amp;auto=format%2Ccompress"
                    ><source
                            src="static/img/ai-gen.mp4"
                            type="video/mp4" />
                    </video>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50 flex">

                <div className="flex-fixed">
                    <video title="ai gen mp4" style={{ maxWidth: 600 }} width="100%" height="56.25%"
                        muted={true} loop={true} autoPlay={true} controls={false}
                    // poster="https://sanity-images.imgix.net/production/b7f2a0a42e872c4c29b78ceb086b4937e1d6a226-1040x1000.png?h=450&amp;dpr=2&amp;w=&amp;auto=format%2Ccompress"
                    ><source
                            src="static/img/ai-fix.mp4"
                            type="video/mp4" />
                    </video>
                </div>

                <div className="flex-auto gap-l-30">
                    <h3 className="shy-site-block-head">AI机器人</h3>
                    <div className="remark f-20 l-30">
                        基于知识库，构建自已的AI机器人
                        <br />
                        人机协作，生产更高效
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">
                <h3 className="flex-center gap-h-20  shy-site-block-head">
                    <span>多场景覆盖应用</span>
                    <a className="remark gap-l-10" href='https://template.shy.live' style={{ fontSize: 14, textDecoration: 'underline' }}>更多模板</a>
                </h3>
                <div className="flex-center f-16 gap-b-10 r-cursor  shy-site-tab-items r-padding-w-10 r-gap-w-5 r-padding-h-5 r-round r-item-hover">
                    <span className="item-hover-focus">私域好帮手</span>
                    <span>知识社区圈子</span>
                    <span>共创社区</span>
                    <span>小米社区</span>
                </div>
                <div>
                    <img className="shy-site-block-card w100 obj-center" src='static/img/tie.png' />
                    <img style={{ display: 'none' }} className="shy-site-block-card w100 obj-center" src='static/img/board.png' />
                    <img style={{ display: 'none' }} className="shy-site-block-card w100 obj-center" src='static/img/doc.png' />
                    <img style={{ display: 'none' }} className="shy-site-block-card w100 obj-center" src='static/img/database.png' />
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50 ">
                <h3 className="flex-center shy-site-block-head">
                    定价方案
                </h3>
                <div className="flex-center remark" style={{ fontSize: 24 }}>简单而美的收费，用户是我们的朋友</div>
                <div className="flex-center-full r-padding-30 r-round-8 r-bg-white gap-t-20">
                    <div className="gap-r-20 w33 r-gap-b-10 shy-site-block-card" >
                        <div className=" shy-site-block-head flex r-gap-r-10" style={{ fontSize: 28 }}><img src='static/img/local.svg' /><span>本地及私有化免费</span></div>
                        <div className=" f-14 text-1">适用于本地数据安全、敏感的用户。<br />支持自搭服务器，数据自主管理。</div>
                        <div className=" bold" style={{ fontSize: 20 }}>信任</div>
                        <div className=" f-14 text-1 flex"><Icon icon={CheckSvg} className={'gap-r-10'} size={12}></Icon>无功能限制、无广告、无歧视</div>
                        <div className=" f-14 text-1 flex"><Icon icon={CheckSvg} className={'gap-r-10'} size={12}></Icon>局域网及自建服务器仍然支持多人协作</div>
                        <div className=" f-14 text-1 flex"><Icon icon={CheckSvg} className={'gap-r-10'} size={12}></Icon>安装<a href='https://shy.live/download' style={{ color: 'inherit', textDecoration: 'underline' }}>诗云服务端</a>，安装在那里，数据存那里</div>
                        <div className=" f-14 text-1 flex"><Icon icon={CheckSvg} className={'gap-r-10'} size={12}></Icon>我们想让更多的人用上诗云，仅此而已</div>
                        <div className=" flex gap-t-20"><a className="padding-w-14 padding-h-5 round-8 cursor text-white" style={{ background: '#0BDCC0' }} href='https://shy.live/price'>了解详情</a></div>
                    </div>
                    <div className="gap-l-20 w33 r-gap-b-10 shy-site-block-card">
                        <div className=" shy-site-block-head flex  r-gap-r-10" style={{ fontSize: 28 }} ><img src='static/img/online.svg' /><span>云端按量计费</span></div>
                        <div className=" f-14 text-1">适用于云端协作办公。<br />为个人及团队的生产效率、社区协作而买单。</div>
                        <div className=" bold" style={{ fontSize: 20 }}>承诺</div>
                        <div className=" f-14 text-1 flex" >
                            <Icon className={'gap-r-10'} icon={CheckSvg} size={12}></Icon>生产力是一种云资源，用多少收多少
                        </div>
                        <div className=" f-14 text-1 flex"><Icon className={'gap-r-10'} icon={CheckSvg} size={12}></Icon>不限功能、不限人数、不限空间</div>
                        <div className=" f-14 text-1 flex"><Icon className={'gap-r-10'} icon={CheckSvg} size={12}></Icon>无会员，无超级会员，无广告、无套路</div>
                        <div className=" f-14 text-1 flex"><Icon className={'gap-r-10'} icon={CheckSvg} size={12}></Icon>无乱收费，按量计费的标准参照云服务商</div>
                        <div className=" flex  gap-t-20"><a className="padding-w-14 padding-h-5 round-8 cursor text-white bg-primary bg-primary-hover" href='https://shy.live/price'>了解详情</a></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block bg-4" style={{ display: 'none' }}>
            <div className="padding-h-50">
                <h3 className="flex-center shy-site-block-head" style={{ fontSize: 32 }}>越来越多的用户正在使用 <span className="text-primary">诗云</span></h3>
                <div className="flex flex-full r-gap-w-10">
                    <div className="w33 r-gap-b-10">
                        <div className="round-8 shy-site-block-card">
                            <div className="flex padding-14">
                                <div className="flex-fixed size-60 gap-r-10"><img className='circle w100 h100 obj-center' src='static/img/user/user.png' /></div>
                                <div className="flex-auto">
                                    <div className="bold gap-h-10">马强</div>
                                    <div>草花互动 合伙人</div>
                                </div>
                            </div>
                            <div className="padding-w-14 padding-b-14">
                                我用过的笔记工具最终都变成了信息搜集箱，而真要提取知识获取灵感的时候依然束手无措。诗云是真正让我有欲望整理我的信息的网状笔记工具，离完美一步之遥！
                            </div>
                        </div>

                        <div className="round-8 shy-site-block-card">
                            <div className="flex padding-14">
                                <div className="flex-fixed size-60 gap-r-10"><img className='circle w100 h100 obj-center' src='static/img/user/user.png' /></div>
                                <div className="flex-auto">
                                    <div className="bold gap-h-10">马强</div>
                                    <div>草花互动 合伙人</div>
                                </div>
                            </div>
                            <div className="padding-w-14 padding-b-14">
                                诗云解决了我在工作中遇到的信息孤岛问题，可以预见，未来基于诗云的信息组织能力在非常多的场景中进行协同，可以产生巨大的威力！
                            </div>
                        </div>

                        <div className="round-8 shy-site-block-card">
                            <div className="flex padding-14">
                                <div className="flex-fixed size-60 gap-r-10"><img className='circle w100 h100 obj-center' src='static/img/user/user.png' /></div>
                                <div className="flex-auto">
                                    <div className="bold gap-h-10">马强</div>
                                    <div>草花互动 合伙人</div>
                                </div>
                            </div>
                            <div className="padding-w-14 padding-b-14">
                                使用诗云的三个月正好覆盖了我初探科研破除迷雾的历程，而陪伴我走来的正是在诗云记录的一篇篇论文笔记，一个个灵光乍现的idea，还有最重要的将知识连接起来的页面关系图，希望这些被红线连接的知识树叶能在明年结出“ACCEPT”的果实！
                            </div>
                        </div>

                    </div>
                    <div className="w33 r-gap-b-10">
                        <div className="round-8 shy-site-block-card">
                            <div className="flex padding-14">
                                <div className="flex-fixed size-60 gap-r-10"><img className='circle w100 h100 obj-center' src='static/img/user/user.png' /></div>
                                <div className="flex-auto">
                                    <div className="bold gap-h-10">马强</div>
                                    <div>草花互动 合伙人</div>
                                </div>
                            </div>
                            <div className="padding-w-14 padding-b-14">
                                记录的作用不在于记录行为本身，而是对未来的可检索性、可连接性与可启发性。我用诗云记录当下的灵感、思考与数据，用诗云启发与重建未来的思考与创造。诗云，让笔记回归本质。
                            </div>
                        </div>
                        <div className="round-8 shy-site-block-card">
                            <div className="flex padding-14">
                                <div className="flex-fixed size-60 gap-r-10"><img className='circle w100 h100 obj-center' src='static/img/user/user.png' /></div>
                                <div className="flex-auto">
                                    <div className="bold gap-h-10">马强</div>
                                    <div>草花互动 合伙人</div>
                                </div>
                            </div>
                            <div className="padding-w-14 padding-b-14">
                                作为未来的航天工作者，日常科研任务中经常需要用到跨学科技术，诗云的双向链接帮助我有效建立网状知识库，相比传统线性知识管理更有助于交叉学科知识的有机链接，帮助科研任务中的多维度思考。
                            </div>
                        </div>
                        <div className="round-8 shy-site-block-card">
                            <div className="flex padding-14">
                                <div className="flex-fixed size-60 gap-r-10"><img className='circle w100 h100 obj-center' src='static/img/user/user.png' /></div>
                                <div className="flex-auto">
                                    <div className="bold gap-h-10">马强</div>
                                    <div>草花互动 合伙人</div>
                                </div>
                            </div>
                            <div className="padding-w-14 padding-b-14">
                                我使用诗云做大量日常课业、科研、社工、社团、支教等等记录；同时由于工作原因，我需要一个几乎什么内容都可以往里写、输入快捷、方便整理与演示、可云同步的笔记平台，最令我满意的就是诗云。
                            </div>
                        </div>
                    </div>
                    <div className="w33 r-gap-b-10">
                        <div className="round-8 shy-site-block-card">
                            <div className="flex padding-14">
                                <div className="flex-fixed size-60 gap-r-10"><img className='circle w100 h100 obj-center' src='static/img/user/user.png' /></div>
                                <div className="flex-auto">
                                    <div className="bold gap-h-10">马强</div>
                                    <div>草花互动 合伙人</div>
                                </div>
                            </div>
                            <div className="padding-w-14 padding-b-14">
                                记录的作用不在于记录行为本身，而是对未来的可检索性、可连接性与可启发性。我用诗云记录当下的灵感、思考与数据，用诗云启发与重建未来的思考与创造。诗云，让笔记回归本质。
                            </div>
                        </div>
                        <div className="round-8 shy-site-block-card">
                            <div className="flex padding-14">
                                <div className="flex-fixed size-60 gap-r-10"><img className='circle w100 h100 obj-center' src='static/img/user/user.png' /></div>
                                <div className="flex-auto">
                                    <div className="bold gap-h-10">马强</div>
                                    <div>草花互动 合伙人</div>
                                </div>
                            </div>
                            <div className="padding-w-14 padding-b-14">
                                作为未来的航天工作者，日常科研任务中经常需要用到跨学科技术，诗云的双向链接帮助我有效建立网状知识库，相比传统线性知识管理更有助于交叉学科知识的有机链接，帮助科研任务中的多维度思考。
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div className="shy-site-block ">
            <div className="padding-h-50">
                <h3 className="flex-center shy-site-block-head" >基于网络进行大规模的社区化协作服务</h3>
                <div className="remark gap-h-30 f-24 flex-center text-center">
                    如何让每个协作者拿到属于自已的那一份利益
                </div>

                <div className="shy-site-block-card padding-14">
                    <div className="r-gap-w-20 gap-h-30 flex">
                        <div className="flex-auto">
                            <div className="flex f-30  gap-t-10"  >
                                <img style={{ marginLeft: -10 }} className="size-50 obj-center" src='static/img/community.svg' />社区化协作
                            </div>
                            <div className="flex f-14 remark  l-24">
                                我们电脑、手机上的app都属于信息应用系统，使用各种app就是为了更高效的协作办公。<br />
                                诗云提供基于文稿编辑信息的方式，实时构建我们自已的信息网络来服务我们的受众群体<br />
                                让我们做自已的小生意，赚自已的小钱钱，它不香嘛<br />
                            </div>
                        </div>
                    </div>
                    <div className="r-gap-w-20 gap-h-30 flex">
                        <div className="flex-auto">
                            <div className="flex f-30 gap-t-10 r-gap-r-3">
                                <img className="size-40 obj-center" src='static/img/block-chain.svg' />
                                区块链
                            </div>
                            <div className="flex f-14 remark l-24">
                                从数据存储到网络交易，基于区块链，安全看的见，利益有保障<br />
                                每一个网络参与者所产生的信息及达成的共识，都具有不可篡改，可追溯，可维权，具有法律效力
                            </div>
                        </div>
                        <div className="flex-full w-600 shy-site-block-card padding-14">
                            <div className="w50 padding-10">
                                <div className="flex f-18 r-gap-r-10"><img className="size-24 obj-center" src='static/img/store.svg' />小链</div>
                                <div className="flex remark l-30 f-14  ">
                                    诗云服务端内置区块链<br />
                                    用户对自已的日常行为数据进行私钥签名
                                </div>
                            </div>
                            <div className="w50 padding-10 ">
                                <div className="flex f-18  r-gap-r-10"><img className="size-24 obj-center" src='static/img/list-chain.svg' />大链</div>
                                <div className="flex  remark l-30 f-14 ">
                                    诗云客户端内置区块链<br />
                                    同步链上帐本，可查看、可验证
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div className="shy-site-block bg-gray-white" >

            <div className="padding-h-50">
                <div className="flex-center">
                    <img className=" w-400 obj-center" src='static/img/read-book.svg' />
                </div>
                <h3 className="shy-site-block-head flex-center">
                    诗云-知识社区协作生产力工具
                </h3>
                <div className="flex-center remark f-24 text-center l-30"  >
                    互联协作，创见未来
                </div>
                <div className="flex-center gap-h-20">
                    <a href='/sign/in' className="inline-block text-white bg-primary bg-primary  f-20 cursor round-8 padding-h-10 padding-w-30 "
                    >加入诗云</a>
                </div>
            </div>


        </div>

        <div style={{ display: 'none' }}>

            <div className="flex-center" style={{ fontSize: '30px' }} >
                社区经济
            </div>
            <div>
                我们电脑、手机90%以上的应用都属于信息系统，使用各种app就是为了更高效的工作办公。
                为什么不能基于文档编辑的方式实时的构建自已的信息系统
                我们在尝试解决这方面的问题
                我们希望让应用的构建成本降下来，降到编辑文档那样。
                我们希望让大家可以用一种低成本、很灵活的方式构建自已的社区网络来服务自已的受众群体
                让大家做自已的小生意，赚自已的小钱钱，这是一种很自由很美好的生活，不是吗
            </div>
            无论是个体还是团队，都需要专属于我们自已的数字花园<br />来服务自已的受众群体
            笔记整理成知识，知识构建社区，社区提供服务
            <div>
                AI 表达想法的新媒介。
                由人工智能提供支持。
                开始写作吧。美丽、引人入胜的内容，无需任何格式化和设计工作。
            </div>
            <div className="flex">
                <div className="flex-fixed">
                    <div style={{ fontSize: '36px' }}>无限可能、无限创作</div>
                    <div>支持 <span className="bold">文档、数据表、白板、PPT</span> 四大文稿类型</div>
                    <div>万物皆可"模块化"编辑、相互融合、自由组合、随心所欲、灵活搭建，解锁无限无能</div>
                </div>
                <div className="flex-auto">
                </div>
            </div>
            模块化编辑，自由组合
            基于乐高积木式的各种内容块，灵活搭建我们的知识世界
            <div>
                <span>笔记</span>
                <span>知识库</span>
                <span>社区</span>
            </div>
            从写作开始输出您的影响力
            写作输出影响力
            您只是把数据托管在我们的云端，
            它是您的数据，我们不会使用您的数据
            也不会把您的数据分享给第三方
            您搭建的数字化空间，完全属于您自己
            数字化空间产生的收益也完全属于您自已
            <p className="flex-center">
                人机协作经营自已的小社区，在这个小社区里创作、治理、营收、数据全归各位所拥有
            </p>
            <div>
                版本历史。 轻松跟踪修订之间的更改，每个注释都有一年的版本历史记录。
            </div>
            <div>
                你的想法就是你的。
                诗云 在您的设备上存储笔记，因此您可以快速访问它们，甚至可以离线访问。没有人能读懂它们，甚至我们也不能
            </div>
            <div>
                以用户驱动，以和用户链接为核心方式，以内容为核心载体
            </div>
        </div>
    </div>
}