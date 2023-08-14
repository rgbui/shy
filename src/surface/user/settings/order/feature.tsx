import { load } from "@fingerprintjs/fingerprintjs";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { CheckSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { Icon } from "rich/component/view/icon";
import { channel } from "rich/net/channel";
import { useSelectPayView } from "../../../../component/pay/select";
import "./style.less";
import { S } from "rich/i18n/view";
import { PricingPackage, PricingValue } from "../../../../../org/common/pricing";
import { SiteFeatures } from "../../../../../org/common/feature";
import { UrlRoute } from "../../../../history";

@observer
export class ShyFeature extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            feature: observable,
            wallet: observable
        })
    }
    componentDidMount() {
        this.load();
    }
    async load() {
        var r = await channel.get('/user/wallet');
        if (r?.ok) {
            this.wallet = r.data as any;
        }
    }
    wallet: { money: number, meal: string, due: Date } = { money: 0, meal: '', due: null }
    feature: { item: 'personal' | 'item' } = { item: 'personal' };
    render() {
        var self = this;
        async function openPay(kind: "fill" | "meal-1" | "meal-2") {
            var r = await useSelectPayView(kind);
            if (r) {
                load();
            }
        }
        return <div className="shy-app-lang">
            <div className="shy-site-block"><div style={{ padding: 0 }}>
                <div className="flex-center padding-t-50">
                    <img className="w-350" src={UrlRoute.getUrl('static/img/dog.svg')} />
                </div>
                <PricingValue></PricingValue>
            </div>
            </div>
            <div className="shy-site-block">
                <div style={{ padding: 0 }}>
                    <PricingPackage wrap></PricingPackage>
                </div>
            </div>
            <SiteFeatures></SiteFeatures>
        </div>
    }
}