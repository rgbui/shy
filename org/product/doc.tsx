import React from "react";
import { UrlRoute } from "../../src/history";
import { Icon } from "rich/component/view/icon";


export function ProductDocView() {
    if (window.shyConfig.isUS) return <></>
    return <div>
        <div className="shy-site-block bg-white">
            <div className="flex padding-h-30">
                <div className="flex-fixed">
                    <h1 className="f-48" >新一代的笔记和文档</h1>
                    <p className="text-1 f-16 gap-b-20">
                        简单、强大、美丽。<br />借助诗云的灵活构建模块，更高效地沟通。
                    </p>
                    <div>
                        <a href={UrlRoute.getUrl('/sign/in')}
                            className="text-white bg-button-dark  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                        >免费使用</a>
                    </div>
                </div>
                <div className="flex-auto flex-end">
                    <img className="max-w-600 " src='../static/img/doc/pic.webp' />
                </div>
            </div>



            <div>

                <div className="flex">
                    <div>
                        <div><Icon size={48} icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3>会议记录</h3>
                        <p>将人员和项目与更新和行动项目联系起来。</p>
                    </div>

                    <div>
                        <div><Icon size={48} icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3>设计系统</h3>
                        <p>您公司的所有设计资产都集中在一个地方。</p>
                    </div>

                    <div>
                        <div><Icon size={48} icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3>项目要求</h3>
                        <p>可定制的 PRD 适合任何类型项目。。</p>
                    </div>

                    <div>
                        <div><Icon size={48} icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3>演讲平台</h3>
                        <p>以动态的方式讲述您公司的故事。。</p>
                    </div>

                </div>

                <div>
                    <div><img className="w100" src={'../static/img/doc/pic.webp'} /></div>
                    <div style={{ display: 'none' }}><img className="w100" src={'../static/img/doc/pic.webp'} /></div>
                    <div style={{ display: 'none' }}><img className="w100" src={'../static/img/doc/pic.webp'} /></div>
                    <div style={{ display: 'none' }}><img className="w100" src={'../static/img/doc/pic.webp'} /></div>
                </div>

            </div>


            <div>
                <h1>超越文本与摘要，开启无限可能</h1>
                <div className="flex">

                    <div className="flex-auto">
                        <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3>代码片段</h3>
                        <p>数十种语言的本机语法高亮显示。</p>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>

                    <div className="flex-auto">
                        <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3>代码片段</h3>
                        <p>数十种语言的本机语法高亮显示。</p>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>

                    <div className="flex-auto">
                        <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3>代码片段</h3>
                        <p>数十种语言的本机语法高亮显示。</p>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>




                </div>
                <div className="flex">
                    <div className="flex-auto">
                        <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3>代码片段</h3>
                        <p>数十种语言的本机语法高亮显示。</p>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>


                    <div className="flex-auto">
                        <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3>代码片段</h3>
                        <p>数十种语言的本机语法高亮显示。</p>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>


                    <div className="flex-auto">
                        <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3>代码片段</h3>
                        <p>数十种语言的本机语法高亮显示。</p>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                <h1>让你的团队达成共识</h1>
                <div>
                    <img src={'../static/img/doc/doc-pic-5.png'} />
                </div>
                <div>

                    <div>
                        <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                        <h3>共同协作处理文档</h3>
                        <p>只需输入@键即可引起某人的注意。</p>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex-auto">
                            <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                            <h3>共同协作处理文档</h3>
                            <p>只需输入@键即可引起某人的注意。</p>
                            <div>
                                <img className="w100" src={'../static/img/doc/pic.webp'} />
                            </div>
                        </div>
                        <div className="flex-auto">
                            <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                            <h3>评论让事情继续异步发展</h3>
                            <p>通过整合反馈视图，可以轻松进行迭代，甚至跨办公室和时区。</p>
                            <div>
                                <img className="w100" src={'../static/img/doc/pic.webp'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h1>面向项目经理、设计师、工程师以及所有相关人员</h1>
                <div className="flex">
                    <div className="flex-auto">
                        <h3>产品</h3>
                        <p>将路线图与目标联系起来，让人们了解何时运送什么。</p>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>
                    <div className="flex-auto">
                        <h3>设计</h3>
                        <p>提前审核轮次、确定请求的优先顺序并满足所有创意截止日期。</p>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>
                    <div className="flex-auto">
                        <h3>工程</h3>
                        <p>通过冲刺、代码指南、错误修复等，在一个地方更快地交付功能。</p>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                <h1>选择一个模板开始</h1>

                <div>
                    <img src={'../static/img/doc/doc-pic-3.png'} />
                </div>

                <div className="flex">
                    <div className="flex-auto">
                        <h3>Mixpanel 的每日站立会议和任务</h3>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>

                    </div>
                    <div className="flex-auto" >
                        <h3>诗云 的产品需求文档</h3>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>

                    </div>
                    <div className="flex-auto">
                        <h3>Netflix 的品牌框架</h3>
                        <div>
                            <img className="w100" src={'../static/img/doc/pic.webp'} />
                        </div>

                    </div>

                </div>
            </div>

        </div>


    </div>
}