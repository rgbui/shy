import React from "react";
import { UrlRoute } from "../../src/history";

export function ProductPPT() {
    if (window.shyConfig.isUS) return <></>
    return <div>
        <div className="shy-site-block">
            <h1>表达想法的新媒介</h1>
            <p>精美的演示文稿、文档和网站。 无需设计或编码技能。</p>
            <div>
                <a href={UrlRoute.getUrl('/sign/in')}
                    className="text-white bg-button-dark  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                >免费使用</a>
            </div>

            <div>
                <img className="max-w-600 " src='../static/img/doc/pic.webp' />
            </div>
        </div>

        <div className="shy-site-block">
            <div className="flex">
                <div className="flex-auto">
                    <h1>设计精彩，无需编码技能</h1>
                    <p>轻松构建和共享动态内容</p>
                    <ol>
                        <li>
                            🎥  参与互动画廊、视频和嵌入内容
                        </li>
                        <li>
                            📈  使用精美的图表、图解和表格来可视化数据
                        </li>
                        <li>   🖼️ 使用多功能预制模板快速启动您的项目
                        </li>
                    </ol>
                </div>
                <div className="flex-fixed">
                    <img className="max-w-600 " src='../static/img/doc/pic.webp' />
                </div>
            </div>

        </div>

        <div className="shy-site-block">
            <div className="flex">
                <div className="flex-fixed">
                    <img className="max-w-600 " src='../static/img/doc/pic.webp' />
                </div>
                <div className="flex-auto">
                    <h1>设计幻灯片变得前所未有地轻松</h1>
                    <p>利用 PowerPoint 中的“设计器”和“创意”，创建设计精美、影响力十足的幻灯片。</p>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="flex">
                <div className="flex-auto">
                    <h1>易于分享和发布</h1>
                    <p>使用任何设备吸引用户</p>
                    <ol>
                        <li>
                            📱
                            在任何屏幕上提供适合移动设备的内容
                        </li>
                        <li>
                            📊
                            通过内置的高级分析功能跟踪参与度
                        </li>
                        <li> 💬
                            实时连接和协作
                        </li>
                    </ol>
                </div>
                <div className="flex-fixed">
                    <img className="max-w-600 " src='../static/img/doc/pic.webp' />
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <h1>打开新宇宙的大门</h1>
            <p>比文档更直观。比幻灯片更具有协作性。比视频更具互动性。</p>
            <div>
                <a href={UrlRoute.getUrl('/sign/in')}
                    className="text-white bg-button-dark  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                >免费使用</a>
            </div>
        </div>


    </div>
}