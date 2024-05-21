import React from "react";
import { ArrowRightSvg, BoardToolFrameSvg, DocCardsSvg, PageSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { S, Sp } from "rich/i18n/view";
import { config } from "../common/config";
import { SiteFeatures } from "./common/feature";
import { PricingValue } from "./common/pricing";
import { getTypeColor } from "./util";
import { UrlRoute } from "../src/history";

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
    return <div >
        <div className="shy-site-block">
            <div>
                <div className="padding-t-50">
                    <h1 className={"flex-center " + (config.isUS ? " f-60" : 'f-72')} ><S text='知识社区协作生产力工具'>一体化的知识协作工作台</S></h1>
                    <p className="flex-center remark text-center f-24">
                        <Sp text='知识社区协作生产力工具-description'>以知识管理、沟通互动、AI协作的方式，为个人及团队提供<br />一站式知识协作工作台，服务好自已的受众群体</Sp>
                    </p>
                    <p className="flex-center gap-h-10">
                        <a href="sign/in"
                            className="text-white bg-primary bg-primary-hover cursor round-8 padding-h-15 padding-w-30   flex f-20"
                        ><span className="gap-r-10"><S>免费使用</S></span>
                            <Icon icon={ArrowRightSvg}></Icon>
                        </a>
                    </p>
                    <p className="flex-center remark" style={{ fontSize: '1.6rem' }}><S text="积累知识-沉淀关系">知识，不止于积累，更乐于交流和分享，服务好每一位粉丝</S></p>
                    <div className="gap-h-30 flex-center  relative">
                        <img style={{ border: '8px solid #000', width: '80%' }} className="border round-16 obj-center " src={UrlRoute.getUrl("static/img/pic.png")} />
                        <div className="pos site-mobile-pic">
                            <img style={{ width: 220 }} src={UrlRoute.getUrl('static/img/mobile-1.png')} />
                            <img src='static/img/mobile-content.png' className="pos" style={{
                                top: 33,
                                left: 15,
                                width: 192,
                                height: 398,
                                borderRadius: 10
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block ">

            <div className="padding-h-50">
                <h2 className="flex-center gap-t-40 f-36" ><span className="bold"><Sp text='文档数据表白板PPT'>文档&nbsp;数据表&nbsp;白板&nbsp;PPT</Sp></span></h2>
                <div className="flex-center gap-h-20 remark f-24">
                    <S text='你的一体化知识系统'>你的一体化知识系统，高度融合写作、计划、创作、表达，释放你的创造力。</S>
                </div>

                <div className="flex-full flex-auto-mobile-wrap r-padding-l-20 r-padding-t-20 r-w50">

                    <div className="shy-site-block-card gap-r-10  gap-b-20">

                        <div className="flex r-gap-r-10" style={getTypeColor('page')} ><Icon size={48} icon={PageSvg}></Icon><span style={{ fontSize: 40 }}><S>文档</S></span></div>
                        <div className="text-1 f-14 l-20 gap-t-10" >
                            <Sp text='doc-site-description'>简单 强大 美丽的乐高积木式<br />使用灵活的内容块 <br />更有效的进行协作编辑</Sp>
                        </div>

                        <div className="padding-t-20">
                            <img className="w100 h-300 round obj-center" src='static/img/doc.png' />
                        </div>

                    </div>

                    <div className="shy-site-block-card gap-l-10  gap-b-20">
                        <div className="flex r-gap-r-10" style={getTypeColor('datatable')}><Icon size={48} icon={{ name: 'byte', code: 'table' }}></Icon><span style={{ fontSize: 40 }}><S>数据表</S></span></div>
                        <div className="text-1 f-14 l-20  gap-t-10" >
                            <Sp text='database-site-description'>自定义数据流，按需定制你的专属业务系统。<br />丰富组件、灵活搭建<br />管理任何类型的项目，无论团队或规模如何。</Sp>
                        </div>
                        <div className="flex-end padding-t-20">
                            <img className="w100  h-300   round  obj-center" src='static/img/database.png' />
                        </div>
                    </div>

                </div>

                <div className="flex-full flex-auto-mobile-wrap  r-padding-l-20 r-padding-t-20  r-w50">

                    <div className="shy-site-block-card gap-r-10 gap-b-20">
                        <div className="flex r-gap-r-10" style={getTypeColor('whiteboard')}><Icon size={48} icon={{ name: 'bytedance-icon', code: 'enter-the-keyboard' }}></Icon><span style={{ fontSize: 40 }}><S>白板</S></span></div>
                        <div className="text-1 f-14 l-20 gap-t-10" >
                            <Sp text='whiteboard-site-description'>无限画布，无限创意<br />
                                开创性地一起思考、计划和创造<br />
                                将您的想法变为现实</Sp>
                        </div>
                        <div className="flex-end padding-t-20">
                            <img className="w100  h-300  round  obj-center" src='static/img/board.png' />
                        </div>
                    </div>

                    <div className="shy-site-block-card gap-l-10 gap-b-20">
                        <div className="flex r-gap-r-10" style={getTypeColor('ppt')}><Icon size={48} icon={DocCardsSvg}></Icon><span className="f-40 text-linear-gradient"><S>宣传页</S></span></div>
                        <div className="text-1 f-14 l-20 gap-t-10" ><Sp text='ppt-site-description'>精美优雅 新一代幻灯片PPT<br />
                            简洁、直观、互动 且品牌化 <br />
                            超越文字和无聊的剪贴画的墙壁。</Sp>
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

                <h2 className="flex-center bold  gap-t-40 f-36" >
                    <S>实时沟通和互动</S>
                </h2>

                <div className="flex-center gap-t-10 gap-b-40 remark f-24"><S text='输出你的影响力自定义你的社交网络'>输出你的影响力，自定义你的社交网络</S></div>
                <div className="flex flex-full flex-auto-mobile-wrap">
                    <div className="w50  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-r-10">
                        <div className="flex r-gap-r-10" style={getTypeColor('channel')} ><Icon size={48} icon={BoardToolFrameSvg}></Icon><span style={{ fontSize: 40 }}><S>频道</S></span></div>
                        <div className="text-1 f-14 l-20 gap-t-10" >
                            <S text='使用诗云频道聊天随时随地即时联系并保持互动'>使用 诗云 频道聊天，随时随地即时联系并保持互动</S><br />
                        </div>
                        <div className="padding-t-20">
                            <img className="w100 h-300 round obj-center" src='static/img/fr.png' />
                        </div>
                    </div>
                    <div className="w50  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-l-10">
                        <div className="flex r-gap-r-10" style={getTypeColor('friends-circle')} ><Icon size={48} icon={{ name: 'bytedance-icon', code: 'friends-circle' }}></Icon><span style={{ fontSize: 40 }}><S>互动</S></span></div>
                        <div className="text-1 f-14 l-20 gap-t-10" ><S text='讨论、点赞、喜欢、投票、评论'>讨论、点赞、喜欢、投票、评论</S></div>
                        <div className="padding-t-20">
                            <img className="w100 h-300 round obj-center" src='static/img/tie.png' />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">
                <div className="flex flex-auto-mobile-wrap">
                    <div className="w65">
                        <img className="obj-center  w100  shy-site-block-card" src='static/img/cat.png' />
                    </div>
                    <div className="w35 gap-l-30">
                        <h3 className="shy-site-block-head"><S>强大的模块化构建</S></h3>
                        <div className="remark f-20 l-30">
                            <Sp text='强大的模块化构建-description'>  自由组合、无限表达、无限DIY
                                <br />
                                诗云适应您的需求。
                                <br />它可以是最小的，也可以是强大的，取决于您的需要。</Sp>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">

                <div className="flex  flex-auto-mobile-wrap">
                    <div className="w35 gap-b-20">
                        <h3 className="shy-site-block-head"><S>多人协作</S></h3>
                        <div className="remark f-20 l-30">
                            <Sp text='多人协作-description'>
                                全平台 实时性编辑
                                <br />
                                随时随地让协作更好的发生
                                <br />
                                在任何设备上吸引用户随处阅读
                            </Sp>
                        </div>
                    </div>
                    <div className="w65 gap-l-30">
                        <img className="w100 obj-center  shy-site-block-card" src='static/img/pic.png' />
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">
                <div className="flex  flex-auto-mobile-wrap">
                    <div className="w65">
                        <img className="w100 obj-center  shy-site-block-card" src='static/img/fr.png' />
                    </div>
                    <div className="w35 gap-l-30">
                        <h3 className="shy-site-block-head"><S>社群</S></h3>
                        <div className="remark f-20 l-30">
                            <Sp text={'社群-description'}>可控的权限，成员角色、互动、社交
                                <br />
                                让社群更好的运营</Sp>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div className="shy-site-block" >
            <div className="padding-h-50">
                <SiteFeatures></SiteFeatures>
            </div>
        </div>

        <div className="shy-site-block" style={{ display: 'none' }}>
            <div className="padding-h-50">
                <h3 className="flex-center f-30" ><S>他们都在用诗云</S></h3>
                <div className="flex-center remark f-12 gap-h-20"><S text='排名不分先后顺序'>（*排名不分先后顺序）</S></div>
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
            <div className="padding-h-50 flex  flex-auto-mobile-wrap ">
                <div className="w35">
                    <h3 className="shy-site-block-head"><S text='AI写作佳文立现'>AI 写作，佳文立现</S></h3>
                    <div className="remark f-20 l-30">
                        <Sp text='AI写作佳文立现-description'>您可以在一分钟内完善和自定义工作文档、演示文稿。
                            <br />
                            即开即用、灵感自动产生
                            <br />文章一键生成、创作领先一步</Sp>
                    </div>
                </div>
                <div className="w65  gap-l-30">
                    <video className=" w100 obj-center" title="ai gen mp4" width="100%" height="56.25%"
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
            <div className="padding-h-50 flex  flex-auto-mobile-wrap">

                <div className="w65 ">
                    <video title="ai gen mp4" className=" w100 obj-center" width="100%" height="56.25%"
                        muted={true} loop={true} autoPlay={true} controls={false}
                    // poster="https://sanity-images.imgix.net/production/b7f2a0a42e872c4c29b78ceb086b4937e1d6a226-1040x1000.png?h=450&amp;dpr=2&amp;w=&amp;auto=format%2Ccompress"
                    ><source
                            src="static/img/ai-fix.mp4"
                            type="video/mp4" />
                    </video>
                </div>

                <div className="w35 gap-l-30">
                    <h3 className="shy-site-block-head"><S text='AI机器人'>AI机器人</S></h3>
                    <div className="remark f-20 l-30">
                        <Sp text='AI机器人-description'>基于知识库，构建自已的AI机器人
                            <br />
                            人机协作，生产更高效</Sp>

                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">
                <h3 className="flex-center gap-h-20  shy-site-block-head">
                    <span><S>多场景覆盖应用</S></span>
                    <a className="remark gap-l-10 f-14" href={config.isUS ? "https://template.shy.red" : 'https://template.shy.live'} style={{ textDecoration: 'underline' }}><S>更多模板</S></a>
                </h3>
                <div className="flex-center f-16 gap-b-10 r-cursor  shy-site-tab-items r-padding-w-10 r-gap-w-5 r-padding-h-5 r-round r-item-hover">
                    <span className="item-hover-focus"><S>私域好帮手</S></span>
                    <span><S>知识社区圈子</S></span>
                    <span><S>共创社区</S></span>
                    <span><S>小米社区</S></span>
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
                <PricingValue></PricingValue>
            </div>
        </div>

        {!config.isUS && <div className="shy-site-block bg-4" style={{ display: 'none' }}>
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
        </div>}

        <div className="shy-site-block ">
            <div className="padding-h-50">
                <h3 className="flex-center shy-site-block-head" ><S>基于网络进行大规模的社区化协作服务</S></h3>
                <div className="remark gap-h-30 f-24 flex-center text-center">
                    <S text='基于网络进行大规模的社区化协作服务-description'>如何让每个协作者拿到属于自已的那一份利益</S>
                </div>
                <div className="shy-site-block-card padding-w-14">
                    <div className="r-gap-w-20 gap-h-30 flex">
                        <div className="flex-auto">
                            <div className="flex f-30  gap-h-10"  >
                                <img style={{ marginLeft: -10 }} className="size-50 obj-center" src='static/img/community.svg' /><S>社区化协作</S>
                            </div>
                            <div className="flex f-14 remark  l-24"><Sp text='社区化协作-descption'>我们电脑、手机上的app都属于信息应用系统，使用各种app就是为了更高效的协作办公。<br />
                                诗云提供基于文稿编辑信息的方式，实时构建我们自已的信息网络来服务我们的受众群体<br />
                                让我们做自已的小生意，赚自已的小钱钱，它不香嘛<br /></Sp>
                            </div>
                        </div>
                    </div>
                    <div className="r-gap-w-20 gap-h-30 flex  flex-auto-mobile-wrap">
                        <div className="w40 gap-b-20">
                            <div className="flex f-30 gap-h-10 r-gap-r-3">
                                <img className="size-40 obj-center" src='static/img/block-chain.svg' />
                                <S>区块链</S>
                            </div>
                            <div className="flex f-14 remark l-24">
                                <Sp text='区块链-description'>
                                    从数据存储到网络交易，基于区块链，安全看的见，利益有保障<br />
                                    每一个网络参与者所产生的信息及达成的共识，都具有不可篡改，可追溯，可维权，具有法律效力
                                </Sp>
                            </div>
                        </div>
                        <div className="flex-full w60 shy-site-block-card padding-14">
                            <div className="w50 padding-10">
                                <div className="flex f-18 r-gap-r-10"><img className="size-24 obj-center" src='static/img/store.svg' /><S>小链</S></div>
                                <div className="flex remark l-30 f-14  ">
                                    <Sp text='小链-description'>诗云服务端内置区块链<br />
                                        用户对自已的日常行为数据进行私钥签名</Sp>
                                </div>
                            </div>
                            <div className="w50 padding-10 ">
                                <div className="flex f-18  r-gap-r-10"><img className="size-24 obj-center" src='static/img/list-chain.svg' /><S>大链</S></div>
                                <div className="flex  remark l-30 f-14 ">
                                    <Sp text='大链-description'>诗云客户端内置区块链<br />
                                        同步链上帐本，可查看、可验证</Sp>
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
                    <img className="w-400 obj-center" src='static/img/read-book.svg' />
                </div>
                <h3 className="shy-site-block-head flex-center">
                    <S text="诗云知识社区协作生产力工具">诗云-知识社区协作生产力工具</S>
                </h3>
                <div className="flex-center remark f-24 text-center l-30"  >
                    <S text='互联协作创见未来'>互联协作，创见未来</S>
                </div>
                <div className="flex-center gap-h-20">
                    <a href='/sign/in' className="inline-block text-white bg-primary bg-primary  f-20 cursor round-8 padding-h-10 padding-w-30 "
                    ><S>加入诗云</S></a>
                </div>
            </div>


        </div>

        {false && <div style={{ display: 'none' }}>

            <div className="flex-center f-30"  >
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
                    <div className="f-36">无限可能、无限创作</div>
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
        </div>}
    </div>
}