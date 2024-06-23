import React from "react";
import { UrlRoute } from "../../src/history";
import { Icon } from "rich/component/view/icon";

export function ProductDataTable() {
    if (window.shyConfig.isUS) return <></>
    return <div>
        <div className="shy-site-block bg-white">
            <div className="flex padding-h-30">
                <div className="flex-fixed">
                    <h1 className="f-48" >智能表格 + 工作流 + 应用搭建</h1>
                    <p className="text-1 f-16 gap-b-20">
                        一体化数字化平台，让您的团队比以前更快、更自信地工作。
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
        </div>
        <div className="shy-site-block ">
            <div>
                <h1>无限可配置，因此您可以按照自己想要的方式工作</h1>
            </div>

            <div className="flex">
                <div className="flex-auto">
                    <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                    <h3>记录表格中的每个细节</h3>
                    <p>追踪所有可推动更大规模发布的特定项目，以免出现任何疏漏。</p>
                    <div>
                        <img className="w100" src={'../static/img/doc/pic.webp'} />
                    </div>
                </div>
                <div className="flex-auto">
                    <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                    <h3>查看日历上绘制的每个截止日期</h3>
                    <p>管理多日发布？为任何项目添加日历视图，这样您就可以准确查看发货内容和发货时间。</p>
                    <div>
                        <img className="w100" src={'../static/img/doc/pic.webp'} />
                    </div>
                </div>
            </div>

            <div className="flex">
                <div className="flex-auto">
                    <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                    <h3>选择您想要追踪的确切信息</h3>
                    <p>创建您自己的优先级标签、状态标签等，以便每个团队都能制定完美的工作流程。</p>
                    <div>
                        <img className="w100" src={'../static/img/doc/pic.webp'} />
                    </div>
                </div>
                <div className="flex-auto">
                    <div><Icon icon={{ name: 'byte', code: 'weixin-favorites' }}></Icon></div>
                    <h3>过滤和排序信息以查看所需内容</h3>
                    <p>仅显示分配给您的任务或标记为紧急的项目。以对您最有帮助的方式分解任何复杂项目。</p>
                    <div>
                        <img className="w100" src={'../static/img/doc/pic.webp'} />
                    </div>
                </div>
            </div>






        </div>
        <div className="shy-site-block">
            <h1>诗云数据表有什么能力？</h1>
            <p>
                注意！诗云数据表不是表格，而是将复杂的IT系统，做到傻瓜操作， 无需掌握复杂的公式或者函数计算，即学即用，不论背景，轻松上手
            </p>
            <div>

                <div className="flex">
                    <div>
                        <Icon icon={{name:'byte',code:'page'}}></Icon>
                        <p>多人实时协同能力</p>
                    </div>
                    <div>
                        <Icon icon={{name:'byte',code:'page'}}></Icon>
                        <p>表单设计能力</p>
                    </div>
                    <div>
                        <Icon icon={{name:'byte',code:'page'}}></Icon>
                        <p>数据联动能力</p>
                    </div>
                </div>

                <div className="flex">
                    <div>
                        <Icon icon={{name:'byte',code:'page'}}></Icon>
                        <p>办公自动化能力</p>
                    </div>
                    <div>
                        <Icon icon={{name:'byte',code:'page'}}></Icon>
                        <p>自定义适配业务能力</p>
                    </div>
                    <div>
                        <Icon icon={{name:'byte',code:'page'}}></Icon>
                        <p>云端共享能力</p>
                    </div>
                </div>

            </div>

        </div>

        <div className="shy-site-block">
            <div>
                <h1>丰富多样的应用场景</h1>
                <p>诗云 提供了丰富的功能及可视化操作，可以根据不同的业务需求，快速实现各种业务系统和软件应用，帮企业灵活地定制自己的数字化平台。</p>


                <div className="flex">

                    <div className="flex-auto flex">
                        <div><Icon icon={{ name: 'byte', code: "page" }}></Icon></div>
                        <span>工作计划管理</span>
                    </div>

                    <div className="flex-auto flex">
                        <div><Icon icon={{ name: 'byte', code: "page" }}></Icon></div>
                        <span>项目管理</span>
                    </div>

                    <div className="flex-auto flex">
                        <div><Icon icon={{ name: 'byte', code: "page" }}></Icon></div>
                        <span>客户关系管理</span>
                    </div>

                </div>

                <div className="flex">

                    <div className="flex-auto flex">
                        <div><Icon icon={{ name: 'byte', code: "page" }}></Icon></div>
                        <span>进销存管理</span>
                    </div>

                    <div className="flex-auto flex">
                        <div><Icon icon={{ name: 'byte', code: "page" }}></Icon></div>
                        <span>数据统计分析</span>
                    </div>

                    <div className="flex-auto flex">
                        <div><Icon icon={{ name: 'byte', code: "page" }}></Icon></div>
                        <span>零代码搭建应用</span>
                    </div>

                </div>

                <div>
                    <img className="w100" src={'../static/img/doc/pic.webp'} />
                </div>

            </div>

        </div>
    </div>
}