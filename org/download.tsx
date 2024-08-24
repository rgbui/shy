import React from "react";
import { Icon } from "rich/component/view/icon";
import { S, Sp } from "rich/i18n/view";
import { config } from "../common/config";
import { ChevronDownSvg } from "rich/component/svgs";
export function DownloadView() {
    return <div >
        <div className="shy-site-block">
            <div className="shy-site-download" style={{ paddingTop: 0 }}>
                <div className="h-80"></div>
                <h2 className="shy-site-block-head flex-center "><S text='诗云客户端-title'>下载诗云客户端</S></h2>
                <div className="flex-center gap-b-20 shy-site-block-remark"><S text='诗云客户端-description'>独自或与团队一起工作，不受干扰，享受生活美好时光</S></div>
                <div className="shy-site-download-platforms">

                    <div style={{ backgroundColor: 'rgb(239, 246, 255)' }} className="shy-site-download-platform shy-site-block-card">
                        <div className="shy-site-download-platform-icon">
                            <img className="size-50 obj-center" src='static/img/windows.svg' />
                        </div>
                        <p><span><S>Windows 客户端</S></span></p>
                        <p style={{ paddingTop: 20 }}><a className="item-primary-hover" data-download-win href={`https://resources.shy.live/app/download/诗云-${VERSION_CLIENT.replace('-pro', '')}.zip`}
                            download={config.isUS ? "Shy" : "诗云"}><S>下载</S></a></p>
                    </div>

                    <div style={{ backgroundColor: 'rgb(243, 244, 246)' }} className="shy-site-download-platform shy-site-block-card">
                        <div className="shy-site-download-platform-icon">
                            <img src='static/img/d-mac.svg' />
                        </div>
                        <p><span><S>Mac OS 客户端</S></span></p>
                        <p style={{ paddingTop: 20 }}><a className="item-primary-hover" data-download-mac href={`https://resources.shy.live/app/download/诗云-${VERSION_CLIENT.replace('-pro', '')}.dmg`}
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
                    <img className="w-600" src={config.isUS || true ? 'static/img/download-pic.png' : "static/img/download-pic.png"} />
                </div>

                <h2 className="shy-site-block-head flex-center"><S>下载诗云服务端</S></h2>
                <div className="flex-center gap-b-20  shy-site-block-remark "><S text='安装在那里数据存那里'>免费的私有云(支持局域网），安装在那里，数据存那里</S></div>
                <div className="shy-site-download-platforms">

                    <div className="shy-site-download-platform max-w-300  shy-site-block-card">
                        <div className="shy-site-download-platform-icon ">
                            <img className="size-50 obj-center" src='static/img/windows.svg' />
                        </div>
                        <p><span><S>Windows 诗云服务端</S></span></p>
                        <p style={{ paddingTop: 20 }}><a data-download-win href={`https://resources.shy.live/app-server/download/诗云服务端-${VERSION_SERVER_CLIENT.replace('-pro', '')}.zip`}
                            download={config.isUS ? "Shy Server" : "诗云服务端"}><S>申请试用</S></a></p>
                    </div>

                    <div className="shy-site-download-platform max-w-300  shy-site-block-card">
                        <div className="shy-site-download-platform-icon" style={{ color: '#EF4444' }}>
                            <Icon size={56} icon={{ name: "byte", code: 'install' }}></Icon>
                        </div>
                        <p><span><S>手动安装</S></span></p>
                        <p style={{ paddingTop: 20 }}><a data-download-mac href={`https://resources.shy.live/app-server/download/诗云服务端-soft-${VERSION_SERVER_CLIENT.replace('-pro', '')}.zip`}
                            download={config.isUS ? "Shy Server" : "诗云服务端"}><S>待支持...</S></a></p>
                    </div>

                </div>
            </div>

        </div>

        <div className="shy-site-block">
            <div>
                <h3 className="flex-center shy-site-block-head gap-t-70"><S>常见问题</S></h3>

                <div className="border-top padding-t-10 padding-b-20">
                    <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                        <span className="flex-auto">
                            诗云为什么免费支持本地及私有云？
                        </span>
                        <span data-toggle-icon style={{ transform: 'rotate(0deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                            <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                        </span>
                    </div>
                    <div className="remark f-16 l-24">
                        我们坚信产品的价值在于广泛使用。在成本可控的前提下，我们乐意支持大家充分利用诗云。
                    </div>
                </div>
                <div className="border-top padding-t-10 padding-b-20">
                    <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                        <span className="flex-auto">
                            安装过程中遇到问题怎么办？
                        </span>

                        <span data-toggle-icon style={{ transform: 'rotate(0deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                            <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                        </span>

                    </div>
                    <div className="remark f-16 l-24" >
                        建议你参考我们的<a className="link" href='https://help.shy.live'>诗云产品帮肋文档</a>,或加我们用户群，或者你到我们的<a className="link" href='https://community.shy.live/' target="_blank">云云社区</a>提问，我们会尽力帮助你解决问题。
                    </div>
                </div>

                <div className="border-top padding-t-10 padding-b-20">
                    <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                        <span className="flex-auto">
                            诗云是如何支持单机本地？
                        </span>
                        <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                            <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                        </span>
                    </div>
                    <div className="remark f-16 l-24" style={{ display: 'none' }}>
                        安装诗云客户端，并一次性配置Mongodb本地存储，即可享受与云端同步的体验。
                        默认设置即可轻松完成Mongodb安装，具体步骤详见<a className="link" href='https://help.shy.live/page/2174' target="_blank">客户端安装指南</a>。
                    </div>
                </div>

                <div className="border-top padding-t-10 padding-b-20">
                    <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                        <span className="flex-auto">
                            诗云是如何支持私有云的？
                        </span>
                        <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                            <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                        </span>
                    </div>
                    <div className="remark f-16 l-24" style={{ display: 'none' }}>
                        我们提供诗云服务端，您可在闲置Windows电脑或阿里云租赁的Windows服务器上，按指示完成安装。<br />
                        详细操作请参考<a className="link" href='https://help.shy.live/page/295' target="_blank">诗云服务端安装教程</a>
                    </div>
                </div>

                <div className="border-top padding-t-10 padding-b-20">
                    <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                        <span className="flex-auto">
                            诗云的本地和私有云有什么限制？
                        </span>
                        <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                            <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                        </span>
                    </div>
                    <div className="remark f-16 l-24" style={{ display: 'none' }}>
                        无论是本地还是私有云，均需联网使用统一的诗云账号，避免大量的重复注册。<br />
                        产品功能无特殊限制，按云端资源消耗计费。<br />
                        本地资源充足时，诗云功能可无限使用。

                    </div>
                </div>

            </div>
        </div>

        <div className="shy-site-block">
            <div className="h-100"></div>
        </div>

    </div>
}