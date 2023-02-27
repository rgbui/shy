
import { observer } from "mobx-react";
import React from "react";
import { Confirm } from "rich/component/lib/confirm";
import { DocEditSvg, EditSvg, TrashSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { Icon } from "rich/component/view/icon";
import { Pid } from "../declare";
import { serverSlideStore } from "../store";
export var ServerConfigView = observer(function () {

    async function addPid(event: React.MouseEvent) {

    }

    async function editPid(pid: Pid, event: React.MouseEvent) {

    }

    async function removePid(pid: Pid, event: React.MouseEvent) {
        if (await Confirm('确认删除吗')) {

        }
    }
    
    async function runPid(pid: Pid, event: React.MouseEvent) {

    }

    return <div>
        <div className="flex">
            <div className="flex-fixed">
                <span>服务号:</span><span>{serverSlideStore.service_machine.serviceNumber}</span>
                <span>机器码:</span><span>{serverSlideStore.machineCode}</span>
            </div>
            <div className="flex-auto flex-end"><Button onMouseDown={e => addPid(e)}></Button></div>

        </div>
        {serverSlideStore.pids.map(pid => {
            return <div className="flex" key={pid.id}>
                <div className="flex-fixed">
                    <span>{pid.name}</span>
                    <span>{pid.port}</span>
                </div>
                <div className="flex-auto flex-end">
                    <span><Icon icon={DocEditSvg}></Icon><em>运行</em></span>
                    <span><Icon icon={EditSvg}></Icon><em>编辑</em></span>
                    <span><Icon icon={TrashSvg}></Icon><em>删除</em></span>
                </div>
            </div>

        })}
    </div>
})
