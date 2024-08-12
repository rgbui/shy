import React from "react";
import { UrlRoute } from "../../src/history";
import { observer, useLocalObservable } from "mobx-react";

export var ProductWhiteBoard = observer(function () 
{

    var local = useLocalObservable<{
        index: number

    }>(() => {
        return {
            index: 0
        }
    })

    return <div style={{ backgroundColor: '#fbf7ef' }}>
        <div className="shy-site-block    padding-h-30">
            <h1 className="f-48 flex-center">
                白板之上，思考与创造完美呈现
            </h1>
            <p className="text-1 f-16 gap-b-20  flex-center">
                <span className="max-w-600 inline-block l-22">
                    诗云白板，融合了思维表达、灵感梳理、流程整理、任务管理、素材搜集与笔记文档等多种功能，一站式提升创造力与团队效率，开启工作的新境界。
                </span>
            </p>
            <div className="flex-center">
                <a href={UrlRoute.getUrl('/sign/in')}
                    className="text-white  bg-primary-1-hover  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                >免费使用</a>
            </div>
            <div className="gap-h-20">
                <img className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
            </div>
        </div>



        <div className="shy-site-block   padding-h-80">
            <h1 className="f-48 flex-center">简单易用，直接深入诗云白板</h1>
            <div className="flex w100 overflow-x r-gap-w-20 padding-h-20" style={{ 'paddingBottom': 30 }}>

                <div className="shy-site-block-card-hover padding-10 round ">
                    <h3 className="flex-center">流程图</h3>
                    <div>
                        <img src='../static/img/board/Process_Mapping.svg' />
                    </div>
                </div>

                <div className="shy-site-block-card-hover padding-10 round ">
                    <h3 className="flex-center">回顾</h3>
                    <div>
                        <img src='../static/img/board/Retrospectives.svg' />
                    </div>
                </div>


                <div className="shy-site-block-card-hover padding-10 round ">
                    <h3 className="flex-center">思维导图</h3>
                    <div>
                        <img src='../static/img/board/Mind_Map.svg' />
                    </div>
                </div>

                <div className="shy-site-block-card-hover padding-10 round ">
                    <h3 className="flex-center">规模化产品规划</h3>
                    <div>
                        <img src='../static/img/board/Scaled_Product_Planning.svg' />
                    </div>
                </div>

                <div className="shy-site-block-card-hover padding-10 round ">
                    <h3 className="flex-center">白板</h3>
                    <div>
                        <img src='../static/img/board/Whiteboarding.svg' />
                    </div>
                </div>

                <div className="shy-site-block-card-hover padding-10 round ">
                    <h3 className="flex-center">技术图表</h3>
                    <div>
                        <img src='../static/img/board/Technical_diagramming.svg' />
                    </div>
                </div>

                <div className="shy-site-block-card-hover padding-10 round ">
                    <h3 className="flex-center">客户旅程地图</h3>
                    <div>
                        <img src='../static/img/board/Customer_Journey_Mapping.svg' />
                    </div>
                </div>

                <div className="shy-site-block-card-hover padding-10 round ">
                    <h3 className="flex-center">线框图</h3>
                    <div>
                        <img src='../static/img/board/Wireframing.svg' />
                    </div>
                </div>

                <div className="shy-site-block-card-hover padding-10 round ">
                    <h3 className="flex-center">战略与规划</h3>
                    <div>
                        <img src='../static/img/board/Strategy___Planning.svg' />
                    </div>
                </div>
                <div style={{ visibility: 'hidden' }} className="shy-site-block-card-hover padding-10 round ">
                    <div style={{ width: 200 }}></div>
                </div>


            </div>
        </div>


        <div className="shy-site-block   padding-h-80">
            <div>
                <h1 className="flex-center f-48 ">将所有内容集中在一个地方</h1>

                <div className="flex col-4-g20 r-border-box">
                    <div>
                        <div>
                            <img className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                        </div>
                        <h3>写笔记和待办事项清单</h3>
                        <p>简单的文本编辑和任务管理可让您轻松地将想法添加到板上。</p>
                    </div>

                    <div>
                        <div>
                            <img className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                        </div>
                        <h3>上传图片和文件</h3>
                        <p>诗云 支持所有常见的文件类型，包括 JPG、PDF、Word、Excel、常见设计文件等等。</p>
                    </div>

                    <div>
                        <div>
                            <img className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                        </div>
                        <h3>保存来自网络的文本、图片和链接</h3>
                        <p>简单的文本编辑和任务管理可让您轻松地将想法添加到板上。</p>
                    </div>

                    <div>
                        <div>
                            <img className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                        </div>
                        <h3>从手机添加笔记和照片</h3>
                        <p>当您返回计算机时，您在Milanote 应用程序中保存的所有内容均可立即进行整理。</p>
                    </div>

                </div>
            </div>

        </div>

        <div className="shy-site-block   padding-h-80">
            <div className="flex  flex-top">
                <div className="flex-auto">
                    <h1 className="f-48 ">各式对象满足你的表达欲</h1>
                    <p className="text-1 f-16 gap-b-20 ">
                        诗云 白板中的所有内容都是称心如意的对象，包括便利贴、图形、线条和图片等。无论是豪放派还是婉约派，都能在白板上自由表达和有序整理自己的想法。所有内容都以可视化的方式呈现，方便在所有设备上浏览。
                    </p>
                </div>
                <div className="flex-fixed w-600 gap-l-30">
                    <img className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                </div>
            </div>
        </div>

        <div className="shy-site-block  padding-h-80">
            <div className="flex flex-top">
                <div className="flex-fixed w-600">
                    <img className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                </div>
                <div className="flex-auto gap-l-30">
                    <h1 className="f-48 flex-center">视觉组织</h1>
                    <p className="text-1 f-16 gap-b-20 flex-center">诗云白板 灵活的拖放界面让您可以按照对您的项目有意义的方式安排事物。</p>
                </div>
            </div>

        </div>

        <div className="shy-site-block  padding-h-80">
            <h1 className="f-48 flex-center">团队的实时协作工作台</h1>
            <p className="text-1 f-16 gap-b-20 flex-center">随时随地，围绕一块白板沟通</p>
            <div>
                <img className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
            </div>
        </div>

        <div className="shy-site-block  padding-h-80">
            <div>
                <h1 className="f-48 flex-center">设计师使用 诗云白板 来组织他们的项目</h1>
                <div className="flex flex-center shy-site-block-card-hover  h-60  r-padding-w-20 r-round-16 r-h-40 r-flex-center r-curor ">

                    <label onMouseDown={e => { local.index = 0 }} style={{ backgroundColor: local.index == 0 ? "#f4ecff" : "" }} className={" " + (local.index == 0 ? "text-p1-color" : "")}>头脑风暴</label>
                    <label onMouseDown={e => { local.index = 1 }} style={{ backgroundColor: local.index == 1 ? "#f4ecff" : "" }} className={" " + (local.index == 1 ? "text-p1-color" : "")}>策略&分析</label>
                    <label onMouseDown={e => { local.index = 2 }} style={{ backgroundColor: local.index == 2 ? "#f4ecff" : "" }} className={" " + (local.index == 2 ? "text-p1-color" : "")}>会议&工作坊</label>
                    <label onMouseDown={e => { local.index = 3 }} style={{ backgroundColor: local.index == 3 ? "#f4ecff" : "" }} className={" " + (local.index == 3 ? "text-p1-color" : "")}>UX设计</label>
                    <label onMouseDown={e => { local.index = 4 }} style={{ backgroundColor: local.index == 4 ? "#f4ecff" : "" }} className={" " + (local.index == 4 ? "text-p1-color" : "")}>服装设计</label>
                    <label onMouseDown={e => { local.index = 5 }} style={{ backgroundColor: local.index == 5 ? "#f4ecff" : "" }} className={" " + (local.index == 5 ? "borde</div>r-bottom" : "")}>室内空间</label>
                    <label onMouseDown={e => { local.index = 6 }} style={{ backgroundColor: local.index == 6 ? "#f4ecff" : "" }} className={" " + (local.index == 6 ? "text-p1-color" : "")}>工业设计</label>
                    <label onMouseDown={e => { local.index = 7 }} style={{ backgroundColor: local.index == 7 ? "#f4ecff" : "" }} className={" " + (local.index == 7 ? "text-p1-color" : "")}>平面设计</label>
                    <label onMouseDown={e => { local.index = 8 }} style={{ backgroundColor: local.index == 8 ? "#f4ecff" : "" }} className={" " + (local.index == 8 ? "text-p1-color" : "")}>电商物料</label>

                </div>

                <div className="gap-h-20">
                    <img style={{ display: local.index == 0 ? "block" : "none" }} className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                    <img style={{ display: local.index == 1 ? "block" : "none" }} className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                    <img style={{ display: local.index == 2 ? "block" : "none" }} className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                    <img style={{ display: local.index == 3 ? "block" : "none" }} className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                    <img style={{ display: local.index == 4 ? "block" : "none" }} className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                    <img style={{ display: local.index == 5 ? "block" : "none" }} className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                    <img style={{ display: local.index == 6 ? "block" : "none" }} className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                    <img style={{ display: local.index == 7 ? "block" : "none" }} className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                    <img style={{ display: local.index == 8 ? "block" : "none" }} className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                </div>
            </div>


        </div>
        <div className="padding-h-80" >
            <div style={{

                backgroundImage: 'url(../static/img/board/board-pic.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: 400

            }}>
                <div className="shy-site-block">

                    <div className="text-white bold " style={{ paddingTop: 120 }}>
                        {/* <h1 className="f-30 gap-b-10 flex-center">帮助世界上最具创新精神的公司更好地进行日常协作</h1> */}
                        <p className="f-22 flex-center ">
                            <span className="max-w-800 inline-block">我们的工作室墙提供了协作的清晰性和自由度，助力我们做出明智决策。诗云白板将其数字化，让我们随时随地协作。</span>
                        </p>
                    </div>

                </div>


            </div>

        </div>


        <div className="shy-site-block   padding-h-80">

            <h1 className="f-48 flex-center">激发团队创造力的新方式</h1>
            <p className="text-1 f-16 gap-b-20 flex-center">
                准备好开始使用诗云白板了吗？
            </p>
            <div className="flex-center">
                <a href={UrlRoute.getUrl('/sign/in')}
                    className="text-white bg-button-dark  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                >免费使用</a>
            </div>
        </div>


    </div>
})