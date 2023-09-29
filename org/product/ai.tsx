import React from "react";
import { ArrowRightSvg, ChevronDownSvg, Edit1Svg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { S, Sp } from "rich/i18n/view";
import { UrlRoute } from "../../src/history";
import { config } from "../../common/config";
import { getTypeColor } from "../util";
export function AiView()
{

    return <div>
        <div className="shy-site-block">
            <div>
                <div className="padding-t-50">
                    <h1 className={"flex-center " + (config.isUS ? " f-60" : 'f-72')} ><S>诗云AI.你的私人智能肋手</S></h1>
                    <p className="flex-center remark text-center f-24">
                        <S text='发挥AI的无限力量-description'>全新的人机协作体验，发挥 AI 的无限力量。写的更好，工作更快，想象更美好。</S>
                    </p>
                    <p className="flex-center gap-h-10">
                        <a href={UrlRoute.getUrl('/sign/in')}
                            className="text-white bg-primary bg-primary-hover cursor round-8 padding-h-15 padding-w-30   flex f-20"
                        ><span className="gap-r-10"><S>免费使用</S></span>
                            <Icon icon={ArrowRightSvg}></Icon>
                        </a>
                    </p>
                    <div className="gap-h-30 flex-center  relative">
                        <img style={{ border: '8px solid #000', width: '80%' }} className="border round-16 obj-center " src={UrlRoute.getUrl("static/img/pic.png")} />
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">
                <div className="shy-site-block-head flex-center"><S>写的更好</S></div>
                <div className="remark flex-center"><S text='写的更好-description'>提高写作水平，让你写作更加自信</S></div>
                <div className="shy-site-block-card bg-white padding-w-14 round-8 gap-h-20">
                    <video className="w100 obj-center" title="ai gen mp4" width="100%"
                        muted={true} loop={true} autoPlay={true} controls={false}
                    // poster="https://sanity-images.imgix.net/production/b7f2a0a42e872c4c29b78ceb086b4937e1d6a226-1040x1000.png?h=450&amp;dpr=2&amp;w=&amp;auto=format%2Ccompress"
                    ><source src={UrlRoute.getUrl("static/img/ai-gen.mp4")}
                        type="video/mp4" />
                    </video>
                </div>
                <div>
                    <div className="flex flex-full flex-auto-mobile-wrap">
                        <div className="w33  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-r-10">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={Edit1Svg}></Icon></div>
                            <div className="h3"><S>修复拼写和语法</S></div>
                            <div><S text="修复拼写和语法-description">修复拼写错误、语法错误</S></div>
                        </div>
                        <div className="w33  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-w-5">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'translation' }}></Icon></div>
                            <div className="h3"><S>翻译</S></div>
                            <div><S text="翻译-description">现在你可以用日语、西班牙语、德语等语言写作。</S></div>
                        </div>
                        <div className="w33  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-l-10">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'topic' }}></Icon></div>
                            <div className="h3"><S>润色</S></div>
                            <div><S text="润色-description">以不同的语言风格重写你的提案。</S></div>
                        </div>
                    </div>
                    <div className="flex flex-full flex-auto-mobile-wrap">
                        <div className="w33  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-r-10">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'double-right' }}></Icon></div>
                            <div className="h3"><S>变短或变长</S></div>
                            <div><S text="变短或变长-description">在不损失语义的情况下将内容加长或变短。</S></div>
                        </div>
                        <div className="w33  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-w-5">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'voice-one' }}></Icon></div>
                            <div className="h3"><S>解释</S></div>
                            <div><S text="解释-description">为每个人解释专有术语。</S></div>
                        </div>
                        <div className="w33  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-l-10">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'good-one' }}></Icon></div>
                            <div className="h3"><S>使用更简单的语言</S></div>
                            <div><S text="使用更简单的语言-description">使你的提案变的更易理解。</S></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="padding-h-50">
                <div className="shy-site-block-head flex-center"><S>增强你的创造力</S></div>
                <div className="remark flex-center"><S text='增强你的创造力-description'>克服写作障碍,让诗云AI帮你定初稿</S></div>
                <div>
                    <div className="shy-site-block-card bg-white padding-w-14 round-8 gap-h-20">
                        <video className="w100 obj-center" title="ai gen mp4" width="100%"
                            muted={true} loop={true} autoPlay={true} controls={false}
                        // poster="https://sanity-images.imgix.net/production/b7f2a0a42e872c4c29b78ceb086b4937e1d6a226-1040x1000.png?h=450&amp;dpr=2&amp;w=&amp;auto=format%2Ccompress"
                        ><source src={UrlRoute.getUrl("static/img/ai-gen.mp4")}
                            type="video/mp4" />
                        </video>
                    </div>
                </div>
                <div>
                    <div className="flex flex-full flex-auto-mobile-wrap">
                        <div className="w50  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-r-10">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'enter-the-keyboard' }}></Icon></div>
                            <div className="h3"><S>帮我写</S></div>
                            <div><S text='帮我写-description'>在页面上获取一些内容，而不是盯着闪烁的光标。</S></div>
                            <div>
                                <img className="obj-center w100 h100" src={UrlRoute.getUrl("static/img/pic.png")} />
                            </div>
                        </div>
                        <div className="w50  gap-b-20 round-8 padding-14 shy-site-block-card bg-white gap-l-10">
                            <div style={getTypeColor('ai')}><Icon size={30} icon={{ name: 'bytedance-icon', code: 'doc-add' }}></Icon></div>
                            <div className="h3"><S>继续写</S></div>
                            <div><S text="继续写-description">一个好的开始？诗云 AI 可以从这里获取它。</S></div>
                            <div>
                                <img className="obj-center w100 h100" src={UrlRoute.getUrl("static/img/pic.png")} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div className="shy-site-block">
            <div className="padding-h-50">
                <div className="shy-site-block-head flex-center"><S>AI机器人</S></div>
                <div className="remark flex-center"><Sp text="ai-AI机器人-description">自定义的你的AI机器人，全新的人机协作。</Sp></div>
                <div></div>
                <div>

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
                }} href={config.isUS ? "https://community.shy.red" : 'https://org.shy.live'}><S>云云社区</S></a><S>联系</S></h3>

                <div className="r-gap-b-10">
                    <div className="border-top padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto"><S text='如何激活诗云AI'>如何激活诗云AI？</S></span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            <Sp text='如何激活诗云AI-answer'>诗云AI 默认提供所有用户使用。您可以使用空格键、突出显示文本并选择“诗云AI”或通过斜线命令来触发诗云AI。<br />
                                也在可以空间设置中更换AI使用的模型或关闭AI功能<br />
                            </Sp>
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto"><S text='诗云AI与其他人工智能工具有何不同'>诗云AI与其他人工智能工具有何不同？</S></span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            <Sp text='诗云AI与其他人工智能工具有何不同-answer'>
                                诗云 当然不是唯一的人工智能工具。但 诗云 AI 的特别之处在于：<br />
                                1.当人工智能集成到您已经完成工作、存储笔记和文档以及与他人协作的地方时，它会变得更加有用。无需在笔记和单独的人工智能工具之间来回切换。<br />
                                2.与其他工具相比，诗云 具有独特且高度灵活的拖放文本编辑器，可以轻松地重新排列和转换任何 AI 生成的内容。随着时间的推移，诗云 AI 将能够利用更多 诗云 功能。<br />
                                3.如今，诗云 AI 在您的笔记和文档中具有多种用途。但 诗云 的功能远不止笔记——我们将继续扩展 诗云 AI 的功能，以帮助未来的项目管理和团队知识库。这仅仅是个开始！<br />
                            </Sp>
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto"><S text='诗云AI如何使用我的数据'>诗云AI如何使用我的数据？</S></span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            <Sp text={'ai-诗云AI如何使用我的数据-answer'}>
                                诗云空间里面的知识内容不会自动发送给AI，只有当涉及到AI的数据才会发至大模型<br />
                                诗云目前调用了第三方AI，无法避免发送数据，在使用中，请注意保护自己的隐私。<br />
                                诗云目前集成了GPT，该功能仅限于诗云内部产品的研发、探索及用户体验，不建议你商业化使用。<br />
                                如你使用，造成的数据安全问题需要你自行承担。<br /></Sp>
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto"><S text="诗云AI有免费试用版吗">诗云AI有免费试用版吗？</S></span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            <Sp text="诗云AI有免费试用版吗-answer">诗云AI支持一定的免费体验额度，如你需要大量使用，建议充值。<br /></Sp>
                        </div>
                    </div>

                </div>

            </div>

        </div>
        <div className="h-300"></div>
    </div>
}