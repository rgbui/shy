import React from "react";
import { UrlRoute } from "../../src/history";

export function ProductChannel() {
    if (window.shyConfig.isUS) return <></>
    return <div style={{ backgroundColor: 'rgb(255, 228, 228)' }}>
        <div className="shy-site-block   padding-h-30">

            <div className="flex">
                <div className="flex-auto gap-r-30">
                    <h1 className="f-48">专为兴趣爱好和快乐打造的交流社区</h1>
                    <p className="f-16 text-1">
                        诗云频道 是与朋友们一起协作、放松、交流的社区平台。您可以自由定制自己的一方天地，在其中聊天、兴趣爱好，与朋友共度美好时光。
                    </p>
                    <div className="gap-t-20">
                        <a href={UrlRoute.getUrl('/sign/in')}
                            className="text-white bg-button-dark  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                        >免费使用</a>
                    </div>
                </div>
                <div className="flex-fixed w-600">
                    <img className="w100 border round-16 shadow-s " src='../static/img/channel/users.jpeg' />
                </div>
            </div>

        </div>

        {/* <div className="shy-site-block  padding-h-80">

            <div className="flex flex-top">
                <div className="flex-auto gap-r-30">
                    <h1 className="f-48">让您的群聊更有趣</h1>
                    <p  className="f-14 text-1">使用自定义表情符号、贴纸和音板音效等功能，让您的语音、视频或文字聊天更有个人特色。设置专属头像，设定个性状态，撰写个人资料，让您的风格在聊天中脱颖而出。</p>
                </div>
                <div className="flex-fixed w-600">
                    <img className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                </div>
            </div>

        </div> */}

        <div className="shy-site-block   padding-h-80">
            <div className="flex  flex-top">
                <div className="flex-fixed w-600 gap-r-30">
                    <img className="w100 border round-16 shadow-s " src='../static/img/channel/home.png' />
                </div>
                <div className="flex-auto">
                    <h1 className="f-48">和我们一起建立归属感</h1>
                    <p className="f-16 text-1">在这里，我们携手共建归属感，让每一个你我都成为彼此的温暖依靠。加入我们，共享这份温馨与和谐，让归属感成为我们共同前行的力量。因为，有了归属感，心灵才能扎根，梦想才能翱翔！</p>
                </div>
            </div>
        </div>

        <div className="shy-site-block   padding-h-80">

            <div className="flex  flex-top">
                <div className="flex-auto gap-r-30">
                    <h1 className="f-48">看看有谁可以一起玩</h1>
                    <p className="f-16 text-1">切换不同的社区，在这里，每一处转角都是风景，每一次相遇都是故事。</p>
                </div>
                <div className="flex-fixed w-600">
                    <img className="w100 border round-16 shadow-s " src='../static/img/channel/girl.png' />
                </div>
            </div>

        </div>


        <div className="shy-site-block padding-h-80">
            <h1 className="f-48 flex-center">专为兴趣爱好和快乐打造的交流社区</h1>
            <p className="text-1 f-18 gap-b-20 flex-center">加入我们，开启一场心灵之旅，让社区协作成为一种生活态度。</p>
            <div className="flex-center">
                <a href={UrlRoute.getUrl('/sign/in')}
                    className="text-white bg-button-dark  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                >免费使用</a>
            </div>
            <div className="h-80"></div>
        </div>

        <div className="shy-site-block h-80"></div>

        {/* <div className="shy-site-block   padding-h-80">
            <div className="flex  flex-top">
                <div className="flex-fixed w-600 gap-r-30">
                    <img className="w100 border round-16 shadow-s " src='../static/img/doc/pic.webp' />
                </div>
                <div className="flex-auto">
                    <h1  className="f-48">总有可以一起做的事</h1>
                    <p className="f-16 text-1">一起看看视频、玩玩内置游戏、听听音乐，或者分享好玩的梗图。文本聊天、语音通话、视频聊天、游戏娱乐，所有功能都可无缝切换，在群聊中即可享受一切。</p>
                </div>
            </div>
        </div> */}


    </div>
}