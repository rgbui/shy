
import lodash from "lodash";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { CopyText } from "rich/component/copy";
import { ShyAlert } from "rich/component/lib/alert";
import { Confirm } from "rich/component/lib/confirm";
import { CheckSvg, CloseSvg, DocEditSvg, DuplicateSvg, EditSvg, PauseSvg, PlaySvg, TrashSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { Divider } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
import { Spin } from "rich/component/view/spin";
import { ToolTip } from "rich/component/view/tooltip";
import { util } from "rich/util/util";
import { masterSock } from "../../net/sock";
import { useServerNumberView } from "../create/server.number";
import { buildServiceNumberAddress, Pid, ServiceNumber } from "../declare";
import { serverSlideStore } from "../store";
import { usePidView } from "./pid";

export var ServerConfigView = observer(function () {

    var local = useLocalObservable(() => {
        return {
            redisCheck: { loading: false, connect: null, error: '' },
            mongodbCheck: { loading: false, connect: null, error: '' },
            esCheck: { loading: false, connect: null, error: '' },
        }
    })

    async function editService() {
        var f = await useServerNumberView(serverSlideStore.service_number) as ServiceNumber;
        if (f) {
            await masterSock.patch('/service/patch/number', { id: serverSlideStore.service_number.id, data: f })
            ShyAlert('编辑成功');
        }
    }
    async function changeService() {
        var g = await masterSock.patch<{ verifyCode: string }>('/service/patch/invite', { id: serverSlideStore.service_number.id });
        if (g.data) {
            serverSlideStore.service_number.verifyCode = g.data.verifyCode;
        }
    }
    async function copyAddress() {
        CopyText(buildServiceNumberAddress(serverSlideStore.service_number))
        ShyAlert('复制地址成功');
    }
    async function savePid(pid: Pid) {
        await serverSlideStore.shyServiceSlideElectron.savePid(serverSlideStore.service_number, pid);
    }

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
                await savePid(serverSlideStore.pids.find(c => c.id == g.data.pid.id))
                await runPid(serverSlideStore.pids.find(c => c.id == g.data.pid.id));
            }
        }
    }

    async function editPid(pid: Pid, event: React.MouseEvent) {
        var r = await usePidView(pid);
        if (r) {
            await masterSock.patch('/service/patch/pid', { id: pid.id, data: r })
            Object.assign(pid, r)
            await savePid(pid)
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
    function renderConfig(obj: Record<string, any>) {
        var ps: string[] = [];
        Object.keys(obj).forEach(c => {
            if (obj[c]) {
                if (c == 'paw') ps.push(`${c}=****}`)
                else ps.push(`${c}=${obj[c]}`)
            }
            else ps.push(c)
        })
        return '{' + ps.join(",") + '}';
    }
    function getPidStatus(pid: Pid) {
        if (pid.status == 'running') return '运行'
        else if (pid.status == 'stop') return '暂停'
        else if (pid.status == 'error') return '错误'
        else return '未运行'
    }
    async function checkConnect(type: 'mongodb' | 'redis' | 'es') {
        var dr = local[type + 'Check']
        dr.loading = true;
        try {
            var g = await serverSlideStore.shyServiceSlideElectron.checkServiceConnect(lodash.cloneDeep(serverSlideStore.service_number), type)
            console.log('gggg', g);
            dr.connect = g.connect;
            dr.error = g.error || '';
        }
        catch (ex) {

        }
        finally {
            dr.loading = false;
        }
    }

    return <div>
        <div className="h4  gap-t-30"><span>服务号</span></div>
        <div className="f-14 r-gap-h-10 ">
            <div className="flex">
                <span>服务号:</span>
                <span>{serverSlideStore.service_number.serviceNumber}</span>
                <ToolTip overlay={'编辑'}><span onClick={e => editService()} className="flex-center size-20 cursor"><Icon size={16} icon={EditSvg}></Icon></span></ToolTip>
            </div>
            <div className="">
                <div className="flex">
                    <span>空间服务号地址:</span>
                    <span>{buildServiceNumberAddress(serverSlideStore.service_number)}</span>
                    <ToolTip overlay={'复制空间服务号地址'}><span onClick={e => copyAddress()} className="cursor size-20 flex-center">
                        <Icon size={16} icon={DuplicateSvg}></Icon>
                    </span></ToolTip>
                    <a className="link cursor padding-l-5" onMouseDown={e => changeService()}>更换</a>
                </div>
                <div className="remark f-12 gap-t-5">可将空间存储地址发给需要存储在这里的朋友，注意保持网络连通。</div>
            </div>

            <div>
                <div className="flex">
                    {local.mongodbCheck.connect && <Icon className={'gap-r-5'} size={20} icon={CheckSvg}></Icon>}
                    {local.mongodbCheck.connect == false && <Icon className={'gap-r-5'} size={20} icon={CloseSvg}></Icon>}
                    <Button disabled={local.mongodbCheck.loading} onClick={e => checkConnect('mongodb')} size={'small'} ghost >{local.mongodbCheck.loading && <Spin size={16}></Spin>}检测Mongodb是否正常连接</Button>
                    <span className="gap-l-10">{renderConfig(serverSlideStore.service_number.mongodb)}</span>
                    <ToolTip overlay={'编辑Mongodb'}><span onClick={e => editService()} className="flex-center size-20 cursor"><Icon size={16} icon={EditSvg}></Icon></span></ToolTip>
                </div>
                {local.mongodbCheck.connect == false && <div className="error gap-h-5">{local.mongodbCheck.error}</div>}
            </div>

            <div>
                <div className="flex">
                    {local.redisCheck.connect && <Icon className={'gap-r-5'} size={20} icon={CheckSvg}></Icon>}
                    {local.redisCheck.connect == false && <Icon className={'gap-r-5'} size={20} icon={CloseSvg}></Icon>}
                    <Button disabled={local.redisCheck.loading} onClick={e => checkConnect('redis')} size={'small'} ghost >{local.redisCheck.loading && <Spin size={16}></Spin>}检测Redis是否正常连接</Button>
                    <span className="gap-l-10">{renderConfig(serverSlideStore.service_number.redis)}</span>
                    <ToolTip overlay={'编辑Redis'}><span onClick={e => editService()} className="flex-center size-20 cursor"><Icon size={16} icon={EditSvg}></Icon></span></ToolTip>
                </div>
                {local.redisCheck.connect == false && <div className="error gap-h-5">{local.redisCheck.error}</div>}
            </div>

            <div>
                <div className="flex">
                    {local.esCheck.connect && <Icon className={'gap-r-5'} size={20} icon={CheckSvg}></Icon>}
                    {local.esCheck.connect == false && <Icon className={'gap-r-5'} size={20} icon={CloseSvg}></Icon>}
                    <Button disabled={local.esCheck.loading} onClick={e => checkConnect('es')} size={'small'} ghost >{local.esCheck.loading && <Spin size={16}></Spin>}检测ElasticSearch是否正常连接</Button>
                    <span className="gap-l-10">{renderConfig(serverSlideStore.service_number.search)}</span>
                    <ToolTip overlay={'编辑ElasticSearch'}><span onClick={e => editService()} className="flex-center size-20 cursor"><Icon size={16} icon={EditSvg}></Icon></span></ToolTip>
                </div>
                {local.esCheck.connect == false && <div className="error gap-h-5">{local.esCheck.error}</div>}
            </div>

            <div>
                <div className="flex">
                    <Button size={'small'} ghost >安装Mongodb、Redis、ElasticSearch</Button>
                </div>
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
                <span className="w-100">端口</span>
                <span className="w-180">访问网址</span>
                <span className="w-80">状态</span>
            </div>
            <div className="flex-auto flex-end "><span>操作</span></div>
        </div>
        {serverSlideStore.pids.map(pid => {
            return <div className="flex border-bottom padding-w-10 padding-h-5" key={pid.id}>
                <div className="flex-fixed flex">
                    <span className="w-100">{pid.port + (pid.name ? `(${pid.name})` : '')}</span>
                    <span className="w-180">{pid.url ? pid.url : (`http://127.0.0.1:${pid.port}`)}</span>
                    <span className="w-80">{getPidStatus(pid)}</span>
                </div>
                <div className="flex-auto flex-end flex r-padding-w-5 r-padding-h-3 r-round r-flex-center r-item-hover r-cursor">

                    <span onMouseDown={e => runPid(pid, e)}><Icon size={16} icon={PlaySvg}></Icon><em>运行</em></span>
                    <span onMouseDown={e => stopPid(pid, e)}><Icon size={16} icon={PauseSvg}></Icon><em>暂停</em></span>

                    <span onMouseDown={e => editPid(pid, e)}><Icon size={16} icon={EditSvg}></Icon><em>编辑</em></span>
                    <span onMouseDown={e => removePid(pid, e)}><Icon size={16} icon={TrashSvg}></Icon><em>删除</em></span>

                </div>
            </div>

        })}
    </div>
})
