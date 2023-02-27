import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { ShyAlert } from "rich/component/lib/alert";
import { useForm } from "rich/component/view/form/dialoug";
import { masterSock } from "../../net/sock";
import { ServiceMachine, ServiceNumber } from "../declare";
import { serverSlideStore } from "../store";
import { useServerNumberView } from "./server.number";

export var ServerConfigCreate = observer(function () {
    var local = useLocalObservable(() => {
        return {
            isLocalOrServer: null
        }
    })
    async function create(event: React.MouseEvent) {
        var f = await useServerNumberView({} as any) as ServiceNumber;
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
        var f = await useForm({
            fields: [
                { name: 'serverNumber', text: '服务号', type: 'input' },
                { name: 'verifyCode', text: '校验码', type: 'input' }
            ],
            title: '绑定服务号',
            remark: '',
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

    return <div>
        {local.isLocalOrServer == false && <div className="flex-center">
            <div className="item-hover" onMouseDown={e => create(e)}>
                <span>创建</span>
                <div className="remark">创建新的服务号</div>
            </div>
            <div className="item-hover" onMouseDown={e => bind(e)}>
                <span>选择</span>
                <div className="remark">选择已有的服务号与当前机器绑定</div>
            </div>
        </div>}

    </div>
})