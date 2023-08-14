import React from "react";
import { Icon } from "rich/component/view/icon";
import { S, Sp } from "rich/i18n/view";
import { config } from "../common/config";
import { SiteFeatures } from "./common/feature";
export function DownloadView() {
    return <div >
        <div className="shy-site-block">
            <div className="flex gap-h-20 gap-t-100 flex-center error h-40"><S text='更新频繁暂时不支持下载请使用Web版'>更新频繁，暂时不支持下载，请使用Web版</S></div>
            <div className="shy-site-download" style={{ paddingTop: 0 }}>
                <div className="flex-center">
                    <img className="w-300" src='static/img/person-read.svg' />
                </div>
                <h2 className="shy-site-block-head flex-center "><S text='诗云客户端-title'>适用于 Mac 和 Windows的诗云客户端</S></h2>
                <div className="flex-center gap-b-20 shy-site-block-remark"><S text='诗云客户端-description'>独自或与团队一起工作，不受干扰，享受生活美好时光</S></div>
                <div className="shy-site-download-platforms">
                    <div style={{ backgroundColor: 'rgb(243, 244, 246)' }} className="shy-site-download-platform shy-site-block-card">
                        <div className="shy-site-download-platform-icon">
                            <img src='static/img/d-mac.svg' />
                        </div>
                        <p><span><S>Mac OS 客户端</S></span></p>
                        <p style={{ paddingTop: 20 }}><a className="item-primary-hover" data-download-mac href="https://resources.shy.live/app/download/shy-0.8.23.dmg"
                            download={config.isUS ? "Shy" : "诗云"}><S>下载</S></a></p>
                    </div>
                    <div style={{ backgroundColor: 'rgb(239, 246, 255)' }} className="shy-site-download-platform shy-site-block-card">
                        <div className="shy-site-download-platform-icon">
                            <img className="size-50 obj-center" src='static/img/windows.svg' />
                        </div>
                        <p><span><S>Windows 客户端</S></span></p>
                        <p style={{ paddingTop: 20 }}><a className="item-primary-hover" data-download-win href="https://resources.shy.live/app/download/shy-0.8.23.zip"
                            download={config.isUS ? "Shy" : "诗云"}><S>下载</S></a></p>
                    </div>
                    <div style={{ backgroundClip: 'rgb(240, 253, 244)' }} className="shy-site-download-platform shy-site-block-card">
                        <div className="shy-site-download-platform-icon">
                            <img src='static/img/d-android.svg' />
                        </div>
                        <p><span><S>Android 客户端</S></span></p>
                        <p style={{ paddingTop: 20 }}><a className="item-primary-hover"><S>开发中...</S></a></p>
                    </div>
                    <div style={{ backgroundColor: 'rgb(254, 242, 242)' }} className="shy-site-download-platform shy-site-block-card">
                        <div className="shy-site-download-platform-icon" style={{ color: '#EF4444' }}>
                            <Icon size={50} icon={{ name: 'bytedance-icon', code: 'iphone' }}></Icon>
                        </div>
                        <p><span><S>AppStore iOS</S></span></p>
                        <p style={{ paddingTop: 20 }}><a className="item-primary-hover"><S>开发中...</S></a></p>
                    </div>
                </div>
            </div>

            <div className="shy-site-download">

                <div className="flex-center">
                    <img className="w-400" src='static/img/user-leaf.svg' />
                </div>
                <h2 className="shy-site-block-head flex-center"><S>免费的本地及私有化数据存储诗云服务端</S></h2>
                <div className="flex-center gap-b-20  shy-site-block-remark "><S text='安装在那里数据存那里'>安装在那里，数据存那里</S></div>
                <div className="shy-site-download-platforms">

                    <div className="shy-site-download-platform max-w-300  shy-site-block-card">
                        <div className="shy-site-download-platform-icon ">
                            <img className="size-50 obj-center" src='static/img/windows.svg' />
                        </div>
                        <p><span><S>Windows 诗云服务端</S></span></p>
                        <p style={{ paddingTop: 20 }}><a data-download-win href="https://resources.shy.live/app/download/shy-0.8.23.zip"
                            download={config.isUS ? "Shy Server" : "诗云服务端"}><S>下载</S></a></p>
                    </div>

                    <div className="shy-site-download-platform max-w-300  shy-site-block-card">
                        <div className="shy-site-download-platform-icon">
                            <img src='static/img/d-mac.svg' />
                        </div>
                        <p><span><S>Mac OS 诗云服务端</S></span></p>
                        <p style={{ paddingTop: 20 }}><a data-download-mac href="https://resources.shy.live/app/download/shy-0.8.23.dmg"
                            download={config.isUS ? "Shy Server" : "诗云服务端"}><S>下载</S></a></p>
                    </div>

                </div>
            </div>

        </div>

        <div className="shy-site-block">
            <div className="gap-h-30">
                <div className="padding-14">
                    <div className="f-16 bold "><S text='诗云服务端是什么'>诗云服务端是什么?</S></div>
                    <div className="remark f-14 l-24 gap-t-10 gap-b-20">
                        <Sp text='诗云服务端是什么-answer'> 诗云服务端与诗云客户端一样都是软件。<br />
                            诗云服务端是一个server后台，负责诗云客户端的数据读存取。<br />
                            将新创建的空间存储数据源设置为安装的诗云服务端，那么在新创建的空间中所产生的数据自动同步至该诗云服务端。</Sp>
                    </div>
                    <div className="f-16 bold "><S text='诗云服务端与本地笔记软件有什么区别'>诗云服务端与一些本地笔记软件有什么区别?</S></div>
                    <div className="remark f-14 l-24 gap-t-10 gap-b-20">
                        <Sp text="诗云服务端与本地笔记软件有什么区别-answer">都能把数据存在本地，但是诗云服务端的使用上更为灵活，可以满足本地局域网协作，
                            <br />另外在安装时会自动安装数据库，可以很好的支持数据表,支持数据备份。
                            <br />不可甭认，安装会相对麻烦一些，但安装后带来的体验与云端是一致的。</Sp>
                    </div>
                    <div className="f-16 bold "><S text='诗云服务端使用场景'>诗云服务端使用场景?</S></div>
                    <div className="remark f-14 l-24 gap-t-10 gap-b-20">
                        <Sp text='诗云服务端使用场景-answer'>
                            场景一：本地笔记<br />
                            将诗云服务端安装在你自已的是电脑上,目前新版诗云客户端与服务端合二为一，争对本地仅安装客户端即可。<br />
                            场景二：局域网内协作<br />
                            尽量找一台空闲的电脑，把诗云服务端安装在这台空闲的电脑上。<br />
                            场景三：私有化部署<br />
                            将诗云服务端安装在你自已的服务器上<br />
                            注意：以上场景都需要保持网络正常连接。<br />
                        </Sp>
                    </div>
                    <div className="f-16 bold "><S text='连接诗云服务端有什么限制'>连接诗云服务端有什么限制吗?</S></div>
                    <div className="remark f-14 l-24  gap-t-10 gap-b-20">
                        <Sp text='连接诗云服务端有什么限制-answer'>
                            请保持网络处于连通的状态即可<br />
                            连接的客户端可以是诗云客户端、网页版、手机端。后续的小程序可能无法支持<br /></Sp>
                    </div>
                </div>
            </div>
        </div>


        <div className="shy-site-block" >
            <div className="padding-h-100">
                <SiteFeatures></SiteFeatures>
            </div>
        </div>
    </div>
}