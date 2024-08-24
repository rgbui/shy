import React from "react";

import { Icon } from "rich/component/view/icon";
import { getTypeColor } from "../util";
import { AiStartSvg, SearchSvg } from "rich/component/svgs";
import { isMobileOnly } from "react-device-detect";


export function SiteFeatures(props: { small?: boolean }) {

    /**
     * 实现一个定时器，每隔一段时间，切换一次
     */


    var el1 = React.useRef<{ el: HTMLDivElement, scroll: boolean, forward: boolean }>({ el: null, scroll: true, forward: true });


    React.useEffect(() => {
        const timer = setInterval(() => {
            var speed = 4;
            var dis = 20;
            if (el1.current.scroll) {
                el1.current.el.scrollTop += el1.current.forward ? speed : -speed;
                if (el1.current.el.scrollTop >= el1.current.el.scrollHeight - el1.current.el.clientHeight - dis) {
                    el1.current.forward = false;
                }
                else if (el1.current.el.scrollTop <= 0 + dis) {
                    el1.current.forward = true;
                }
            }
        }, 100);

        return () => {

        };
    }, []);

    return <div>

        <h2 className="flex-center gap-t-40 f-36" style={{ marginBottom: 0 }}>
            <span className="bold">
                诗云很强大，也很简单
            </span>
        </h2>
        <div className="flex-center gap-h-20 remark f-20 l-24">
            很简单，更好用，细腻的小细节，巧妙的小功能，简便的小操作, 汇聚成一股强大的力量
        </div>
        <div className="h-20"></div>

        <div
            className="flex flex-top flex-auto-mobile-wrap shy-site-block-card padding-10 round"
        >
            <div className="flex-fixed w-350 gap-r-10">

                <div className="flex-center gap-t-20">
                    <img className="round-16 " alt="细腻的小细节，巧妙的小功能，简便的小操作" src='static/img/3d-girl.png'
                        style={{
                            width: 300
                        }}
                    />
                </div>

                <div>
                    <img alt="细腻的小细节，巧妙的小功能，简便的小操作" src='static/img/power2.svg'
                        style={{
                            width: 450,
                            marginLeft: -50
                        }}
                    />
                </div>

            </div>
            <div
                onMouseEnter={e => {
                    el1.current.scroll = false;
                }}
                onMouseLeave={e => {
                    el1.current.scroll = true;
                }}
                className="flex-auto">
                <div ref={e => {
                    el1.current.el = e;
                }}
                    style={{
                        height: 500,
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                        scrollbarColor: 'transparent transparent',
                        scrollBehavior: 'smooth',
                        paddingTop: 20,
                        paddingBottom: 20
                    }}
                    className="flex flex-end flex-full flex-auto-mobile-wrap col-3-g20">
                    <div> <div className="r-gap-b-20">

                        <div className="shy-site-block-card padding-10 round">
                            <div><Icon className={'text-high'} icon={{ name: "byte", code: "word" }} size={32}></Icon></div>
                            <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >Markdown语法</h5>
                            <p className="f-14 text-1   l-20">支持Markdown语法的键入输入</p>
                        </div>

                        <div className="shy-site-block-card padding-10 round">
                            <div><Icon className={'text-high'} icon={{ name: "byte", code: 'mindmap-list' }} size={32}></Icon></div>
                            <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >大纲</h5>
                            <p className="f-14 text-1   l-20">组织页面目录大纲</p>
                        </div>

                        <div className="shy-site-block-card padding-10 round">
                            <div><Icon className={'text-high'} icon={{ name: "byte", code: "play-cycle" }} size={32}></Icon></div>
                            <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >双链</h5>
                            <p className="f-14 text-1   l-20">支持页面关系相互引用</p>
                        </div>

                        <div className="shy-site-block-card padding-10 round">
                            <div><Icon className={'text-high'} icon={{ name: "byte", code: 'formula' }} size={32}></Icon></div>
                            <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >数学公式</h5>
                            <p className="f-14 text-1   l-20">支持Latex公式</p>
                        </div>
                        
                        <div className="shy-site-block-card padding-10 round">
                            <div><Icon className={'text-high'} icon={{ name: "byte", code: 'code' }} size={32}></Icon></div>
                            <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >代码块</h5>
                            <p className="f-14 text-1   l-20">数十种语言的本机语法高亮显示。</p>
                        </div>

                        <div className="shy-site-block-card padding-10 round">
                            <div><Icon className={'text-high'} icon={{ name: 'byte', code: "navigation", rotate: 90, }} size={32}></Icon></div>
                            <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >面包屑导航栏</h5>
                            <p className="f-14 text-1   l-20">支持展示多个页面内容</p>
                        </div>


                        <div className="shy-site-block-card padding-10 round">
                            <div><Icon className={'text-high'} icon={{ name: 'byte', code: 'multi-picture-carousel' }} size={32}></Icon></div>
                            <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >图片轮播</h5>
                            <p className="f-14 text-1   l-20">支持多个图片轮播</p>
                        </div>





                        <div className="shy-site-block-card padding-10 round">
                            <div><Icon className={'text-high'} icon={{ name: "byte", code: "loading" }} size={32}></Icon></div>
                            <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >时实更新</h5>
                            <p className="f-14 text-1   l-20">多个文档展示同一信息，一处更新，全局时实同步</p>
                        </div>




                        <div className="shy-site-block-card padding-10 round">
                            <div><Icon className={'text-high'} icon={{ name: "byte", code: "personal-privacy" }} size={32}></Icon></div>
                            <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >角色权限控制</h5>
                            <p className="f-14 text-1   l-20">支持设置不同的角色页面权限访问</p>
                        </div>


                        <div className="shy-site-block-card padding-10 round">
                            <div><Icon className={'text-high'} icon={{ name: "byte", code: "earth" }} size={32}></Icon></div>
                            <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >公开互联网</h5>
                            <p className="f-14 text-1   l-20">支持绑定域名，搜索引擎SEO</p>
                        </div>


                        <div className="shy-site-block-card padding-10 round">
                            <div><Icon className={'text-high'} icon={{ name: "byte", code: "application-one" }} size={32}></Icon></div>
                            <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  > 应用发布</h5>
                            <p className="f-14 text-1   l-20">支持发布站点、app应用</p>
                        </div>

                    </div>
                    </div>

                    <div >
                        <div className="r-gap-b-20">

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon className={'text-high'} icon={{ name: "byte", code: "pic" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >媒体</h5>
                                <p className="f-14 text-1   l-20">支持图片、音频、视频及文件等媒体资源</p>
                            </div>


                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon className={'text-high'} icon={{ name: 'byte', code: 'form' }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >简单表格</h5>
                                <p className="f-14 text-1   l-20">支持单元格嵌套复杂的文档内容（如图片）</p>
                            </div>


                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon className={'text-high'} icon={{ name: "byte", code: "web-page" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >嵌入</h5>
                                <p className="f-14 text-1   l-20">支持嵌入网址、B站、网易云音乐、Figma设计稿、MasterGO设计稿、腾讯视频、优酷视频、YouToBe视频</p>
                            </div>


                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon className={'text-high'} icon={{ name: "byte", code: "hashtag-key" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >标签</h5>
                                <p className="f-14 text-1   l-20">支持页面标签索引</p>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon className={'text-high'} icon={SearchSvg} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >空间搜索</h5>
                                <p className="f-14 text-1   l-20">基于Elasticsearch服务搜索</p>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon style={getTypeColor('ai')} icon={{ name: 'byte', code: 'magic' }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >AI写作</h5>
                                <p className="f-14 text-1   l-20">润色文本，生成图片</p>
                            </div>


                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon style={getTypeColor('ai')} icon={{ name: 'byte', code: 'robot-one' }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >AI客服机器人</h5>
                                <p className="f-14 text-1   l-20">支持自定义空间客户服务机器人</p>
                            </div>


                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon style={getTypeColor('ai')} icon={AiStartSvg} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >智能搜索</h5>
                                <p className="f-14 text-1   l-20">基于空间知识库的AI智能语义搜索</p>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon style={getTypeColor('datatable')} icon={{ name: "byte", code: "lightning" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >按钮工作流</h5>
                                <p className="f-14 text-1   l-20">自定义页面的按钮点击事件</p>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon style={getTypeColor('datatable')} icon={{ name: "byte", code: "view-grid-card" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >数据视图</h5>
                                <p className="f-14 text-1   l-20">支持丰富的数据表记录模板</p>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon style={getTypeColor('datatable')} icon={{ name: "byte", code: "analysis" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >分析统计</h5>
                                <p className="f-14 text-1   l-20">支持数据表的统计分析</p>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon className={'text-high'} icon={{ name: "byte", code: "wechat" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >  微信/Web Clipper剪藏</h5>
                                <p className="f-14 text-1   l-20">计划中</p>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon className={'text-high'} icon={{ name: "byte", code: "api" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >   开放API</h5>
                                <p className="f-14 text-1   l-20">计划中</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="r-gap-b-20">

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon className={'text-high'} icon={{ name: "byte", code: "keyboard-one" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >  键盘快捷键</h5>
                                <p className="f-14 text-1   l-20">集成常用的快捷键</p>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div>
                                    <img className="w100  round-16 " src='static/img/board/note.png' />
                                </div>
                                <h4 style={{ fontSize: 16, fontWeight: 400 }}>使用便利贴表达想法</h4>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div>
                                    <img className="w100  round-16 " src='static/img/board/s.png' />
                                </div>
                                <h4 style={{ fontSize: 16, fontWeight: 400 }}>通过贴纸和表情，有趣的互动</h4>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div>
                                    <img className="w100  round-16 " src='static/img/board/ss.png' />
                                </div>
                                <h4 style={{ fontSize: 16, fontWeight: 400 }}>1000+的失量、插图库</h4>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon style={getTypeColor('friends-circle')} icon={{ name: 'byte', code: 'at-sign' }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >@协作处理</h5>
                                <p className="f-14 text-1   l-20">输入@键即可引起某人的注意。</p>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon style={getTypeColor('datatable')} icon={{ name: "byte", code: "form-one" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >表单收集</h5>
                                <p className="f-14 text-1   l-20">支持自定义数据表的表单</p>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon style={getTypeColor('friends-circle')} icon={{ name: "byte", code: "thumbs-up" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >互动</h5>
                                <p className="f-14 text-1   l-20">页面点评、点赞等</p>
                            </div>

                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon className={'text-high'} icon={{ name: "byte", code: "history" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  >历史记录</h5>
                                <p className="f-14 text-1   l-20">页面历史版本回滚，保存60天</p>
                            </div>




                            <div className="shy-site-block-card padding-10 round">
                                <div><Icon style={getTypeColor('friends-circle')} icon={{ name: "byte", code: "share-two" }} size={32}></Icon></div>
                                <h5 className="f-18 " style={{ margin: 0, marginBottom: 5, fontWeight: 500 }}  > 页面分享</h5>
                                <p className="f-14 text-1   l-20">支持分享至微信、微博、朋友圈</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>




    </div>
}

export function SimpleFeatures() {
    var [index, setIndex] = React.useState(0);
    return <div>
        <h2 className="flex gap-t-40 f-36" style={{ marginBottom: 0 }}>
            <span className="bold">
                数字花园，不仅是一个学习的地方，更是一个成长的空间。
            </span>
        </h2>
        <div className="flex gap-h-10 remark f-20 l-24">
            一体化模块设计，灵活应对个人知识管理、团队协作及社区交流的多样化需求。
        </div>
        <div className="h-20"></div>
        <div className="flex flex-top flex-auto-mobile-wrap">
            <div className="flex-fixed">
                <div className={"round cursor gap-r-10 gap-b-10 padding-10 " + (index == 0 ? "item-hover-light-focus" : "")} onMouseDown={e => {
                    setIndex(0);
                }}>
                    <h4 style={{ margin: 0, fontSize: 24 }} className="shy-site-block-head">强大的模块化构建</h4>
                    <p className="remark f-16 l-24">
                        自由组合、无限表达、无限DIY
                        <br />
                        诗云适应您的需求。
                        <br />它可以是最小的，也可以是强大的，取决于您的需要。
                    </p>
                </div>
                <div className={"round  cursor   gap-r-10 gap-b-10 padding-10 " + (index == 1 ? "item-hover-light-focus" : "")} onMouseDown={e => {
                    setIndex(1);
                }}>
                    <h4 style={{ margin: 0, fontSize: 24 }} className="shy-site-block-head">@多人协作</h4>
                    <p className="remark f-16 l-24">
                        全平台 实时性编辑
                        <br />
                        随时随地让协作更好的发生
                        <br />
                        在任何设备上吸引用户随处阅读
                    </p>
                </div>
                <div className={"round  cursor   gap-r-10 gap-b-10 padding-10 " + (index == 2 ? "item-hover-light-focus" : "")} onMouseDown={e => {
                    setIndex(2);
                }}>
                    <h4 style={{ margin: 0, fontSize: 24 }} className="shy-site-block-head">社群、社区、圈子</h4>
                    <p className="remark f-16 l-24">
                        可控的权限，成员角色、互动、社交
                        <br />
                        让社区更好的运营
                    </p>
                </div>
            </div>
            <div className="flex-auto">
                <img style={{
                    display: index == 0 ? 'block' : 'none',
                    height: 450
                }} className="obj-center  w100  shy-site-block-card" src='static/img/cat.png' />
                <img
                    style={{
                        display: index == 1 ? 'block' : 'none',
                        height: 450
                    }}
                    className="w100 obj-center  shy-site-block-card" src='static/img/doc/doc-collaboration.png' />
                <img
                    style={{
                        display: index == 2 ? 'block' : 'none',
                        height: 450
                    }}
                    className="w100 obj-center  shy-site-block-card" src='static/img/fr.png' />
            </div>
        </div >
    </div>
}


export function AiFeatures() {
    return <div>

        <div className="flex-full flex-auto-mobile-wrap  r-padding-t-20 r-w50">
            <div className="gap-r-10">
                <h2 className="flex gap-t-40 f-36" style={{ marginBottom: 0 }}>
                    <span className="bold">
                        诗云 AI，智慧的墨水
                    </span>
                </h2>
                <div className="flex gap-h-10 remark f-18 l-24">
                    诗云 AI 内置于您的工作空间中，随时可以集思广益、进行总结、帮助您撰写并找到您所需内容。
                </div>
                <div>
                    <a href='product/ai' className="link f-18 flex" >尝试 诗云 AI <Icon size={18} className={'gap-l-5'} icon={{ name: 'byte', code: 'arrow-right' }}></Icon></a>
                </div>
            </div>
            <div className=" flex flex-end flex-top gap-t-60 col-3-g10">
                <div>
                    <div className="h-50 flex">
                        <Icon style={getTypeColor('ai')} size={48} icon={AiStartSvg}></Icon>
                    </div>
                    <h4 style={{ margin: 0, marginTop: 5, marginBottom: 5 }}>智能搜索</h4>
                    <p className="text-1 f-14  l-20">
                        询问有关您团队的文档和项目的任何问题。
                    </p>
                </div>
                <div>
                    <div className="h-50 flex"><Icon style={getTypeColor('ai')} size={48} icon={{ name: "byte", code: 'magic' }}></Icon></div>
                    <h4 style={{ margin: 0, marginTop: 5, marginBottom: 5 }}>个性化编辑器</h4>
                    <p className="text-1 f-14 l-20">
                        生成相关的内容。
                    </p>
                </div>
                <div>
                    <div className="h-50 flex"><Icon style={getTypeColor('ai')} size={48} icon={{ name: "byte", code: 'robot-one' }}></Icon></div>
                    <h4 style={{ margin: 0, marginTop: 5, marginBottom: 5 }}>AI客户机器人</h4>
                    <p className="text-1 f-14 l-20">
                        基于空间知识来训练您的客户服务机器人。
                    </p>
                </div>
            </div>
        </div>


        <div className="gap-t-20">
            <div className="shy-site-block-card relative">
                <img alt="AI写作" className="w100 round-32 obj-center" src={'static/img/ai/text-4.png'} />
                <div className="pos round-32 shy-site-block-card border shadow-s bg-white" style={{
                    top: 50, right: 100,
                    width: 553,
                    height: 383,
                    overflow: 'hidden'
                }}>
                    <img alt="AI智能搜索" className="w500 pos mobile-hide"
                        style={{
                            top: -70,
                            left: -225,
                            width: 1000,
                            display:isMobileOnly?'none':'block'
                        }}
                        src={'static/img/ai/so.png'} />
                </div>
            </div>
        </div>
    </div>
}