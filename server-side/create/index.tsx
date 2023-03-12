import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { ShyAlert } from "rich/component/lib/alert";
import { useForm } from "rich/component/view/form/dialoug";
import { masterSock } from "../../net/sock";
import { ServiceMachine, ServiceNumber } from "../declare";
import { serverSlideStore } from "../store";
import { useServerNumberView } from "./server.number";
import LogoSrc from "../../src/assert/img/shy.blue.svg";
import { FlashlampSvg, PlusSvg, ServerSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { surface } from "../../src/surface/store";

export var ServerConfigCreate = observer(function () {
    var local = useLocalObservable(() => {
        return {
            isLocalOrServer: null
        }
    })
    React.useEffect(() => {
        if (!surface.user.isSign) surface.user.toSign()
    }, [])
    async function flash(event: React.MouseEvent) {

    }
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
                        text: '服务号',
                        type: 'select',
                        options: myList.map(c => {
                            return {
                                text: c.serviceNumber,
                                value: c.serviceNumber,
                            }
                        })
                    }
                ],
                title: '绑定服务号',
                remark: '请确保有相同服务号的电脑在局域网内是可连通的且能与服务号配置本置的mongodb、redis、es正常连接',
                checkModel: async (model) => {
                    if (!model.name) return '服务号不能为空';
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
                else ShyAlert('绑定失败')
            }
        }
        else ShyAlert('你还没有创建过服务号')
    }

    return <div className=" gap-t-100 flex-center vw100 vh100">
        <div>
            <div className="flex">
                <LogoSrc style={{ width: 60, height: 60 }}></LogoSrc><span style={{ fontSize: 24 }}>诗云服务端</span>
            </div>
            <div className="flex-center r-round  r-padding-14 r-cursor text-1">

                <div className="item-hover flex flex-top w-180" onMouseDown={e => create(e)}>
                    <Icon className='flxe-fixed' size={40} icon={FlashlampSvg}></Icon>
                    <div className="flex-auto gap-l-5">
                        <span>快捷</span>
                        <div className="remark f-12">一键安装创建服务号</div>
                    </div>
                </div>
                <div className="item-hover flex flex-top w-180" onMouseDown={e => create(e)}>
                    <Icon className='flxe-fixed' size={40} icon={PlusSvg}></Icon>
                    <div className="flex-auto gap-l-5">
                        <span>创建</span>
                        <div className="remark f-12">创建新的服务号</div>
                    </div>
                </div>
                <div className="item-hover  flex flex-top   w-180" onMouseDown={e => bind(e)}>
                    <Icon className='flxe-fixed' size={34} icon={ServerSvg}></Icon>
                    <div className="flex-auto gap-l-5">
                        <span>选择</span>
                        <div className="remark f-12">选择已有的服务号</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
})