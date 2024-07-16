import React from "react";
import { UrlRoute } from "../../src/history";

export function ProductPPT() {
    if (window.shyConfig.isUS) return <></>
    return <div style={{
        background: 'linear-gradient(#faf2e9, rgba(250, 242, 233, 0))'
    }}>
        <div className="shy-site-block   padding-h-30">
            <h1 className="f-48 flex-center">表达想法的新媒介</h1>
            <p className="text-1 f-16 gap-b-20  flex-center">精美的演示文稿、文档和网站。 无需设计或编码技能。</p>
            <div className="flex-center">
                <a href={UrlRoute.getUrl('/sign/in')}
                    className="text-white bg-primary bg-primary-hover  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                >免费使用</a>
            </div>

            <div className="gap-h-20">
                <img className="w100 border round-16 shadow-s " alt='表达想法的新媒介' src='../static/img/ppt/ppt-1.png' />
            </div>
        </div>

        <div className="shy-site-block padding-h-80">
            <div className="flex flex-top">
                <div className="flex-auto gap-r-30">
                    <h1 className="f-48">设计精彩，无需编码技能</h1>
                    <p className="text-1 f-16 gap-b-20 ">轻松构建和共享动态内容</p>
                    <ol style={{ padding: 0 }}>
                        <li style={{ listStyle: 'none' }} className="gap-h-10">
                            🎥  参与互动画廊、视频和嵌入内容
                        </li>
                        <li style={{ listStyle: 'none' }} className="gap-h-10">
                            📈  使用精美的图表、图解和表格来可视化数据
                        </li>
                        <li style={{ listStyle: 'none' }} className="gap-h-10">   🖼️ 使用多功能预制模板快速启动您的项目
                        </li>
                    </ol>
                </div>
                <div className="flex-fixed  w-600">
                    <img className="w100 border round-16 shadow-s " src='../static/img/ppt/ppt-2.png'  />
                </div>
            </div>

        </div>

        <div className="shy-site-block padding-h-80">
            <div className="flex flex-top">
                <div className="flex-fixed  w-600">
                    <img className="w100 border round-16 shadow-s " src='../static/img/ppt/ppt-3.png'  />
                </div>
                <div className="flex-auto gap-l-30">
                    <h1 className="f-48">设计幻灯片变得前所未有地轻松</h1>
                    <p className="text-1 f-16 gap-b-20 ">键入反斜杠构建块，创建设计精美、影响力十足的幻灯片。</p>
                </div>
            </div>
        </div>

        <div className="shy-site-block padding-h-80">
            <div className="flex flex-top">
                <div className="flex-auto gap-r-30">
                    <h1 className="f-48">易于分享和发布</h1>
                    <p className="text-1 f-16 gap-b-20 ">使用任何设备吸引用户</p>
                    <ol style={{ padding: 0 }}>
                        <li style={{ listStyle: 'none' }} className="gap-h-10">
                            📱 在任何屏幕上提供适合移动设备的内容
                        </li>
                        <li style={{ listStyle: 'none' }} className="gap-h-10">
                            📊 通过内置的高级分析功能跟踪参与度
                        </li>
                        <li style={{ listStyle: 'none' }} className="gap-h-10"> 💬  实时连接和协作
                        </li>
                    </ol>
                </div>
                <div className="flex-fixed w-600">
                    <img alt="多人协作" className="w100 border round-16 shadow-s " src='../static/img/ppt/ppt-users.png' />
                </div>
            </div>
        </div>

        <div className="shy-site-block padding-h-80">
            <h1 className="f-48 flex-center">打开新宇宙的大门</h1>
            <p className="text-1 f-16 gap-b-20 flex-center">比文档更直观。比幻灯片更具有协作性。比视频更具互动性。</p>
            <div className="flex-center">
                <a href={UrlRoute.getUrl('/sign/in')}
                    className="text-white bg-button-dark  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                >免费使用</a>
            </div>
        </div>


    </div>
}