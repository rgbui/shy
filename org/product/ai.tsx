import React from "react";
import { ArrowRightSvg, ChevronDownSvg, Edit1Svg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { S } from "rich/i18n/view";
import { UrlRoute } from "../../src/history";
import { config } from "../../common/config";
import { getTypeColor } from "../util";

export function AiView() {

    return <div>
        <div className="shy-site-block">
            <div>
                <div className="padding-t-50">
                    <h1 className={"flex-center " + (config.isUS ? " f-60" : 'f-72')} ><S>诗云AI，智慧的墨水</S></h1>
                    <p className="flex-center remark text-center f-24">
                        跨越写作的边界，编织创作的纽带，在设计的海洋里，
                        <br />链接每一份灵感，让智慧如流水般自由涌动
                    </p>
                    <p className="flex-center gap-h-10">
                        <a href={UrlRoute.getUrl('/sign/in')}
                            className="text-white bg-primary bg-primary-hover cursor round-8 padding-h-15 padding-w-30   flex f-20"
                        ><span className="gap-r-10"><S>免费使用</S></span>
                            <Icon icon={ArrowRightSvg}></Icon>
                        </a>
                    </p>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">

                <h1 className="f-32 flex-center">提高写作水平，让你写作更加自信</h1>
                <div className="gap-h-20 w100  round-16    border shadow-s  bg-white" >
                    <img alt="AI写作" className="w100 round-16 obj-center" src={'../static/img/ai/text-3.png'} />
                </div>


                <div>
                    <div className="flex flex-full flex-auto-mobile-wrap">
                        <div className="w33  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-r-10">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={Edit1Svg}></Icon></div>
                            <div className="h3">修复拼写和语法</div>
                            <div className="f-16 text-1">修复拼写错误、语法错误</div>
                        </div>
                        <div className="w33  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-w-5">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'translation' }}></Icon></div>
                            <div className="h3">翻译</div>
                            <div className="f-16 text-1">现在你可以用日语、西班牙语、德语等语言写作。</div>
                        </div>
                        <div className="w33  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-l-10">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'topic' }}></Icon></div>
                            <div className="h3">润色</div>
                            <div className="f-16 text-1">以不同的语言风格重写你的提案。</div>
                        </div>
                    </div>
                    <div className="flex flex-full flex-auto-mobile-wrap">
                        <div className="w33  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-r-10">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'double-right' }}></Icon></div>
                            <div className="h3">变短或变长</div>
                            <div className="f-16 text-1">在不损失语义的情况下将内容加长或变短。</div>
                        </div>
                        <div className="w33  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-w-5">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'voice-one' }}></Icon></div>
                            <div className="h3">解释</div>
                            <div className="f-16 text-1">为每个人解释专有术语。</div>
                        </div>
                        <div className="w33  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-l-10">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'good-one' }}></Icon></div>
                            <div className="h3">使用更简单的语言</div>
                            <div className="f-16 text-1">使你的提案变的更易理解。</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">
                <div className="shy-site-block-head flex-center">增强你的创造力</div>
                <div className="remark flex-center">克服写作障碍,让诗云AI帮你提供思路</div>
                <div>
                    <div className="shy-site-block-card bg-white padding-w-14 round-8 gap-h-20">
                        <img alt="AI写作" className="w100 round-16 obj-center" src={'../static/img/ai/text-5.png'} />
                    </div>
                </div>
                <div>
                    <div className="flex flex-full flex-auto-mobile-wrap">
                        <div className="w50  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-r-10">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'enter-the-keyboard' }}></Icon></div>
                            <div className="h3"><S>帮我写</S></div>
                            <div>在页面上获取一些内容，而不是盯着闪烁的光标。</div>
                            <div>
                                <img alt="AI写作" className="w100 round-16 obj-center" src={'../static/img/ai/text-1.png'} />
                            </div>
                        </div>
                        <div className="w50  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-l-10">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'doc-add' }}></Icon></div>
                            <div className="h3"><S>继续写</S></div>
                            <div>一个好的开始？诗云 AI 可以从这里获取它。</div>
                            <div>
                                <img alt="AI写作" className="w100 round-16 obj-center" src={'../static/img/ai/text-4.png'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div className="shy-site-block">
            <div className="padding-h-50">
                <div className="shy-site-block-head flex-center">AI智能搜索</div>
                <div className="remark flex-center">
                    问答功能利用您 文档中的信息来帮助您开展工作。您只需提出问题即可。
                </div>

                <div className="gap-h-20 w100  round-16    border shadow-s  bg-white" >
                    <img alt="AI智能搜索" className="w100 round-16 obj-center" src={'../static/img/ai/so.png'} />
                </div>

            </div>
        </div>



        <div className="shy-site-block">
            <div className="gap-h-100 margin-auto ">

                <h1 className="flex-center shy-site-block-head gap-t-30">
                    <S>常见问题</S>
                </h1>

                <h3 className="text-center f-16 remark"><S text='如仍然有问题请至'>如仍然有问题，请至</S><a style={{
                    color: 'inherit',
                    textDecoration: 'underline'
                }} href={config.isUS ? "https://community.shy.red" : 'https://community.shy.live'}><S>云云社区</S></a><S>联系</S></h3>

                <div className="r-gap-b-10">

                    <div className="border-top padding-t-10 padding-b-20">
                        <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                            <span className="flex-auto">
                                如何开启诗云AI?
                            </span>
                            <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                                <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                            </span>
                        </div>
                        <div className="remark f-14 l-24">
                            诗云AI默认是自动开启的，您可以在空间设置中关闭AI写作，详细操作请参考诗云帮助文档。

                        </div>
                    </div>

                    <div className="border-top padding-t-10 padding-b-20">
                        <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                            <span className="flex-auto">
                                诗云AI如何使用我的数据？
                            </span>
                            <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                                <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                            </span>
                        </div>
                        <div className="remark f-14 l-24">
                            空间内的知识默认是不会自动发送给AI服务商，只有当涉及到AI功能时才会发至大模型
                            <br />
                            当您开启空间AI智能搜索时，会将您的数据发送至AI服务商进行向量化处理，如您不希望发送数据，请关闭空间AI智能搜索。


                        </div>
                    </div>

                    <div className="border-top padding-t-10 padding-b-20">
                        <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                            <span className="flex-auto">
                                诗云AI目前使用了那些AI服务商？
                            </span>
                            <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                                <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                            </span>
                        </div>
                        <div className="remark f-14 l-24">
                            诗云AI目前集成了 DeepSeek、智谱、文言一心 <br />
                            诗云AI会根据大家的使用情况，选择最有性价比的AI服务商为您提供AI服务。
                        </div>
                    </div>

                    <div className="border-top padding-t-10 padding-b-20">
                        <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                            <span className="flex-auto">
                                诗云AI是如何定价收费的？
                            </span>
                            <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                                <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                            </span>
                        </div>
                        <div className="remark f-14 l-24">
                            诗云AI目前是按消耗的tokens计量收费的。<br />
                            如果您买了诗云的个人版、协作版 会有默认的tokens，如果您的tokens用完了，会按照tokens的价格进行收费。
                        </div>
                    </div>

                    <div className="border-top padding-t-10 padding-b-20">
                        <div data-toggle className="flex b-500 f-18 text-1 gap-b-5 cursor">
                            <span className="flex-auto">
                                诗云AI提供免费的AI吗？
                            </span>
                            <span data-toggle-icon style={{ transform: 'rotate(90deg)' }} className="ts flex-fixed size-20 flex-center round item-hover">
                                <Icon className={'  remark cursor'} icon={ChevronDownSvg}></Icon>
                            </span>
                        </div>
                        <div className="remark f-14 l-24">
                           我们会集成第三方免费的AI服务商，给您提供免费的AI服务。
                        </div>
                    </div>


                </div>

            </div>

        </div>
        <div className="h-300"></div>
    </div>
}