import React from "react";
import { ChevronDownSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";

export function PriceView()
{
    return <div>
        <div className="shy-site-block">
            <div className="padding-h-50 ">
                <div className="flex-center padding-t-50">
                    <img className="w-350" src='static/img/dog.svg' />
                </div>
                <h1 className="flex-center shy-site-block-head gap-t-30">
                    本地及私有化免费，云端按量计费
                </h1>
                <div className="flex-center remark f-24" >简单而美的收费，用户是我们真诚的朋友</div>
                <div className="flex-center-full r-padding-30 r-round-8 r-bg-white gap-t-20">
                    <div className="gap-r-20 w33 r-gap-b-10 shy-site-block-card" >
                        <div className=" shy-site-block-head flex r-gap-r-10" style={{ fontSize: 28 }}><img src='static/img/local.svg' /><span>本地及私有化免费</span></div>
                        <div className=" f-14 text-1">适用于本地数据安全、敏感的用户。<br />支持自搭服务器，数据自主管理。</div>
                        <div className=" bold" style={{ fontSize: 20 }}>信任</div>
                        <div className=" f-14 text-1 flex"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} className={'gap-r-10 '} size={12}></Icon>无功能限制、无广告、无歧视</div>
                        <div className=" f-14 text-1 flex"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} className={'gap-r-10 '} size={12}></Icon>局域网及自建服务器仍支持多人协作</div>
                        <div className=" f-14 text-1 flex"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} className={'gap-r-10 '} size={12}></Icon>安装<a href='download' style={{ color: 'inherit', textDecoration: 'underline' }}>诗云服务端</a>，安装在那里，数据存那里</div>
                        <div className=" f-14 text-1 flex"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} className={'gap-r-10 '} size={12}></Icon>我们想让更多的人用上诗云，仅此而已</div>
                    </div>
                    <div className="gap-l-20 w33 r-gap-b-10 shy-site-block-card">
                        <div className=" shy-site-block-head flex  r-gap-r-10" style={{ fontSize: 28 }} ><img src='static/img/online.svg' /><span>云端按量计费</span></div>
                        <div className=" f-14 text-1">适用于云端协作办公。<br />为个人及团队的生产效率、社区协作而买单。</div>
                        <div className=" bold" style={{ fontSize: 20 }}>承诺</div>
                        <div className=" f-14 text-1 flex" >
                            <Icon className={'gap-r-10'} icon={{ name: 'bytedance-icon', code: 'check' }} size={12}></Icon>生产力是一种云资源，用多少收多少
                        </div>
                        <div className=" f-14 text-1 flex"><Icon className={'gap-r-10'} icon={{ name: 'bytedance-icon', code: 'check' }} size={12}></Icon>不限功能、不限人数、不限空间</div>
                        <div className=" f-14 text-1 flex"><Icon className={'gap-r-10'} icon={{ name: 'bytedance-icon', code: 'check' }} size={12}></Icon>无会员，无超级会员，无广告、无套路</div>
                        <div className=" f-14 text-1 flex"><Icon className={'gap-r-10'} icon={{ name: 'bytedance-icon', code: 'check' }} size={12}></Icon>无乱收费，按量计费的标准参照云服务商</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="gap-h-50">
                <h2 className="flex-center shy-site-block-head gap-t-30">按需付费套餐包</h2>
                <div className="flex-center remark f-24">不限空间、不限人数、不限功能、按量付费</div>
                <div className="flex gap-t-20">

                    <div className="w25 gap-10 padding-14 shy-site-block-card">
                        <div style={{ fontSize: 24 }} className="bold">个人云端版</div>
                        <div className="remark gap-h-10 f-14 l-24">适用于轻度的知识整理</div>
                        <div className="text-center link-red"><span className="f-20">￥<em style={{ fontSize: 50 }} className="f-50 bold ">99</em></span></div>
                        <div className="bg-primary bg-primary-hover gap-h-20 text-white flex-center h-50 round cursor">立即充值</div>
                        <div className="remark f-14 l-24">包含以下功能：</div>
                        <div className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>云端免费存储<span className="flex-auto flex-end">200M</span></div>
                        <div className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>社区支持</div>
                        <div className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>支持多人协作</div>
                        <div className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>支持诗云AI</div>
                        <div className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>支持公开分享至互联网</div>
                    </div>
                    <div className="w25  gap-10  padding-14 shy-site-block-card">
                        <div style={{ fontSize: 24 }} className="bold">个人专业版</div>
                        <div className="remark gap-h-10 f-14 l-24">适用于个人及小群体,搭建自己的数字花园</div>
                        <div className="text-center link-red"><span className="f-20">￥<em style={{ fontSize: 50 }} className="f-50 bold ">160</em></span><span>年</span><span className="remark del f-12 gap-l-5">199元/年</span></div>
                        <div className="bg-primary bg-primary-hover  gap-h-20  text-white flex-center h-50 round cursor">升级购买</div>
                        <div className="remark f-14 l-24">个人云端版中的所有内容，以及：</div>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>空间<span className="flex-auto flex-end">50G</span></p>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>流量<span className="flex-auto flex-end">250G</span></p>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>数据<span className="flex-auto flex-end">30万条</span></p>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>支持自定义二级域名</p>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>支持开通付费业务</p>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>超出按量计费</p>
                    </div>
                    <div className="w25  gap-10 padding-14 shy-site-block-card">
                        <div style={{ fontSize: 24 }} className="bold">社区版</div>
                        <div className="remark gap-h-10 f-14 l-24">适用于开放性社区，流量无限</div>
                        <div className="text-center  link-red"><span className="f-20">￥<em style={{ fontSize: 50 }} className="f-50 bold">800</em></span><span>年</span><span className="remark del f-12 gap-l-5">999元/年</span></div>
                        <div className="bg-primary-1  bg-primary-1-hover  gap-h-20  text-white flex-center h-50 round cursor">升级购买</div>
                        <div className="remark f-14 l-24">个人专业版中的所有内容，以及：</div>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>空间<span className="flex-auto flex-end">200G</span></p>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>流量<span className="flex-auto flex-end">无限</span></p>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>数据<span className="flex-auto flex-end">200万条</span></p>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>支持自定义域名</p>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>支持独立app发布</p>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>支持商业化运营</p>
                        <p className="text-1 flex f-14 l-24"><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon>超出按量计费</p>
                    </div>
                    <div className="w25   gap-10 padding-14 shy-site-block-card">
                        <div style={{ fontSize: 24 }} className="bold">按量计费</div>
                        <div className="remark gap-h-10 f-14 l-24">适用于用多少，付多少</div>
                        <div className="bg-primary bg-primary-hover gap-h-20 text-white flex-center h-50 round cursor">立即充值</div>
                        <div className="remark f-14 l-24">计费标准：</div>
                        <p className="text-1 flex f-14 l-24 "><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon><label className="flex-auto">存储</label><span className="flex-fixed">2元/年/G</span></p>
                        <p className="text-1 flex f-14 l-24 "><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon><label className="flex-auto">流量</label><span className="flex-fixed">0.5元/G</span></p>
                        <p className="text-1 flex f-14 l-24 "><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon><label className="flex-auto">数据条数</label><span className="flex-fixed">3元/1万行</span></p>
                        <p className="text-1 flex f-14 l-24 "><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon><label className="flex-auto">AI写作</label><span className="flex-fixed">0.5元/1万字</span></p>
                        <p className="text-1 flex f-14 l-24 "><Icon icon={{ name: 'bytedance-icon', code: 'check' }} size={16} className={'gap-r-5 remark '}></Icon><label className="flex-auto">语音</label><span className="flex-fixed">1元/1小时</span></p>

                    </div>

                </div>
            </div>



        </div>

        <div className="shy-site-block">
            <div className="gap-h-30">
                <h3 className="flex-center shy-site-block-head gap-t-30">诗云与其它产品付费区别</h3>

                <div className="border-top padding-h-10">
                    <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                        <span className="flex-auto">本地免费的区别？</span>
                        <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                    </div>
                    <div className="remark f-14 l-24">
                        诗云支持本地、局域网、自建服务器免费，功能与云端无太大区别<br />
                        其它产品本地免费，一般只支持单机，不支持多人协作
                    </div>
                </div>

                <div className="border-top padding-h-10">
                    <div data-toggle className="flex bold f-18 text-1 gap-b-5 cursor">
                        <span className="flex-auto">订阅付费与按量计费的区别？</span>
                        <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                    </div>
                    <div className="remark f-14 l-24">
                        诗云依据空间消耗的资源来计费，付费空间对其它人无付费要求<br />
                        其它产品是按协作人数来计费的，协作者越多，费用越高
                    </div>
                </div>
            </div>
        </div>

        <div className="shy-site-block">
            <div className="flex-center padding-t-100">
                <img className="w-300" src='static/img/no-pa.svg' />
            </div>
        </div>

        <div className="shy-site-block" style={{ display: 'none' }}>
            <div className="padding-h-100">
                <div className="flex-center" style={{ fontSize: '30px' }}>他们都在用诗云</div>
                <div className="flex-center remark f-12 gap-h-20">（*排名不分先后顺序）</div>
                <div className="flex r-gap-w-20 r-gap-h-10 r-w-180 flex-center flex-wrap">
                    <img src='static/img/org/tsinghua.png' />
                    <img src='static/img/org/cpic.png' />
                    <img src='static/img/org/fl1.png' />
                    <img src='static/img/org/logo_beijing.png' />
                    <img src='static/img/org/mo1.png' />
                    <img src='static/img/org/nju.png' />
                    <img src='static/img/org/pa1.png' />
                    <img src='static/img/org/xm1.png' />
                    <img src='static/img/org/logo_xunfei.png' />
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

        <div className="shy-site-block">
            <div className="gap-h-100 margin-auto ">

                <h1 className="flex-center shy-site-block-head gap-t-30">
                    常见问题
                </h1>

                <h3 className="text-center f-16 remark">如仍然有问题，请至<a style={{
                    color: 'inherit',
                    textDecoration: 'underline'
                }} href='https://org.shy.live'>云云社区</a>联系</h3>

                <div className="r-gap-b-10">
                    <div className="border-top padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto">诗云的云端免费额度？</span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            云端有200M的免费流量，协作空间无法公开分享至互联网，但页面可以分享给任何人。<br />
                            无法使用部分收费功能服务，如诗云AI。<br />
                            如果想使用免费的，建议选择本地的存储，本地存储没有任何限制。<br />
                            云端是按量计费的，最低充值99元，按量付费，充一次用很久。<br />
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto">我如何为我的团队进行购买？</span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            诗云是按使用量来计费的，没有按协作人数来收费<br />
                            团队成员需要他们自已充值<br />
                            诗云会提供团购功能，可以通过团购来为团队成员充值<br />
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto">诗云AI的免费额度？</span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            诗云AI目前没有免费额度，诗云AI基于文言一心或GPT。<br />
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto">有什么优惠活动？</span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            会有一系列的相关的优惠活动，请关注官网<br />
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto">诗云AI如何使用我的数据？</span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            诗云采用的是第三方AI，如果使用AI，诗云会将数据发送给大模型。<br />
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto">什么是块？</span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            块是您添加到页面的任何单个内容，例如一段文本、待办事项、图像、代码块、嵌入文件等。将您的页面视为由这些构建组成块。
                        </div>
                    </div>

                    <div className="border-top  padding-h-10">
                        <div data-toggle className="cursor flex bold f-18 text-1 gap-b-5">
                            <span className="flex-auto">你们给学生提供优惠吗？</span>
                            <Icon style={{ transform: 'rotate(90deg)' }} className={'ts flex-fixed remark cursor'} icon={ChevronDownSvg}></Icon>
                        </div>
                        <div style={{ display: 'none' }} className="remark f-14 l-24">
                            会有八折的优惠，需要提供学生证明。
                        </div>
                    </div>
                </div>



            </div>


        </div>

        <div className="min-h-200"></div>


    </div>
}