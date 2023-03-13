
import lodash from "lodash";
import { observer } from "mobx-react";
import React from "react";
import { Confirm } from "rich/component/lib/confirm";
import { DocEditSvg, DuplicateSvg, EditSvg, TrashSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { Divider } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
import { ToolTip } from "rich/component/view/tooltip";
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
            var g = await masterSock.put('/service/put/pid', {
                serviceMachineId: serverSlideStore.service_machine.id,
                id: r.id,
                serviceNumberId: serverSlideStore.service_machine.serviceNumberId,
                data: r
            });
            if (g.ok) {
                serverSlideStore.pids.push(g.data.pid);
                await runPid(serverSlideStore.pids.find(c => c.id == g.data.pid.id));
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
            lodash.remove(serverSlideStore.pids, c => c.id == pid.id);
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

        <div className="h4  gap-t-30"><span>服务号</span></div>
        <div className="f-14 r-gap-h-10 ">
            <div className="flex">
                <span>服务号:</span>
                <span>{serverSlideStore.service_number.serviceNumber}</span>
                <ToolTip overlay={'编辑'}><span className="flex-center size-20 cursor"><Icon size={16} icon={EditSvg}></Icon></span></ToolTip>
            </div>
            <div className="">
                <div className="flex">
                    <span>空间存储地址:</span>
                    <span>{`shy-server://${serverSlideStore.service_number.serviceNumber}/invite/${serverSlideStore.service_number.verifyCode}`}</span>
                    <ToolTip overlay={'复制'}><span className="cursor size-20 flex-center">
                        <Icon size={16} icon={DuplicateSvg}></Icon>
                    </span></ToolTip>
                    <a className="link">更换</a>
                </div>
                <div className="remark f-12 gap-t-5">可将空间存储地址发给需要存储在这里的朋友，注意保持网络连通。</div>
            </div>
            <div>
                <div className="flex">
                    <Button size={'small'} ghost >一键安装</Button>
                </div>
                <div className="remark f-12 gap-t-5">由系统自动安装mongodb、redis、elasticsearch</div>
            </div>
        </div>

        <Divider></Divider>
        <div className="gap-t-30"><span className="h4">服务进程</span><span className="gap-l-10 remark f-12">(机器码:{serverSlideStore.machineCode})</span></div>
        <div className="flex gap-h-10">
            <div className="flex-auto flex r-gap-r-5">
                <Button size={'small'} ghost onMouseDown={e => addPid(e)}>全部运行</Button>
                <Button size={'small'} onMouseDown={e => addPid(e)}>全部暂停</Button>
            </div>
            <div className="flex-fixed"><Button size={'small'} onMouseDown={e => addPid(e)}>添加</Button></div>
        </div>
        <div className="flex round item-hover-focus padding-w-10 padding-h-3 remark bold">
            <div className="flex-fixed flex">
                <span className="w-100">{'进程'}</span>
                <span className="w-100">{'端口'}</span>
            </div>
            <div className="flex-auto flex-end "><span>操作</span></div>
        </div>
        {serverSlideStore.pids.map(pid => {
            return <div className="flex border-bottom padding-w-10 padding-h-5" key={pid.id}>
                <div className="flex-fixed flex">
                    <span className="w-100">{pid.name}</span>
                    <span className="w-100">{pid.port}</span>
                </div>
                <div className="flex-auto flex-end flex r-padding-w-5 r-padding-h-3 r-round r-flex-center r-item-hover r-cursor">

                    <span onMouseDown={e => runPid(pid, e)}><Icon size={16} icon={DocEditSvg}></Icon><em>运行</em></span>
                    <span onMouseDown={e => stopPid(pid, e)}><Icon size={16} icon={DocEditSvg}></Icon><em>暂停</em></span>

                    <span onMouseDown={e => editPid(pid, e)}><Icon size={16} icon={EditSvg}></Icon><em>编辑</em></span>
                    <span onMouseDown={e => removePid(pid, e)}><Icon size={16} icon={TrashSvg}></Icon><em>删除</em></span>

                </div>
            </div>

        })}
    </div>
})
