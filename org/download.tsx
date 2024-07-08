import React from "react";
import { Icon } from "rich/component/view/icon";
import { S, Sp } from "rich/i18n/view";
import { config } from "../common/config";
import { SiteFeatures } from "./common/feature";
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
                    <div className="remark f-14 l-24">
                        我们认为产品最大价值在于更多的人使用它。在不大幅增加成本的情况下，我们很乐意的去支持大家对诗云的使用。
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
                    <div className="remark f-14 l-24" >
                        建议你参考我们的<a style={{ textDecoration: 'underline', color: 'inherit' }} href='https://help.shy.live'>诗云产品帮肋文档</a>,或加我们用户群，或者你到我们的<a style={{ textDecoration: 'underline', color: 'inherit' }} href='https://community.shy.live/' target="_blank">云云社区</a>提问，我们会尽力帮助你解决问题。
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
                    <div className="remark f-14 l-24" style={{ display: 'none' }}>
                        下载我们的诗云客户端，安装Mongodb，开启本地存储，享受与云端一样的体验。<br />
                        只是额外安装Mongodb数据库，仅安装一次，一路的默认下去，操作非常简单，详细操作参考<a style={{ textDecoration: 'underline', color: 'inherit' }} href='https://help.shy.live/page/2174' target="_blank">诗云客户端安装手册</a><br />
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
                    <div className="remark f-14 l-24" style={{ display: 'none' }}>
                        我们提供了诗云服务端，您可以找台空闲的windows电脑或在阿里云租台windows服务器，按着相应的要求安装诗云服务端即可。<br />
                        详细操作请参考<a style={{ textDecoration: 'underline', color: 'inherit' }} href='https://help.shy.live/page/295' target="_blank">诗云服务端安装教程</a>
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
                    <div className="remark f-14 l-24" style={{ display: 'none' }}>
                        不管是本地还是私有云，都需要联网，因为诗云的帐号是统一的。<br />
                        产品功能上没有什么特别的限制，我们是按着消耗的云端资源来收费的。<br />
                        如果您的本地资源足够，那么您可以无限制的使用诗云的功能。
                    </div>
                </div>

            </div>

        </div>

      
    </div>
}