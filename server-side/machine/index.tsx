import { observer } from "mobx-react";
import React from "react";
import { CheckSvg, CloseSvg, DuplicateSvg, EditSvg, PauseSvg, PlaySvg, TrashSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { Divider } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
import { Spin } from "rich/component/view/spin";
import { buildServiceNumberAddress, Pid } from "../declare";
import { serverSlideStore } from "../store";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { Tip } from "rich/component/view/tooltip/tip";

export var ServerConfigView = observer(function () {
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
        if (pid.status == 'running') return lst('运行')
        else if (pid.status == 'stop') return lst('暂停')
        else if (pid.status == 'error') return lst('错误')
        else return lst('未运行')
    }


    return <div>
        <div className="h4  gap-t-30"><span><S>服务号</S></span></div>
        <div className="f-14 r-gap-h-10 ">
            <div className="flex">
                <span><S>服务号</S>:</span>
                <span>{serverSlideStore.service_number.serviceNumber}</span>
                <Tip text={'编辑'}><span onClick={e => serverSlideStore.editService()} className="flex-center size-20 cursor"><Icon size={16} icon={EditSvg}></Icon></span></Tip>
            </div>
            <div className="">
                <div className="flex">
                    <span><S>空间服务号地址</S>:</span>
                    <span>{buildServiceNumberAddress(serverSlideStore.service_number)}</span>
                    <Tip text={'复制空间服务号地址'}><span onClick={e => serverSlideStore.copyAddress()} className="cursor size-20 flex-center">
                        <Icon size={16} icon={DuplicateSvg}></Icon>
                    </span></Tip>
                    <a className="link cursor padding-l-5" onMouseDown={e => serverSlideStore.changeService()}>更换</a>
                </div>
                <div className="remark f-12 gap-t-5"><S text={'可将空间存储地址发给需要存储在这里的朋友'}>可将空间存储地址发给需要存储在这里的朋友，注意保持网络连通。</S></div>
            </div>

            <div>
                <div className="flex">
                    {serverSlideStore.mongodbCheck.connect && <Icon className={'gap-r-5'} size={20} icon={CheckSvg}></Icon>}
                    {serverSlideStore.mongodbCheck.connect == false && <Icon className={'gap-r-5'} size={20} icon={CloseSvg}></Icon>}
                    <Button disabled={serverSlideStore.mongodbCheck.loading} onClick={e => serverSlideStore.checkConnect('mongodb')} size={'small'} ghost >{serverSlideStore.mongodbCheck.loading && <Spin size={16}></Spin>}<S>检测Mongodb是否正常连接</S></Button>
                    <span className="gap-l-10">{renderConfig(serverSlideStore.service_number.mongodb)}</span>
                    <Tip text={'编辑Mongodb'}><span onClick={e => serverSlideStore.editService()} className="flex-center size-20 cursor"><Icon size={16} icon={EditSvg}></Icon></span></Tip>
                </div>
                {serverSlideStore.mongodbCheck.connect == false && <div className="error gap-h-5">{serverSlideStore.mongodbCheck.error}</div>}
            </div>

            {serverSlideStore.service_number.redis?.abled && <div>
                <div className="flex">
                    {serverSlideStore.redisCheck.connect && <Icon className={'gap-r-5'} size={20} icon={CheckSvg}></Icon>}
                    {serverSlideStore.redisCheck.connect == false && <Icon className={'gap-r-5'} size={20} icon={CloseSvg}></Icon>}
                    <Button disabled={serverSlideStore.redisCheck.loading} onClick={e => serverSlideStore.checkConnect('redis')} size={'small'} ghost >{serverSlideStore.redisCheck.loading && <Spin size={16}></Spin>}<S>检测Redis是否正常连接</S></Button>
                    <span className="gap-l-10">{renderConfig(serverSlideStore.service_number.redis)}</span>
                    <Tip text={'编辑Redis'}><span onClick={e => serverSlideStore.editService()} className="flex-center size-20 cursor"><Icon size={16} icon={EditSvg}></Icon></span></Tip>
                </div>
                {serverSlideStore.redisCheck.connect == false && <div className="error gap-h-5">{serverSlideStore.redisCheck.error}</div>}
            </div>
            }

            {serverSlideStore.service_number.search?.abled && <div>
                <div className="flex">
                    {serverSlideStore.esCheck.connect && <Icon className={'gap-r-5'} size={20} icon={CheckSvg}></Icon>}
                    {serverSlideStore.esCheck.connect == false && <Icon className={'gap-r-5'} size={20} icon={CloseSvg}></Icon>}
                    <Button disabled={serverSlideStore.esCheck.loading} onClick={e => serverSlideStore.checkConnect('es')} size={'small'} ghost >{serverSlideStore.esCheck.loading && <Spin size={16}></Spin>}<S>检测ElasticSearch是否正常连接</S></Button>
                    <span className="gap-l-10">{renderConfig(serverSlideStore.service_number.search)}</span>
                    <Tip text={'编辑ElasticSearch'}><span onClick={e => serverSlideStore.editService()} className="flex-center size-20 cursor"><Icon size={16} icon={EditSvg}></Icon></span></Tip>
                </div>
                {serverSlideStore.esCheck.connect == false && <div className="error gap-h-5">{serverSlideStore.esCheck.error}</div>}
            </div>
            }
        </div>

        <Divider></Divider>
        <div className="gap-t-30"><span className="h4"><S>服务进程</S></span><span className="gap-l-10 remark f-12">(<S>机器码</S>:{serverSlideStore.machineCode})</span></div>
        <div className="flex gap-h-10">
            <div className="flex-auto flex r-gap-r-5">
                <Button size={'small'} ghost onMouseDown={e => serverSlideStore.runAll()}><S>全部运行</S></Button>
                <Button size={'small'} onMouseDown={e => serverSlideStore.stopAll()}><S>全部暂停</S></Button>
            </div>
            <div className="flex-fixed">
                {(serverSlideStore.pids.length > 1 && serverSlideStore.service_number?.redis?.abled == true || serverSlideStore.pids.length <= 1) && <Button size={'small'} onMouseDown={e => { serverSlideStore.addPid(e); this.forceUpdate() }}><S>添加</S></Button>}
            </div>
        </div>
        <div className="flex round item-hover-focus padding-w-10 padding-h-3 remark bold">
            <div className="flex-fixed flex">
                <span className="w-100"><S>端口</S></span>
                <span className="w-180"><S>访问网址</S></span>
                <span className="w-80"><S>状态</S></span>
            </div>
            <div className="flex-auto flex-end "><span><S>操作</S></span></div>
        </div>
        {serverSlideStore.pids.map(pid => {
            return <div className="flex border-bottom padding-w-10 padding-h-5" key={pid.id}>
                <div className="flex-fixed flex">
                    <span className="w-100">{pid.port + (pid.name ? `(${pid.name})` : '')}</span>
                    <span className="w-180">{pid.url ? pid.url : (`http://127.0.0.1:${pid.port}`)}</span>
                    <span className="w-80">{getPidStatus(pid)}{pid.status == 'running' && <Spin size={16}></Spin>}</span>
                </div>
                <div className="flex-auto flex-end flex r-padding-w-5 r-padding-h-3 r-round r-flex-center r-item-hover r-cursor">

                    <span onMouseDown={e => serverSlideStore.runPid(pid, e)}><Icon size={14} icon={PlaySvg}></Icon><em><S>运行</S></em></span>
                    <span onMouseDown={e => serverSlideStore.stopPid(pid, e)}><Icon size={14} icon={PauseSvg}></Icon><em><S>暂停</S></em></span>

                    <span onMouseDown={e => serverSlideStore.editPid(pid, e)}><Icon size={14} icon={EditSvg}></Icon><em><S>编辑</S></em></span>
                    <span onMouseDown={e => serverSlideStore.removePid(pid, e)}><Icon size={14} icon={TrashSvg}></Icon><em><S>删除</S></em></span>

                </div>
            </div>

        })}
    </div>
})
