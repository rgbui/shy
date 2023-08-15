import React from "react";
import { config } from "../../common/config";
import { S } from "rich/i18n/view";
import { UrlRoute } from "../../src/history";
import { refShyPage } from "../util";
import { SelectBox } from "rich/component/view/select/box";
import { langOptions, ls } from "rich/i18n/store";
import { GlobalLinkSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";


export class FooterView extends React.Component {
    render(): React.ReactNode {
        return <div className="shy-site-footer padding-gap">
            <div className="max-w-400">
                {!config.isUS && <><div><img className="w-150" src={UrlRoute.getUrl('static/img/logo.text.png')} /></div>
                    <div className="flex r-gap-r-10 gap-t-10">
                        <a className="relative visible-hover">
                            <img className='visible pos size-200' style={{ top: -200, left: 0 }}
                                src={UrlRoute.getUrl("static/img/shy-gongzhonghao.png")} />
                            <img className="size-30 obj-center" src={UrlRoute.getUrl('static/img/wechat.svg')} />
                        </a>
                        <a href="https://weibo.com/u/2956273930" target="_blank"><img className="size-30 obj-center"
                            src={UrlRoute.getUrl('static/img/weibo.svg')} /></a>
                        <a href="https://www.zhihu.com/people/hua-mu-lan-71-20-59" target="_blank"><img
                            className="size-30 obj-center" src={UrlRoute.getUrl('static/img/zhihu.svg')} /></a>
                    </div></>}
                {config.isUS && <div className="flex  r-gap-r-10">
                    <img className="w-120" src={UrlRoute.getUrl('static/img/shy.logo.256.png')} />
                    <img className="h-40" src={UrlRoute.getUrl('static/img/shy.png')} />
                </div>}
                <span>Copyright © 2022-{new Date().getFullYear()} {<S>诗云</S>} All rights reserved.</span>
                <br />
                <div className="max-w-120"><SelectBox prefix={<Icon size={16} className={'gap-r-5'} icon={GlobalLinkSvg}></Icon>} small border
                    options={langOptions.map(c => {
                        return {
                            text: c.text,
                            value: c.lang
                        }
                    })}
                    value={ls.lang}
                    onChange={async e => {
                        await ls.change(e);
                        this.forceUpdate()
                    }}></SelectBox></div>
                <span><S>再小的个体也有自己的舞台</S></span>
                {!config.isUS && <><br />
                    <a href="https://beian.miit.gov.cn" target="_blank">沪ICP备19005623号-4</a>
                    <br />
                    <a href="https://www.12377.cn/" target="_blank"><S>网上有害信息举报专区</S></a>
                    <br />
                    <a href="https://www.shjbzx.cn/" target="_blank"><S>上海市互联网举报中心</S></a>
                </>}
            </div>
            <div>
                <h4><S>产品</S></h4>
                <a href={UrlRoute.getUrl("product/page")}><S>文档</S></a>
                <br />
                <a href={UrlRoute.getUrl("product/DataTable")}><S>数据表</S></a>
                <br />
                <a href={UrlRoute.getUrl("product/WhiteBoard")} target="_blank"><S>白板</S></a>
                <br />
                <a href={UrlRoute.getUrl("product/ppt")} target="_blank"><S>PPT</S></a>
                <br />
                <a href={UrlRoute.getUrl("product/channel")} target="_blank"><S>频道</S></a>
                <br />
                <a href={UrlRoute.getUrl("product/ai")} target="_blank"><S>诗云 AI</S></a>
            </div>
            <div>
                <h4><S>帮肋与支持</S></h4>
                <a href={refShyPage('template')}><S>模板库</S></a>
                <br />
                <a href={refShyPage(config.isUS ? "community" : "org", config.isUS ? 3 : 4)}><S>博客</S></a>
                <br />
                <a href={UrlRoute.getUrl('download')}><S>下载</S></a>
                <br />
                <a href={UrlRoute.getUrl('pricing')}><S>定价</S></a>
                <br />
                <a href={refShyPage('help')}><S>帮助中心</S></a>
                <br />
                <a href={refShyPage(config.isUS ? "community" : "org")}><S>云云社区</S></a>
                <br />
                <a href={refShyPage(config.isUS ? "community" : "org", config.isUS ? 3 : 4)}><S>问题反馈</S></a>
                <br />
                <a href={refShyPage(config.isUS ? "community" : "org", config.isUS ? 3 : 4)}><S>更新日志</S></a>
            </div>
            {!config.isUS && <div>
                <h4><S>联系我们</S></h4>
                <img className="size-100" src={UrlRoute.getUrl('static/img/contact.jpeg')} />
                <br /> <span><S>微信群二维码</S></span>
                <br />
                <br />
                <img className="size-100" src={UrlRoute.getUrl("static/img/qq-contact.png")} />
                <br /> <span><S>QQ群二维码</S></span> <br />
                <br />
            </div>}
            <div>
                <h4><S>关于</S></h4>
                <a href={refShyPage('help', config.isUS ? 332 : 345)}><S>媒体素材</S></a>
                <br />
                <a href={UrlRoute.getUrl("service_protocol")} target="_blank"><S>服务协议</S></a>
                <br />
                <a href={UrlRoute.getUrl("privacy_protocol")} target="_blank"><S>隐私协议</S></a>
                <br />
                <a href={refShyPage('help', config.isUS ? 339 : 339)} target="_blank"><S>社区管理条例</S></a>
                <br />
                <a href={refShyPage('help', config.isUS ? 340 : 340)} target="_blank"><S>公开分享服务协议</S></a>
            </div>
        </div>
    }
}
