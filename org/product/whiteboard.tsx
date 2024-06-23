import React from "react";
import { UrlRoute } from "../../src/history";

export function ProductWhiteBoard() {
    return <div style={{backgroundColor:'#fbf7ef'}}>

        <div className="shy-site-block">
            <h1>
                思考和创造，全部在一个白板内完成。
            </h1>
            <p>诗云白板，一个激发创意和点燃团队协作的空间。集思维表达，灵感梳理，流程整理，任务管理，素材收集，笔记文档多种创意表达能力于一体，将创造和团队效率提升到新的层次。</p>
            <div>
                <a href={UrlRoute.getUrl('/sign/in')}
                    className="text-white bg-button-dark  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                >免费使用</a>
            </div>
        </div>



        <div className="shy-site-block">
            <h1>简单易用，直接深入诗云白板</h1>
            <div className="flex">

                <div>
                    <h3>流程图</h3>
                    <div>
                        <img src='../static/img/board/Process_Mapping.svg' />
                    </div>
                </div>

                <div>
                    <h3>回顾</h3>
                    <div>
                        <img src='../static/img/board/Retrospectives.svg' />
                    </div>
                </div>


                <div>
                    <h3>思维导图</h3>
                    <div>
                        <img src='../static/img/board/Mind_Map.svg' />
                    </div>
                </div>

                <div>
                    <h3>规模化产品规划</h3>
                    <div>
                        <img src='../static/img/board/Scaled_Product_Planning.svg' />
                    </div>
                </div>


                <div>
                    <h3>白板</h3>
                    <div>
                        <img src='../static/img/board/Whiteboarding.svg' />
                    </div>
                </div>


                <div>
                    <h3>技术图表</h3>
                    <div>
                        <img src='../static/img/board/Technical_diagramming.svg' />
                    </div>
                </div>


                <div>
                    <h3>客户旅程地图</h3>
                    <div>
                        <img src='../static/img/board/Customer_Journey_Mapping.svg' />
                    </div>
                </div>


                <div>
                    <h3>线框图</h3>
                    <div>
                        <img src='../static/img/board/Wireframing.svg' />
                    </div>
                </div>

                <div>
                    <h3>战略与规划</h3>
                    <div>
                        <img src='../static/img/board/Strategy___Planning.svg' />
                    </div>
                </div>

            


            </div>
        </div>


        <div className="shy-site-block">

            <div className="flex">
                <div>
                    <div>
                        <img className="max-w-600 " src='../static/img/doc/pic.webp' />
                    </div>
                    <h3>什么都能放</h3>
                    <p>支持插入任意文件，支持插入任意媒体资源，支持嵌入任意网站和第三方在线产品</p>
                </div>

                <div>
                    <div>
                        <img className="max-w-600 " src='../static/img/doc/pic.webp' />
                    </div>
                    <h3>什么都能做</h3>
                    <p>一体化工具平台，支持AI问答、AI生成思维导图、流程图、绘图、画笔、文档、看板、表格、资源库等多种创意工作和内容；支持每一个参与者自由挥洒自己的创意</p>
                </div>

            </div>

        </div>

        <div className="shy-site-block">
            <div className="flex">
                <div className="flex-fixed">
                    <h1>各式对象满足你的表达欲</h1>
                    <p>
                        诗云 白板中的所有内容都是称心如意的对象，包括便利贴、图形、线条和图片等。无论是豪放派还是婉约派，都能在白板上自由表达和有序整理自己的想法。所有内容都以可视化的方式呈现，方便在所有设备上浏览。
                    </p>
                </div>
                <div className="flex-auto">
                    <img className="max-w-600 " src='../static/img/doc/pic.webp' />
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <h1>视觉组织</h1>
            <p>诗云白板 灵活的拖放界面让您可以按照对您的项目有意义的方式安排事物。</p>
        </div>

        <div>
            <h1>团队的实时协作工作台</h1>
            <p>随时随地，围绕一块白板沟通
            </p>
            <div>

            </div>
        </div>

        <div>
            <h1>设计师使用 诗云白板 来组织他们的项目</h1>
            <div>

                <label>头脑风暴</label>
                <label>策略&分析</label>
                <label>会议&工作坊</label>
                <label>UX设计</label>
                <label>服装设计</label>
                <label>室内空间</label>
                <label>工业设计</label>
                <label>平面设计</label>
                <label>电商物料</label>


            </div>
        </div>
        <div>
            <div style={{
                backgroundImage: 'url(../static/img/board/board-pic.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: 400

            }}>

                <h1>帮助世界上最具创新精神的公司更好地进行日常协作</h1>
                <p></p>
            </div>

        </div>


        <div className="shy-site-block">

            <h1>激发团队创造力的新方式</h1>
            <p>
                准备好开始使用诗云白板了吗？
            </p>
            <div>
                <a href={UrlRoute.getUrl('/sign/in')}
                    className="text-white bg-button-dark  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                >免费使用</a>
            </div>
        </div>


    </div>
}