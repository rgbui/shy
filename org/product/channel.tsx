import React from "react";
import { UrlRoute } from "../../src/history";

export function ProductChannel() {
    if (window.shyConfig.isUS) return <></>
    return <div>
        <div className="shy-site-block">

            <div className="flexx">
                <div className="flex-fixed">
                    <h1>专为兴趣爱好和快乐打造的群聊</h1>
                    <p>
                        诗云频道 是与朋友们一起协作、放松，甚至是打造全球社区的理想平台。您可以自由定制自己的一方天地，在其中聊天、兴趣爱好，与朋友共度美好时光。
                    </p>
                    <div>
                        <a href={UrlRoute.getUrl('/sign/in')}
                            className="text-white bg-button-dark  cursor round-8 padding-h-10 padding-w-20   flex flex-inline f-20"
                        >免费使用</a>
                    </div>
                </div>
                <div className="flex-auto">
                    
                </div>
            </div>

        </div>

        <div className="shy-site-block">

            <div className="flex">
                <div>
                    <h1>让您的群聊更有趣</h1>
                    <div>使用自定义表情符号、贴纸和音板音效等功能，让您的语音、视频或文字聊天更有个人特色。设置专属头像，设定个性状态，撰写个人资料，让您的风格在聊天中脱颖而出。</div>
                </div>

            </div>

        </div>

        <div className="shy-site-block">
            <div className="flex">
                <div>
                    <h1>和我们一起建立归属感
                    </h1>
                </div>
            </div>
        </div>

        <div className="shy-site-block">

            <div className="flex">
                <div>
                    <h1>看看有谁可以一起玩</h1>
                    <div>探索附近的玩家，看看他们正在玩什么游戏，或者是否只是在这儿消遣。如果游戏兼容，您甚至可以看到朋友们正在玩的模式或角色，并且可以立即加入其中。</div>
                </div>

            </div>

        </div>

        <div className="shy-site-block">

            <div className="flex">
                <div>
                    <h1>总有可以一起做的事</h1>
                    <div>一起看看视频、玩玩内置游戏、听听音乐，或者分享好玩的梗图。文本聊天、语音通话、视频聊天、游戏娱乐，所有功能都可无缝切换，在群聊中即可享受一切。</div>
                </div>

            </div>

        </div>


    </div>
}