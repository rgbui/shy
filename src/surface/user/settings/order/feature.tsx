import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { channel } from "rich/net/channel";
import { useSelectPayView } from "../../../../component/pay/select";

import { PricingPackage, PricingValue } from "../../../../../org/common/pricing";
import { UrlRoute } from "../../../../history";
import { EquityView } from "../../../../../org/common/equity";
import "./style.less";

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
                self.load();
            }
        }
        return <div className="shy-app-lang">
            <div className="shy-site-block"><div style={{ padding: 0 }}>
                <div className="flex-center padding-t-30">
                    <img className="w-350" src={UrlRoute.getUrl('static/img/dog.svg')} />
                </div>
                <PricingValue small></PricingValue>
            </div>
            </div>
            <div className="shy-site-block">
                <div style={{ padding: 0, marginTop: 100 }}>
                    <PricingPackage openPay={openPay} wrap></PricingPackage>
                </div>
            </div>
            <div className="gap-t-100">
                <EquityView top={0}></EquityView>
            </div>

        </div>
    }
}