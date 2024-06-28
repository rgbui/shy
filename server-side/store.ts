
import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { CopyText } from "rich/component/copy";
import { ShyAlert } from "rich/component/lib/alert";
import { Confirm } from "rich/component/lib/confirm";
import { util } from "rich/util/util";
import { yCache } from "../net/cache";
import { masterSock } from "../net/sock";
import { useServerNumberView } from "./create/server.number";
import { buildServiceNumberAddress, Pid, ServerServiceMachineIdKey, ServiceMachine, ServiceNumber, ShyServiceSlideElectron } from "./declare";
import { usePidView } from "./machine/pid";
import { lst } from "rich/i18n/store";

export class ServerSlideStore {
    machineCode: string = null;
    service_number: ServiceNumber = null;
    service_machine: ServiceMachine = null;
    pids: Pid[] = [];
    redisCheck = { loading: false, connect: null, error: '' }
    mongodbCheck = { loading: false, connect: null, error: '' }
    esCheck = { loading: false, connect: null, error: '' }
    constructor() {
        makeObservable(this, {
            service_number: observable,
            machineCode: observable,
            service_machine: observable,
            pids: observable,
            redisCheck: observable,
            mongodbCheck: observable,
            esCheck: observable
        })
    }
    get shyServiceSlideElectron() {
        return (window as any).ShyServiceSlideElectron as ShyServiceSlideElectron
    }
    time;
    async load() {
        var g = await this.shyServiceSlideElectron.getDeviceID();
        if (g) { this.machineCode = g; }
        var mid = await yCache.get(ServerServiceMachineIdKey);
        var filter: Record<string, any> = {};
        if (mid) filter = { machineId: mid }
        else filter = { machineCode: g }
        var r = await masterSock.get<{ pids: Pid[], service_number: ServiceNumber, service_machine: ServiceMachine }>('/service/machine/pids', filter);
        if (r?.data) {
            runInAction(() => {
                this.service_number = r.data.service_number;
                this.service_machine = r.data.service_machine;
                r.data.pids.forEach(d => {
                    var oldPid = this.pids.find(c => c.id == d.id);
                    if (oldPid) { d.status = oldPid.status; d.loading = oldPid.loading || false; }
                    else { d.status = 'stop'; d.loading = false; }
                })
                this.pids = r.data.pids;
            })
        }
    }
    async unload() {
        if (this.time) {
            clearTimeout(this.time);
            this.time = null;
        }
    }

    async editService() {
        console.log(serverSlideStore.service_number)
        var f = await useServerNumberView(serverSlideStore.service_number) as ServiceNumber;
        if (f) {
            await masterSock.patch('/service/patch/number', { id: serverSlideStore.service_number.id, data: f })
            ShyAlert(lst('编辑成功'));
        }
    }
    async changeService() {
        var g = await masterSock.patch<{ verifyCode: string }>('/service/patch/invite', { id: serverSlideStore.service_number.id });
        if (g.data) {
            serverSlideStore.service_number.verifyCode = g.data.verifyCode;
        }
    }
    async copyAddress() {
        CopyText(buildServiceNumberAddress(serverSlideStore.service_number))
        ShyAlert(lst('复制地址成功'));
    }
    async savePid(pid: Pid) {
        var g = await serverSlideStore.shyServiceSlideElectron.savePid(lodash.cloneDeep(serverSlideStore.service_number), lodash.cloneDeep(pid));
    }
    async addPid(event: React.MouseEvent) {
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
                await this.savePid(serverSlideStore.pids.find(c => c.id == g.data.pid.id))

            }
        }
    }
    async editPid(pid: Pid, event: React.MouseEvent) {
        var r = await usePidView(pid);
        if (r) {
            await masterSock.patch('/service/patch/pid', { id: pid.id, data: r })
            Object.assign(pid, r)
            await this.savePid(pid)
        }
    }
    async removePid(pid: Pid, event: React.MouseEvent) {
        if (await Confirm(lst('确认删除吗'))) {
            await serverSlideStore.stopPid(pid, event);
            await masterSock.delete('/delete/pid', { id: pid.id })
            lodash.remove(serverSlideStore.pids, c => c.id == pid.id);
            await serverSlideStore.shyServiceSlideElectron.deletePid(pid)
        }
    }
    async checkConnect(type: 'mongodb' | 'redis' | 'es') {
        var dr = this[type + 'Check']
        dr.loading = true;
        try {
            var g = await serverSlideStore.shyServiceSlideElectron.checkServiceConnect(lodash.cloneDeep(serverSlideStore.service_number), type)
            dr.connect = g.connect;
            dr.error = g.error || '';
        }
        catch (ex) {

        }
        finally {
            dr.loading = false;
        }
    }
    async checkAllConnect() {
        await this.checkConnect('mongodb')
        await this.checkConnect('redis')
        await this.checkConnect('es')
    }
    async runPid(pid: Pid, event?: React.MouseEvent) {
        try {
            pid.loading = true
            var r = await serverSlideStore.shyServiceSlideElectron.runPid(lodash.cloneDeep(pid))
            console.log('ggg', r);
            pid.status = 'running';
        }
        catch (ex) {
            console.error(ex);
        }
        finally {
            pid.loading = false;
        }
    }
    async stopPid(pid: Pid, event?: React.MouseEvent) {
        try {
            pid.loading = true
            await serverSlideStore.shyServiceSlideElectron.stopPid(lodash.cloneDeep(pid))
            pid.status = 'stop'
        }
        catch (ex) {
            console.error(ex);
        }
        finally {
            pid.loading = false;
        }
    }
    async runAll() {
        for (let i = 0; i < this.pids.length; i++) {
            await this.runPid(this.pids[i])
        }
    }
    async stopAll() {
        for (let i = 0; i < this.pids.length; i++) {
            await this.stopPid(this.pids[i])
        }
    }


}

export var serverSlideStore = new ServerSlideStore()