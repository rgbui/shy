import React from "react";
import { UrlRoute } from "../../src/history";
import { Icon } from "rich/component/view/icon";
import { observer, useLocalObservable } from "mobx-react";

export var ProductDataTable = observer(function () {
    var local = useLocalObservable<{
        index: number
    }>(() => {
        return {
            index: 0
        }
    })

    if (window.shyConfig.isUS) return <></>
    return <div>
        <div className="shy-site-block  padding-h-30">
            <div className="flex padding-h-30">
                <div className="flex-fixed max-w-500">
                    <h1 className="f-48" style={{ fontSize: 64 }} >智能表格 + 工作流 + 应用搭建</h1>
                    <p className="text-1 f-20 gap-b-20">
                        一体化数字化平台，让您的团队比以前更快、更自信地工作。
                    </p>
                    <div>
                        <a href={UrlRoute.getUrl('/sign/in')}
                            className="bg-primary-1-hover  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                        >免费使用</a>
                    </div>
                </div>
                <div className="flex-auto flex-end">
                    <img className="max-w-600 " src='../static/img/db/datatable-pic-1.png' />
                </div>
            </div>
        </div>


        <div className="shy-site-block   padding-h-80">
            <div>
                <h1 className="flex padding-h-30 flex-center f-48">诗云数据表有什么能力？</h1>
                <p className="text-1 f-16 gap-b-20">
                    注意！诗云数据表不是表格，而是将复杂的IT系统，做到傻瓜操作， 无需掌握复杂的公式或者函数计算，即学即用，不论背景，轻松上手
                </p>
                <div className="border round-16  padding-20 ">

                    <div className="flex flex-full col-3-g20 r-border-box gap-h-20">
                        <div className="bg-2 shadow-s padding-h-20 flex flex-col flex-center">
                            <Icon size={100} className={'text-p1-color'} icon={{ name: 'byte', code: 'peoples-two' }}></Icon>
                            <p className="f-18 bold flex-center">多人实时协同能力</p>
                        </div>
                        <div className="bg-2 shadow-s padding-h-20 flex flex-col flex-center">
                            <Icon size={100} className={'text-p1-color'} icon={{ name: 'byte', code: 'form-one' }}></Icon>
                            <p className="f-18 bold flex-center">表单设计能力</p>
                        </div>
                        <div className="bg-2 shadow-s padding-h-20 flex flex-col flex-center">
                            <Icon size={100} className={'text-p1-color'} icon={{ name: 'byte', code: 'data-switching' }}></Icon>
                            <p className="f-18 bold flex-center">数据联动能力</p>
                        </div>
                    </div>

                    <div className="flex flex-full col-3-g20 r-border-box gap-h-20">
                        <div className="bg-2 shadow-s padding-h-20 flex flex-col flex-center">
                            <Icon size={100} className={'text-p1-color'} icon={{ name: 'byte', code: 'lightning' }}></Icon>
                            <p className="f-18 bold flex-center">办公自动化能力</p>
                        </div>
                        <div className="bg-2 shadow-s padding-h-20 flex flex-col flex-center">
                            <Icon size={100} className={'text-p1-color'} icon={{ name: 'byte', code: 'network-tree' }}></Icon>
                            <p className="f-18 bold flex-center">自定义适配业务能力</p>
                        </div>
                        <div className="bg-2 shadow-s padding-h-20 flex flex-col flex-center">
                            <Icon size={100} className={'text-p1-color'} icon={{ name: 'byte', code: 'network-drive' }}></Icon>
                            <p className="f-18 bold flex-center">云端共享能力</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div className="shy-site-block   padding-h-80">
            <div>
                <div className="relative">
                    <h1 className="flex padding-h-30 flex-center f-48">无限可配置，因此您可以按照自己想要的方式工作</h1>

                    <div className="flex col-2-g20 gap-h-20">

                        <div className="flex-auto bg-2 padding-h-10 round-8">
                            <div className="padding-w-20 gap-t-10"><Icon className={'text-p1-color'} size={32} icon={{ name: 'byte', code: 'table-file' }}></Icon></div>
                            <h3 className="padding-w-20 gap-t-10 gap-b-5">记录表格中的每个细节</h3>
                            <p className="padding-w-20 f-14 text-1">追踪所有可推动更大规模发布的特定项目，以免出现任何疏漏。<br />&nbsp;&nbsp; </p>
                            <div className="gap-t-30 gap-l-20 relative h-300 overflow-hidden">
                                <img className="pos border round-16 shadow-s w-700 " alt="记录表格" style={{ top: 0, left: 0 }} src={'../static/img/db/db-table.png'} />
                            </div>
                        </div>

                        <div className="flex-auto bg-2 padding-h-10 round-8">
                            <div className="padding-w-20 gap-t-10"><Icon className={'text-p1-color'} size={32} icon={{ name: 'byte', code: 'calendar' }}></Icon></div>
                            <h3 className="padding-w-20 gap-t-10 gap-b-5">查看日历上绘制的每个截止日期</h3>
                            <p className="padding-w-20 f-14 text-1">管理多日发布？为任何项目添加日历视图，这样您就可以准确查看发货内容和发货时间。</p>
                            <div className="gap-t-30 gap-l-20 relative h-300 overflow-hidden">
                                <img className="pos border round-16 shadow-s  w-600"
                                    style={{ top: 0, left: 0 }}
                                    src={'../static/img/db/db-calendar.png'}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="flex col-2-g20  gap-h-20">

                        <div className="flex-auto bg-2 padding-h-10 round-8">
                            <div className="padding-w-20 gap-t-10"><Icon className={'text-p1-color'} size={32} icon={{ name: 'byte', code: 'target' }}></Icon></div>
                            <h3 className="padding-w-20 gap-t-10 gap-b-5">选择您想要追踪的确切信息</h3>
                            <p className="padding-w-20 f-14 text-1">创建您自己的优先级标签、状态标签等，以便每个团队都能制定完美的工作流程。</p>
                            <div className="gap-t-30 gap-l-20 relative h-300 overflow-hidden">
                                <img className="pos border round-16 shadow-s  w-600" alt="追踪信息" src={'../static/img/db/db-option.png'} />
                            </div>
                        </div>

                        <div className="flex-auto bg-2 padding-h-10 round-8">
                            <div className="padding-w-20 gap-t-10"><Icon className={'text-p1-color'} size={32} icon={{ name: 'byte', code: 'filter' }}></Icon></div>
                            <h3 className="padding-w-20 gap-t-10 gap-b-5">过滤和排序信息以查看所需内容</h3>
                            <p className="padding-w-20 f-14 text-1">仅显示分配给您的任务或标记为紧急的项目。以对您最有帮助的方式分解任何复杂项目。</p>
                            <div className="gap-t-30 gap-l-20 relative h-300 overflow-hidden">
                                <img className="pos border round-16 shadow-s w-700 " alt="过滤和排序信息" src={'../static/img/db/db-filter.png'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div className="shy-site-block padding-h-80">
            <div>
                <div className="relative">
                    <h1 className="flex padding-h-30 flex-center f-48">高级统计轻松处理复杂数据、千万数据</h1>
                    <p className="text-1 flex-center f-14  f-18">
                        高级统计内置 BI 能力，图表类型丰富，可结合视图对复杂数据、大数据快速完成统计分析。
                    </p>
                    <div className="gap-h-20">
                        <img alt="统计BI图表" className="w100 border round-16 shadow-s " src={'../static/img/db/db-charts.png'} />
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block padding-h-80">
            <div>
                <div className="relative">
                    <h1 className="flex padding-h-30 flex-center f-48">搭建专属外部应用，与客户更方便地协作</h1>
                    <p className="text-1  flex-center f-18">在表格基础上搭建通用应用、数据查询等多种外部应用。通过一个共享链接就可以让他人使用。不用编程，0 基础制作自己的专属应用。</p>
                    <p className="flex-center gap-t-10"><a className="cursor" href='https://template.shy.live/page/546' target="_blank">浏览模板地址</a></p>
                    <div className="gap-h-20">
                        <img alt="应用外部协作" className="w100 border round-16 shadow-s" src={'../static/img/db/db-app.png'} />
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div style={{
                backgroundImage: 'url(../static/img/db/datatable-pic-2.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: 450
            }}>
                <div className="padding-20  relative w-500 h-120">
                    <div className="pos round w100 h100" style={{
                        zIndex: 1,
                        backgroundColor: 'rgba(0,0,0,.6)'
                    }}></div>
                    <div className="pos round border-box padding-w-10 w100 h100  text-white " style={{
                        zIndex: 2
                    }} >
                        <h1>我们如何帮助您的业务增长？</h1>
                        <p>我们的技术帮助人们创造更好的工作、生活、公司和社区。</p>
                    </div>
                </div>
            </div>
        </div>


        <div className="shy-site-block   padding-h-80">
            <div>
                <h1 className="flex padding-h-30 flex-center f-48">丰富多样的应用场景</h1>
                <p className="text-1 flex-center f-14">诗云 提供了丰富的功能及可视化操作，可以根据不同的业务需求，快速实现各种业务系统和软件应用，帮企业灵活地定制自己的数字化平台。</p>


                <div className="flex flex-full col-3-g20 gap-h-20 r-border-box">

                    <div onMouseEnter={e => { local.index = 0 }} className="flex-auto padding-l-30 flex shy-site-block-card-hover h-80">
                        <div className="flex-fixed flex-center size-36 gap-r-10 "><Icon size={36} className={'text-p1-color'} icon={{ name: 'byte', code: "plan" }}></Icon></div>
                        <span className="f-24">工作计划管理</span>
                    </div>

                    <div onMouseEnter={e => { local.index = 1 }} className="flex-auto padding-l-30 flex shy-site-block-card-hover h-80">
                        <div className="flex-fixed flex-center size-36 gap-r-10 "><Icon size={36} className={'text-p1-color'} icon={{ name: 'byte', code: "list-view" }}></Icon></div>
                        <span className="f-24">项目管理</span>
                    </div>

                    <div onMouseEnter={e => { local.index = 2 }} className="flex-auto padding-l-30 flex shy-site-block-card-hover h-80">
                        <div className="flex-fixed flex-center size-36 gap-r-10 "><Icon size={36} className={'text-p1-color'} icon={{ name: 'byte', code: "people" }}></Icon></div>
                        <span className="f-24">客户关系管理</span>
                    </div>

                </div>

                <div className="flex flex-full col-3-g20 gap-h-20 r-border-box">

                    <div onMouseEnter={e => { local.index = 3 }} className="flex-auto padding-l-30 flex shy-site-block-card-hover h-80">
                        <div className="flex-fixed flex-center size-36 gap-r-10 "><Icon size={36} className={'text-p1-color'} icon={{ name: 'byte', code: "sales-report" }}></Icon></div>
                        <span className="f-24">进销存管理</span>
                    </div>

                    <div onMouseEnter={e => { local.index = 4 }} className="flex-auto padding-l-30 flex shy-site-block-card-hover h-80">
                        <div className="flex-fixed flex-center size-36 gap-r-10 "><Icon size={36} className={'text-p1-color'} icon={{ name: 'byte', code: "analysis" }}></Icon></div>
                        <span className="f-24">数据统计分析</span>
                    </div>

                    <div onMouseEnter={e => { local.index = 5 }} className="flex-auto padding-l-30 flex shy-site-block-card-hover h-80">
                        <div className="flex-fixed flex-center size-36 gap-r-10 "><Icon size={36} className={'text-p1-color'} icon={{ name: 'byte', code: "application-one" }}></Icon></div>
                        <span className="f-24">零代码搭建应用</span>
                    </div>

                </div>

                <div className="gap-h-20">
                    <div style={{ display: local.index == 0 ? "block" : 'none' }}><img className="w100 border round-16 shadow-s" src={'../static/img/db/db-meet.png'} /></div>
                    <div style={{ display: local.index == 1 ? "block" : 'none' }}><img className="w100 border round-16 shadow-s" src={'../static/img/db/db-plan.png'} /></div>
                    <div style={{ display: local.index == 2 ? "block" : 'none' }}><img className="w100 border round-16 shadow-s" src={'../static/img/db/db-1.png'} /></div>

                    <div style={{ display: local.index == 3 ? "block" : 'none' }}><img className="w100 border round-16 shadow-s" src={'../static/img/db/db-2.png'} /></div>
                    <div style={{ display: local.index == 4 ? "block" : 'none' }}><img className="w100 border round-16 shadow-s" src={'../static/img/db/db-charts.png'}/></div>
                    <div style={{ display: local.index == 5 ? "block" : 'none' }}><img className="w100 border round-16 shadow-s" src={'../static/img/db/db-app.png'} /></div>
                </div>

            </div>

        </div>



    </div>
}
)