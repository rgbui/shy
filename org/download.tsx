import React from "react";
import { Icon } from "rich/component/view/icon";
export function DownloadView() {
    return <div >
        <div className="shy-site-block">
            <div className="flex gap-h-20 gap-t-100 flex-center error h-40">更新频繁，暂时不支持下载，请使用Web版</div>
            <div className="shy-site-download" style={{ paddingTop: 0 }}>
                <div className="flex-center">
                    <img className="w-300" src='static/img/person-read.svg' />
                </div>
                <h2 className="shy-site-block-head flex-center ">适用于 Mac 和 Windows的诗云客户端</h2>
                <div className="flex-center gap-b-20 shy-site-block-remark">独自或与团队一起工作，不受干扰，享受生活美好时光</div>
                <div className="shy-site-download-platforms">
                    <div style={{ backgroundColor: 'rgb(243, 244, 246)' }} className="shy-site-download-platform shy-site-block-card">
                        <div className="shy-site-download-platform-icon">
                            <img src='static/img/d-mac.svg' />
                        </div>
                        <p><span>Mac OS 客户端</span></p>
                        <p style={{ paddingTop: 20 }}><a className="item-primary-hover" data-download-mac href="https://resources.shy.live/app/download/shy-0.8.23.dmg"
                            download="诗云">下载</a></p>
                    </div>
                    <div style={{ backgroundColor: 'rgb(239, 246, 255)' }} className="shy-site-download-platform shy-site-block-card">
                        <div className="shy-site-download-platform-icon">
                            <img className="size-50 obj-center" src='static/img/windows.svg' />
                        </div>
                        <p><span>Windows 客户端</span></p>
                        <p style={{ paddingTop: 20 }}><a className="item-primary-hover" data-download-win href="https://resources.shy.live/app/download/shy-0.8.23.zip"
                            download="诗云">下载</a></p>
                    </div>
                    <div style={{ backgroundClip: 'rgb(240, 253, 244)' }} className="shy-site-download-platform shy-site-block-card">
                        <div className="shy-site-download-platform-icon">
                            <img src='static/img/d-android.svg' />
                        </div>
                        <p><span>Android 客户端</span></p>
                        <p style={{ paddingTop: 20 }}><a className="item-primary-hover">开发中...</a></p>
                    </div>
                    <div style={{ backgroundColor: 'rgb(254, 242, 242)' }} className="shy-site-download-platform shy-site-block-card">
                        <div className="shy-site-download-platform-icon" style={{ color: '#EF4444' }}>
                            <Icon size={50} icon={{ name: 'bytedance-icon', code: 'iphone' }}></Icon>
                        </div>
                        <p><span>AppStore iOS</span></p>
                        <p style={{ paddingTop: 20 }}><a className="item-primary-hover">开发中...</a></p>
                    </div>
                </div>
            </div>

            <div className="shy-site-download">

                <div className="flex-center">
                    <img className="w-400" src='static/img/user-leaf.svg' />
                </div>
                <h2 className="shy-site-block-head flex-center">免费的本地及私有化数据存储诗云服务端</h2>
                <div className="flex-center gap-b-20  shy-site-block-remark ">安装在那里，数据存那里</div>
                <div className="shy-site-download-platforms">

                    <div className="shy-site-download-platform max-w-300  shy-site-block-card">
                        <div className="shy-site-download-platform-icon ">
                            <img className="size-50 obj-center" src='static/img/windows.svg' />
                        </div>
                        <p><span>Windows 诗云服务端</span></p>
                        <p style={{ paddingTop: 20 }}><a data-download-win href="https://resources.shy.live/app/download/shy-0.8.23.zip"
                            download="诗云服务端">下载</a></p>
                    </div>

                    <div className="shy-site-download-platform max-w-300  shy-site-block-card">
                        <div className="shy-site-download-platform-icon">
                            <img src='static/img/d-mac.svg' />
                        </div>
                        <p><span>Mac OS 诗云服务端</span></p>
                        <p style={{ paddingTop: 20 }}><a data-download-mac href="https://resources.shy.live/app/download/shy-0.8.23.dmg"
                            download="诗云">下载</a></p>
                    </div>

                </div>
            </div>

        </div>

        <div className="shy-site-block">
            <div className="gap-h-30">
                <div className="padding-14">
                    <div className="f-16 bold ">诗云服务端是什么?</div>
                    <div className="remark f-14 l-24 gap-t-10 gap-b-20">
                        诗云服务端与诗云客户端一样都是软件。<br />
                        诗云服务端是一个server后台，负责诗云客户端的数据读存取。<br />
                        将新创建的空间存储数据源设置为安装的诗云服务端，那么在新创建的空间中所产生的数据自动同步至该诗云服务端。
                    </div>
                    <div className="f-16 bold ">诗云服务端与一些本地笔记软件有什么区别?</div>
                    <div className="remark f-14 l-24 gap-t-10 gap-b-20">
                         都能把数据存在本地，但是诗云服务端的使用上更为灵活，可以满足本地局域网协作，
                         <br />另外在安装时会自动安装数据库，可以很好的支持数据表,支持数据备份。
                         <br/>不可甭认，安装会相对麻烦一些，但安装后带来的体验与云端是一致的。
                    </div>
                    <div className="f-16 bold ">诗云服务端使用场景?</div>
                    <div className="remark f-14 l-24 gap-t-10 gap-b-20">
                        场景一：本地笔记<br />
                        将诗云服务端安装在你自已的是电脑上,目前新版诗云客户端与服务端合二为一，争对本地仅安装客户端即可。<br />
                        场景二：局域网内协作<br />
                        尽量找一台空闲的电脑，把诗云服务端安装在这台空闲的电脑上。<br />
                        场景三：私有化部署<br />
                        将诗云服务端安装在你自已的服务器上<br />
                        注意：以上场景都需要保持网络正常连接。<br />
                    </div>
                    <div className="f-16 bold ">连接诗云服务端有什么限制吗?</div>
                    <div className="remark f-14 l-24  gap-t-10 gap-b-20">
                        请保持网络处于连通的状态即可<br />
                        连接的客户端可以是诗云客户端、网页版、手机端。后续的小程序可能无法支持<br />
                    </div>
                </div>
            </div>
        </div>


        <div className="shy-site-block" >
            <div className="padding-h-100">
                <div className="shy-site-block-head flex-center ">丰富的功能性，助你协作事半功倍</div>
                <div className="flex-center gap-b-20 shy-site-block-remark">更多惊喜，释放你的生产力</div>
                <div className="shy-site-block-card padding-14 gap-t-40">
                    <div className="flex flex-top r-gap-10">
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />Markdown语法</div>
                            <div className="remark f-18 padding-l-30 l-30">支持Markdown语法的键入输入</div>
                        </div>
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />数学公式</div>
                            <div className="remark f-18 padding-l-30 l-30 min-h-60">支持Latex公式</div>
                        </div>
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />时实更新</div>
                            <div className="remark f-18 padding-l-30 l-30">多个文档展示同一信息，一处更新，全局时实同步</div>
                        </div>

                    </div>
                    <div className="flex flex-top r-gap-10">
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />大纲</div>
                            <div className="remark f-18 padding-l-30 l-30 min-h-60">组织页面大纲结构</div>
                        </div>
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />双链</div>
                            <div className="remark f-18 padding-l-30 l-30">支持页面关系相互引用</div>
                        </div>
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />标签</div>
                            <div className="remark f-18 padding-l-30 l-30">支持页面标签索引</div>
                        </div>
                    </div>

                    <div className="flex flex-top r-gap-10">
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />关键词搜索</div>
                            <div className="remark f-18 padding-l-30 l-30">基于Elasticsearch服务搜索</div>
                        </div>
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />语义搜索</div>
                            <div className="remark f-18 padding-l-30 l-30 min-h-60">基于空间知识库的AI机器人语义搜索</div>
                        </div>
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />自定义按钮工作流</div>
                            <div className="remark f-18 padding-l-30 l-30">自定义页面的按钮点击事件</div>
                        </div>
                    </div>

                    <div className="flex flex-top r-gap-10">
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />角色权限控制</div>
                            <div className="remark f-18 padding-l-30 l-30">支持设置不同的角色页面权限访问</div>
                        </div>
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />自定义表单收集</div>
                            <div className="remark f-18 padding-l-30 l-30 min-h-60">支持自定义数据表的表单</div>
                        </div>
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />页面点评、点赞等</div>
                            <div className="remark f-18 padding-l-30 l-30">支持页面的点评、点赞、打赏</div>
                        </div>
                    </div>

                    <div className="flex flex-top r-gap-10">
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />历史记录</div>
                            <div className="remark f-18 padding-l-30 l-30">页面历史版本回滚，保存60天</div>
                        </div>
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />数据视图</div>
                            <div className="remark f-18 padding-l-30 l-30 min-h-60">支持丰富的数据表记录模板</div>
                        </div>
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />页面分享</div>
                            <div className="remark f-18 padding-l-30 l-30">支持分享至微信、微博、朋友圈</div>
                        </div>
                    </div>

                    <div className="flex flex-top r-gap-10">
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />应用发布</div>
                            <div className="remark f-18 padding-l-30 l-30">将协作空间发布成知识库、应用站点，支持自定义头部导航菜单</div>
                        </div>
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />微信/Web Clipper剪藏</div>
                            <div className="remark f-18 padding-l-30 l-30 min-h-60">年内支持</div>
                        </div>
                        <div className="w33">
                            <div className="bold f-18 flex r-gap-r-12 l-20 gap-b-5"><img src='static/img/check.svg' />开放API</div>
                            <div className="remark f-18 padding-l-30 l-30">计划中</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
}