import React from "react";
import { Divider } from "rich/component/view/grid";
import { Switch, SwitchText } from "rich/component/view/switch";
import { surface } from "../../../app/store";
import { observer } from "mobx-react";
import { channel } from "rich/net/channel";
import lodash from "lodash";
import { Workspace } from "../..";
import { makeObservable, observable, runInAction } from "mobx";
import { SaveTip } from "../../../../component/tip/save.tip";
import { config } from "../../../../../common/config";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { usePublishSite } from "./site";
import { Button } from "rich/component/view/button";
import { ShyAlert } from "rich/component/lib/alert";
import { useSetCustomDomain } from "../../../user/common/setCustomDomain";
import { getAiDefaultModel } from "rich/net/ai/cost";
import { util } from "rich/util/util";

@observer
export class SitePublishView extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            data: observable,
            error: observable
        })
    }
    data: {
        publishConfig: Workspace['publishConfig'],
        access: number,
        aiConfig: Workspace['aiConfig']
    } = {
            access: 1,
            publishConfig: {
                abled: false,
                defineNavMenu: false,
                navMenus: [],
                isFullWidth: true,
                smallFont: true,
                contentTheme: 'wiki',
                defineBottom: false,
                allowSearch: false
            },
            aiConfig: {
                text: getAiDefaultModel(undefined, 'text'),
                image: getAiDefaultModel(undefined, 'image'),
                embedding: getAiDefaultModel(undefined, 'embedding'),
                aiSearch: false,
                disabled: false
            }
        };
    error: Record<string, any> = {};
    tip: SaveTip;
    async save() {
        var r = await channel.patch('/ws/patch', {
            data: {
                publishConfig: lodash.cloneDeep(this.data.publishConfig),
                access: this.data.access,
                aiConfig: lodash.cloneDeep(this.data.aiConfig)
            }
        });
        if (r.ok) {
            runInAction(() => {
                surface.workspace.publishConfig = lodash.cloneDeep(this.data.publishConfig);
                surface.workspace.aiConfig = lodash.cloneDeep(this.data.aiConfig);
                surface.workspace.access = this.data.access as | 1;
                this.tip.close();
            })
        }
    }
    async reset() {
        this.data = {
            publishConfig: lodash.cloneDeep(surface.workspace.publishConfig),
            access: surface.workspace.access,
            aiConfig: lodash.cloneDeep(surface.workspace.aiConfig)
        };
        if (!this.data.publishConfig?.navMenus || Array.isArray(this.data.publishConfig?.navMenus) && this.data.publishConfig.navMenus.length == 0) {
            this.data.publishConfig.navMenus = [{
                id: config.guid(),
                date: Date.now(),
                userid: surface.user?.id,
                type: 'logo',
                text: surface.workspace.text,
            }]
        }
        this.error = {};
        if (this.tip) this.tip.close();
    }
    componentDidMount() {
        this.reset();
    }
    change(key: string, value) {
        lodash.set(this.data, key, value);
        this.checkChange();
    }
    checkChange() {
        if (this.tip) {
            if (lodash.isEqual(this.data, lodash.pick(surface.workspace, ['publishConfig']))) this.tip.close()
            else this.tip.open();
        }
    }
    async openAccess(access: number) {
        if (access == 1) {
            if (!await surface.user.isFillPay(lst('需要充值才能公开至互联网'))) return
        }
        this.change('access', access);
    }
    async openCustomDomain(event: React.MouseEvent) {
        var us = await surface.user.wallet();
        if (config.isDev || config.isPro || config.isBeta || !us.isDue && (us.meal == 'meal-1' || us.meal == 'meal-2')) {
            await useSetCustomDomain(surface.workspace);
        }
        else {
            ShyAlert(lst('需要开通专业版才能支持自定义域名'))
            return;
        }
    }
    async openPublishSite() {
        await usePublishSite(this.data.publishConfig);
    }
    render() {
        return <div>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            <div className="h2"><S>发布应用</S></div>
            <Divider></Divider>
            <div className="gap-h-20">
                <div className="bold f-14"><S>公开至互联网</S></div>
                <div className="remark f-12 gap-b-10 gap-t-5"><S text="公开互联网后">公开互联网后，会产生一定的流量、内容审核费用</S></div>
                <div><Switch onChange={e => this.openAccess(e ? 1 : 0)} checked={this.data.access == 1}></Switch></div>
            </div>
            <div className="gap-h-20">
                <div className="bold f-14"><S>SEO优化</S></div>
                <div className="remark f-12 gap-b-10 gap-t-5"><S text='支持百度Google收录搜索'>支持百度、Google收录搜索</S></div>
                <div>
                    <SwitchText size="small"
                        onChange={e => this.change('aiConfig.seoSearch', e)}
                        checked={this.data.aiConfig.seoSearch}>
                    </SwitchText>
                </div>
                {this.data.aiConfig.seoSearch && <div className="gap-h-10 flex">
                    <Button onMouseDown={async (e, b) => {
                        try {
                            b.loading = true;
                            await surface.workspace.sock.post('/view/search/all', { wsId: surface.workspace.id });
                            await util.delay(1000 * 600)
                        }
                        catch (ex) {

                        }
                        finally {
                            if (b)
                                b.loading = false;
                        }
                    }} ghost><S>手动构建HTML</S></Button>
                    <span className="gap-l-10 remark  f-12">支持之前的数据被搜索引擎搜索到</span>
                </div>}
            </div>


            <div className="gap-h-20">
                <div className="bold f-14"><S>自定义域名</S></div>
                <div className="remark f-12 gap-b-10 gap-t-5"><S text="支持自定义你自已的域名">支持自定义你自已的域名，需要国内备案</S></div>
                {surface.workspace.customSiteDomain && <div className="flex">
                    <a style={{ textDecoration: 'underline', color: 'inherit', display: 'inline-block', marginRight: 10 }} target='_blank' href={`http${surface.workspace.customSiteDomainProtocol ? "s" : ""}://` + surface.workspace.customSiteDomain}>http{surface.workspace.customSiteDomainProtocol ? "s" : ""}://{surface.workspace.customSiteDomain}</a>
                    <a className='link cursor gap-l-5' onClick={e => this.openCustomDomain(e)}><S>更换</S></a>
                </div>}
                {
                    !surface.workspace.customSiteDomain && <div>
                        <Button ghost onClick={e => this.openCustomDomain(e)} ><S>自定义域名</S></Button>
                        <div className='remark f-12 gap-h-10 flex'><S>示例</S>:https://yousite.com</div>
                    </div>
                }
            </div>
            <div className="gap-h-20">
                <span className="bold f-14"><S>发布站点</S></span>
                <div className="remark f-12 gap-b-10 gap-t-5"><S text="支持自定义你的网站">支持自定义你的web网站及独立的app应用。</S></div>
                <div>
                    <Switch checked={this.data.publishConfig.abled} onChange={async e => {
                        if (await surface.user.isFillPay(lst('需要充值才能发布应用')))
                            this.change('publishConfig.abled', e)
                    }}></Switch>
                </div>
            </div>

            {this.data.publishConfig.abled && <div className="r-gap-h-10">
                <div><Button ghost onClick={e => {
                    this.openPublishSite()
                }}><S>自定义应用</S></Button></div>
            </div>}
        </div>
    }
}