import React from "react";
import { UrlRoute } from "../../src/history";
import { Icon } from "rich/component/view/icon";
import { observer, useLocalObservable } from "mobx-react";




export var ProductDocView = observer(function () {

    var local = useLocalObservable<{
        index: number

    }>(() => {
        return {
            index: 0

        }
    })


    if (window.shyConfig.isUS) return <></>
    return <div>
        <div className="shy-site-block padding-h-30">
            <div className="flex padding-h-30">
                <div className="flex-fixed">
                    <h1 className="f-48" >新一代的笔记和文档</h1>
                    <p className="text-1 f-16 gap-b-20">
                        简单、强大、美丽。<br />借助诗云的灵活构建模块，更高效地沟通。
                    </p>
                    <div>
                        <a href={UrlRoute.getUrl('/sign/in')}
                            className="text-white bg-button-dark  cursor round-8 padding-h-6 padding-w-20   flex flex-inline f-20"
                        >免费使用</a>
                    </div>
                </div>
                <div className="flex-auto flex-end">
                    <img className="max-w-600 " src='../static/img/doc/pic.webp' />
                </div>
            </div>
        </div>

        <div className="shy-site-block  padding-h-80">
            <div>

                <div className="flex flex-full col-4-g20 r-border-box">
                    <div onMouseEnter={e => { local.index = 0 }} className="flex-auto visible-hover cursor shy-site-block-card-hover round-8 padding-10">
                        <div><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3 className="gap-t-10 gap-b-5">会议记录</h3>
                        <p className="f-14 text-1">将人员和项目与更新和行动项目联系起来。</p>
                        <div className="visible gap-h-10"><a href='https://template.shy.live/page/2179#cr728PkDrjxphXEyb5by49'>复制模板<i className="padding-l-5">→</i></a></div>
                    </div>

                    <div onMouseEnter={e => { local.index = 1 }} className="flex-auto visible-hover cursor shy-site-block-card-hover round padding-10">
                        <div><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3 className="gap-t-10 gap-b-5">设计系统</h3>
                        <p className="f-14 text-1">您公司的所有设计资产都集中在一个地方。</p>
                        <div className="visible gap-h-10"><a>复制模板<i className="padding-l-5">→</i></a></div>
                    </div>

                    <div onMouseEnter={e => { local.index = 2 }} className="flex-auto visible-hover cursor shy-site-block-card-hover round padding-10">
                        <div><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3 className="gap-t-10 gap-b-5">项目要求</h3>
                        <p className="f-14 text-1">可定制的 PRD 适合任何类型项目。</p>
                        <div className="visible gap-h-10"><a>复制模板<i className="padding-l-5">→</i></a></div>
                    </div>

                    <div onMouseEnter={e => { local.index = 3 }} className="flex-auto visible-hover cursor shy-site-block-card-hover round padding-10">
                        <div><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3 className="gap-t-10 gap-b-5">演讲平台</h3>
                        <p className="f-14 text-1">以动态的方式讲述您公司的故事。</p>
                        <div className="visible gap-h-10"><a>复制模板<i className="padding-l-5">→</i></a></div>
                    </div>

                </div>

                <div className="gap-h-20">
                    <div style={{ display: local.index == 0 ? "block" : 'none' }}><img alt={'会议记录'} className="w100 round-16 shy-site-block-card-hover" src={'../static/img/doc/doc-meet.png'} /></div>
                    <div style={{ display: local.index == 1 ? "block" : 'none' }}><img alt={'设计系统'} className="w100 round-16 shy-site-block-card-hover" src={'../static/img/doc/pic.webp'} /></div>
                    <div style={{ display: local.index == 2 ? "block" : 'none' }}><img alt={'项目要求'} className="w100 round-16 shy-site-block-card-hover" src={'../static/img/doc/pic.webp'} /></div>
                    <div style={{ display: local.index == 3 ? "block" : 'none' }}><img alt={'演讲平台'} className="w100 round-16 shy-site-block-card-hover" src={'../static/img/doc/pic.webp'} /></div>
                </div>

            </div>
        </div>

        <div className="shy-site-block  padding-h-80">
            <div>
                <h1 className="flex padding-h-30 flex-center f-48">超越文本与摘要，开启无限可能</h1>
                <div className="flex gap-h-20 col-3-g20  r-border-box flex-full">

                    <div className="flex-auto bg-2 padding-h-10 round-8">
                        <div className="padding-w-20 gap-t-10"><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'code' }}></Icon></div>
                        <h3 className="padding-w-20 gap-t-10 gap-b-5">代码片段</h3>
                        <p className="padding-w-20 f-14 text-1 h-40">数十种语言的本机语法高亮显示。<br /></p>
                        <div className="gap-t-20 gap-l-20 relative h-150 overflow-hidden round-t-l-16  border shadow-s  bg-white" >
                            <img className="pos   h100 " style={{ top: 0, left: 0 }} src={'../static/img/doc/doc-code.png'} />
                        </div>
                    </div>

                    <div className="flex-auto bg-2 padding-h-10 round-8">
                        <div className="padding-w-20 gap-t-10"><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'list-bottom' }}></Icon></div>
                        <h3 className="padding-w-20 gap-t-10 gap-b-5">切换</h3>
                        <p className="padding-w-20 f-14 text-1  h-40">可折叠的部分使您的文档易于阅读。<br /></p>
                        <div className="gap-t-20 gap-l-20 relative h-150 overflow-hidden round-t-l-16  border shadow-s  bg-white" >
                            <img className="pos   h100  " style={{ top: 0, left: 0 }} src={'../static/img/doc/doc-toggle.png'} />
                        </div>
                    </div>

                    <div className="flex-auto bg-2 padding-h-10 round-8">
                        <div className="padding-w-20 gap-t-10"><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'pic' }}></Icon></div>
                        <h3 className="padding-w-20 gap-t-10 gap-b-5">图片与媒体</h3>
                        <p className="padding-w-20 f-14 text-1  h-40">直接从 网易云音乐 和 B站 嵌入，或上传您自己的。</p>
                        <div className="gap-t-20 gap-l-20 relative h-150 overflow-hidden round-t-l-16  border shadow-s  bg-white" >
                            <img className="pos   h100 " style={{ top: 0, left: 0 }} src={'../static/img/doc/doc-video.png'} />
                        </div>
                    </div>

                </div>
                <div className="flex gap-h-20 col-3-g20  r-border-box flex-full">

                    <div className="flex-auto bg-2 padding-h-10 round-8">
                        <div className="padding-w-20 gap-t-10"><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'mindmap-list' }}></Icon></div>
                        <h3 className="padding-w-20 gap-t-10 gap-b-5">目录</h3>
                        <p className="padding-w-20 f-14 text-1   h-40">单击即可跳至某一部分，自动更新。</p>
                        <div className="gap-t-20 gap-l-20 relative h-150 overflow-hidden round-t-l-16  border shadow-s  bg-white" >
                            <img className="pos   h100" style={{ top: 0, left: 0 }} src={'../static/img/doc/doc-outline.png'} />
                        </div>
                    </div>


                    <div className="flex-auto bg-2 padding-h-10 round-8">
                        <div className="padding-w-20 gap-t-10"><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'formula' }}></Icon></div>
                        <h3 className="padding-w-20 gap-t-10 gap-b-5">数学方程式</h3>
                        <p className="padding-w-20 f-14 text-1   h-40">你从未见过数学如此美丽。</p>
                        <div className="gap-t-20 gap-l-20 relative h-150 overflow-hidden round-t-l-16  border shadow-s  bg-white" >
                            <img className="pos   h100" style={{ top: 0, left: 0 }} src={'../static/img/doc/doc-math.png'} />
                        </div>
                    </div>


                    <div className="flex-auto bg-2 padding-h-10 round-8">
                        <div className="padding-w-20 gap-t-10"><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'cross-ring-two' }}></Icon></div>
                        <h3 className="padding-w-20 gap-t-10 gap-b-5">以及 100 多种内容类型。</h3>
                        <p className="padding-w-20 f-14 text-1   h-40">就像一个无底的积木盒……</p>
                        <div className="gap-t-20 gap-l-20 relative h-150 overflow-hidden round-t-l-16  border shadow-s  bg-white" >
                            <img className="pos   h100 " style={{ top: 0, left: 0 }} src={'../static/img/doc/doc-blocks.png'} />
                        </div>
                    </div>

                </div>
            </div>
        </div>


        <div className="shy-site-block  padding-h-80">
            <div>
                <div className="relative gap-t-30">
                    <h1 className="gap-b-50 f-48 ">让你的团队达成共识</h1>
                    <div className="pos pos-top-right w-300" style={{ top: -30, right: 0 }}>
                        <img className="w100 object-center" src={'../static/img/doc/doc-pic-5-t.png'} />
                    </div>
                    <div>

                        <div className="bg-2 round padding-b-20 ">
                            <div className="padding-w-20 padding-t-20"><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'at-sign' }}></Icon></div>
                            <h3 className="padding-w-20 gap-t-10 gap-b-5">共同协作处理文档</h3>
                            <p className="padding-w-20 f-14 text-1">只需输入@键即可引起某人的注意。</p>
                            <div className="padding-w-20 border-box gap-t-30">
                                <img className="w100 border round-t-l-16 h100 shadow-s " src={'../static/img/doc/pic.webp'} />
                            </div>
                        </div>

                        <div className="flex col-2-g20 gap-h-20">
                            <div className="flex-auto bg-2 padding-h-10 round-8">
                                <div className="padding-w-20 gap-t-20"><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'message' }}></Icon></div>
                                <h3 className="padding-w-20 gap-t-10 gap-b-5">评论让事情继续异步发展</h3>
                                <p className="padding-w-20 f-14 text-1">通过整合反馈视图，可以轻松进行迭代，甚至跨办公室和时区。</p>
                                <div className="gap-t-30 gap-l-20 relative h-250 overflow-hidden">
                                    <img className="pos border round-t-l-16 h100 shadow-s " style={{ top: 0, left: 0 }} src={'../static/img/doc/pic.webp'} />
                                </div>
                            </div>
                            <div className="flex-auto bg-2 padding-h-10 round-8">
                                <div className="padding-w-20 gap-t-20"><Icon className={'text-high'} size={32} icon={{ name: 'byte', code: 'pound' }}></Icon></div>
                                <h3 className="padding-w-20 gap-t-10 gap-b-5">即时讨论让事情明了清晰</h3>
                                <p className="padding-w-20 f-14 text-1">通过实时的沟通交互，可以快速解决问题。</p>
                                <div className="gap-t-30 gap-l-20 relative h-250 overflow-hidden">
                                    <img className="pos border round-t-l-16 h100 shadow-s " style={{ top: 0, left: 0 }} src={'../static/img/doc/pic.webp'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>


        <div className="shy-site-block  padding-h-80">
            <div>
                <h1 className="gap-b-50 f-48 ">面向产品经理、设计师、工程师以及所有相关人员</h1>
                <div className="flex col-3-g20 flex-full r-border-box ">
                    <div className="flex-auto bg-2 round padding-10">
                        <h3 className="padding-w-20 gap-t-10 gap-b-5">产品</h3>
                        <p className="padding-w-20 f-14 text-1">将路线图与目标联系起来，让人们了解何时运送什么。</p>
                        <div className="padding-w-20 visible gap-h-20"><a>了解 PM 如何使用 诗云<i className="padding-l-5">→</i></a></div>
                        <div className="padding-w-20 border-box">
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>
                    <div className="flex-auto bg-2 round padding-10">
                        <h3 className="padding-w-20 gap-t-10 gap-b-5">设计</h3>
                        <p className="padding-w-20 f-14 text-1">提前审核轮次、确定请求的优先顺序并满足所有创意截止日期。</p>
                        <div className="padding-w-20 visible gap-h-20"><a>了解设计师如何使用 诗云<i className="padding-l-5">→</i></a></div>
                        <div className="padding-w-20 border-box">
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>
                    <div className="flex-auto bg-2 round padding-10">
                        <h3 className="padding-w-20 gap-t-10 gap-b-5">工程</h3>
                        <p className="padding-w-20 f-14 text-1">通过冲刺、代码指南、错误修复等，在一个地方更快地交付功能。</p>
                        <div className="padding-w-20 visible gap-h-20"><a>了解工程师如何使用 诗云<i className="padding-l-5">→</i></a></div>
                        <div className="padding-w-20 border-box">
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block  padding-h-80">
            <div>
                <div className="relative">
                    <h1 className="gap-b-10 f-48 flex-center">选择一个模板开始</h1>
                    <p className="flex-center "><a href='https://template.shy.live'>浏览模板库<i className="padding-l-5">→</i></a></p>

                    <div className="pos w-200" style={{ top: -60, left: -100 }}>
                        <img className="w100 object-center" src={'../static/img/doc/doc-pic-3-t.png'} />
                    </div>

                    <div className="flex col-3-g20 gap-t-20 flex-full r-border-box">

                        <div className="flex-auto bg-2 round">
                            <h3 className="padding-w-20">Mixpanel 的每日站立会议和任务</h3>
                            <div className="padding-w-20 gap-h-20">
                                <a className="padding-l-5"> 尝试模板<i>→</i></a>
                            </div>
                            <div className="gap-t-30 gap-l-20 relative h-150 overflow-hidden" >
                                <img className="pos border round-16 shadow-s " style={{ top: 0, left: 0 }} src={'../static/img/doc/pic.webp'} />
                            </div>
                        </div>

                        <div className="flex-auto bg-2 round" >
                            <h3 className="padding-w-20">诗云 的产品需求文档</h3>
                            <div className="padding-w-20 gap-h-20">
                                <a className="padding-l-5"> 尝试模板<i>→</i></a>
                            </div>
                            <div className="gap-t-30 gap-l-20 relative h-150 overflow-hidden" >
                                <img className="pos border round-16 shadow-s " style={{ top: 0, left: 0 }} src={'../static/img/doc/pic.webp'} />
                            </div>

                        </div>

                        <div className="flex-auto bg-2 round">
                            <h3 className="padding-w-20">Netflix 的品牌框架</h3>
                            <div className="padding-w-20 gap-h-20">
                                <a className="padding-l-5"> 尝试模板<i>→</i></a>
                            </div>
                            <div className="gap-t-30 gap-l-20 relative h-150 overflow-hidden" >
                                <img className="pos border round-16 shadow-s " style={{ top: 0, left: 0 }} src={'../static/img/doc/pic.webp'} />
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </div>

        <div className="shy-site-block h-80"></div>


    </div>
}
)