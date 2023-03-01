
import { observer } from "mobx-react";
import React from "react";
import { Confirm } from "rich/component/lib/confirm";
import { DocEditSvg, EditSvg, TrashSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { Icon } from "rich/component/view/icon";
import { util } from "rich/util/util";
import { masterSock } from "../../net/sock";
import { Pid } from "../declare";
import { serverSlideStore } from "../store";
import { usePidView } from "./pid";

export var ServerConfigView = observer(function () {

    async function addPid(event: React.MouseEvent) {
        var id = util.guid()
        var r = await usePidView({ id });
        if (r?.id) {
            var g = await masterSock.put('/service/put/pid', { ...r });
            if (g.ok) {
                serverSlideStore.pids.push(g.data);
            }
        }
    }

    async function editPid(pid: Pid, event: React.MouseEvent) {
        var r = await usePidView(pid);
        if (r) {
            await masterSock.patch('/service/patch/pid', { id: pid.id, data: r })
            Object.assign(pid, r)
        }
    }

    async function removePid(pid: Pid, event: React.MouseEvent) {
        if (await Confirm('确认删除吗')) {
            await stopPid(pid, event);
            await masterSock.delete('/delete/pid', { id: pid.id })
            await serverSlideStore.shyServiceSlideElectron.deletePid(pid)
        }
    }

    async function runPid(pid: Pid, event?: React.MouseEvent) {
        await serverSlideStore.shyServiceSlideElectron.runPid(pid)
    }

    async function stopPid(pid: Pid, event: React.MouseEvent) {
        await serverSlideStore.shyServiceSlideElectron.stopPid(pid)
    }

    return <div>
        <div className="flex">
            <div className="flex-fixed">
                <span>服务号:</span><span>{serverSlideStore.service_machine.serviceNumber}</span>
                <span>机器码:</span><span>{serverSlideStore.machineCode}</span>
            </div>
        </div>
        <div className="flex">
            <div className="flex-fixed"><Button onMouseDown={e => addPid(e)}>添加</Button></div>
        </div>
        {serverSlideStore.pids.map(pid => {
            return <div className="flex" key={pid.id}>
                <div className="flex-fixed">
                    <span>{pid.name}</span>
                    <span>{pid.port}</span>
                </div>
                <div className="flex-auto flex-end">
                    <span onMouseDown={e => runPid(pid, e)}><Icon icon={DocEditSvg}></Icon><em>运行</em></span>
                    <span onMouseDown={e => stopPid(pid, e)}><Icon icon={DocEditSvg}></Icon><em>暂停</em></span>

                    <span onMouseDown={e => editPid(pid, e)}><Icon icon={EditSvg}></Icon><em>编辑</em></span>
                    <span onMouseDown={e => removePid(pid, e)}><Icon icon={TrashSvg}></Icon><em>删除</em></span>
                </div>
            </div>

        })}
    </div>
})
