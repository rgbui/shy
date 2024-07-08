import React from "react";
import { PricingPackage, PricingValue } from "./common/pricing";
import { UsedView } from "./common/used";
import { useSelectPayView } from "../src/component/pay/select";
import { surface } from "../src/surface/app/store";
import { ShyAlert } from "rich/component/lib/alert";
import { lst } from "rich/i18n/store";
import { DifferView } from "./common/differ";
import { EquityView } from "./common/equity";

export function PriceView() {
    async function openPay(kind: "fill" | "meal-1" | "meal-2") {
        if (!surface.user?.isSign) return ShyAlert(lst('请先登录'))
        var r = await useSelectPayView(kind);
        if (r) {
            ShyAlert(lst('支付成功'))
        }
    }
    return <div>
        <div className="shy-site-block">
            <div className="padding-b-50 padding-t-60">
                {/* <div className="flex-center padding-t-50">
                    <img className="w-350" src='static/img/dog.svg' />
                </div> */}
                <PricingValue></PricingValue>
            </div>
        </div>
        <div className="shy-site-block">
            <div className="gap-h-50">
                <PricingPackage openPay={openPay}></PricingPackage>
            </div>
        </div>

        <UsedView></UsedView>

        <div className="shy-site-block">
            <EquityView></EquityView>
        </div>
        
        <div className="shy-site-block">
            <div className="h-30"></div>
            <DifferView></DifferView>
        </div>





        <div className="min-h-200"></div>


    </div>
}