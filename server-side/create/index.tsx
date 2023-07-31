import { observer } from "mobx-react";
import React from "react";
import { ShyAlert } from "rich/component/lib/alert";
import { useForm } from "rich/component/view/form/dialoug";
import { masterSock } from "../../net/sock";
import { ServiceMachine, ServiceNumber } from "../declare";
import { serverSlideStore } from "../store";
import { useServerNumberView } from "./server.number";

import { FlashlampSvg, PlusSvg, ServerSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { surface } from "../../src/surface/store";
import { S } from "rich/i18n/view";
import { lst } from "rich/i18n/store";

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
                serverSlideStore.service_machine = r.data.serviceMachine;
                serverSlideStore.service_number = r.data.serviceNumber;
            }
        }
    }
    async function bind(event: React.MouseEvent) {
        var rg = await masterSock.get('/service/my/list');
        if (rg.ok && rg?.data?.list?.length > 0) {
            var myList = rg.data.list as ServiceNumber[];
            var f = await useForm({
                fields: [
                    {
                        name: 'serverNumber',
                        text: lst('服务号'),
                        type: 'select',
                        options: myList.map(c => {
                            return {
                                text: c.serviceNumber,
                                value: c.serviceNumber,
                            }
                        })
                    }
                ],
                title: lst('绑定服务号'),
                remark: lst('绑定服务号提示', '请确保有相同服务号的电脑在局域网内是可连通的且能与服务号配置本置的mongodb、redis、es正常连接'),
                checkModel: async (model) => {
                    if (!model.name) return lst('服务号不能为空');
                }
            });
            if (f) {
                var r = await masterSock.put<{ bind: boolean, serviceMachine: ServiceMachine }>('/service/bind/number', {
                    serviceNumber: f.serviceNumber,
                    verifyCode: f.verifyCode,
                    machineCode: serverSlideStore.machineCode
                });
                if (r.ok) {
                    serverSlideStore.service_machine = r.data.serviceMachine;
                }
                else ShyAlert(lst('绑定失败'))
            }
        }
        else ShyAlert(lst('你还没有创建过服务号'))
    }
    return <div className=" gap-t-100 flex-center vw100 vh100">
        <div className="flex-center r-round r-gap-w-10  r-padding-14 r-cursor text-1 r-border r-shadow">
            <div className="item-hover flex flex-top w-180 " onMouseDown={e => create(e)}>
                <Icon className='flxe-fixed' size={40} icon={FlashlampSvg}></Icon>
                <div className="flex-auto gap-l-5">
                    <span><S>快捷</S></span>
                    <div className="remark f-12"><S>一键安装创建服务号</S></div>
                </div>
            </div>
            <div className="item-hover flex flex-top w-180" onMouseDown={e => create(e)}>
                <Icon className='flxe-fixed' size={40} icon={PlusSvg}></Icon>
                <div className="flex-auto gap-l-5">
                    <span><S>创建</S></span>
                    <div className="remark f-12"><S>创建新的服务号</S></div>
                </div>
            </div>
            <div className="item-hover  flex flex-top   w-180" onMouseDown={e => bind(e)}>
                <Icon className='flxe-fixed' size={34} icon={ServerSvg}></Icon>
                <div className="flex-auto gap-l-5">
                    <span><S>选择</S></span>
                    <div className="remark f-12"><S>选择已有的服务号</S></div>
                </div>
            </div>
        </div>
    </div>
})