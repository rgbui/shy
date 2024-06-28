import { observer } from "mobx-react";
import React from "react";
import { ShyAlert } from "rich/component/lib/alert";
import { useForm } from "rich/component/view/form/dialoug";
import { masterSock } from "../../net/sock";
import { ServiceMachine, ServiceNumber } from "../declare";
import { serverSlideStore } from "../store";
import { useServerNumberView } from "./server.number";

import { PlusSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { surface } from "../../src/surface/app/store";
import { S } from "rich/i18n/view";
import { runInAction } from "mobx";

export var ServerConfigCreate = observer(function () {
    React.useEffect(() => {
        if (!surface.user.isSign) surface.user.toSign()
    }, [])
    async function create(event: React.MouseEvent) {
        var f = await useServerNumberView(undefined) as ServiceNumber;
        if (f) {
            var r = await masterSock.put<{
                serviceNumber: ServiceNumber,
                serviceMachine: ServiceMachine
            }>('/service/create/number', {
                serviceNumber: f.serviceNumber,
                serviceProvider: f.serviceProvider,
                remark: f.remark,
                data: f,
                machineCode: serverSlideStore.machineCode
            });
            if (r.ok) {
                runInAction(() => {
                    serverSlideStore.service_machine = r.data.serviceMachine;
                    serverSlideStore.service_number = r.data.serviceNumber;
                })
            }
        }
    }
  
    return <div className="flex-center vw100 vh100 pos" style={{ top: 0, left: 0 }}>
        <div className="flex-center r-round r-gap-w-10  r-padding-14 r-cursor text-1 r-border r-shadow">
            <div className="item-hover flex flex-top w-180" onMouseDown={e => create(e)}>
                <Icon className='flxe-fixed' size={40} icon={PlusSvg}></Icon>
                <div className="flex-auto gap-l-5">
                    <span><S>创建</S></span>
                    <div className="remark f-12"><S>创建服务号</S></div>
                </div>
            </div>
        </div>
    </div>
})