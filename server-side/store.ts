
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
        console.log('device code', g);
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
                    if (oldPid) d.status = oldPid.status;
                    else d.status = 'stop';
                })
                this.pids = r.data.pids;
            })
        }

        this.time = setTimeout(async () => {

            var now = new Date();
            var hour = now.getHours();
            if (hour > 6 && hour < 20) {
                if (this.willUpdatePack.loading) return;
                if (this.willUpdatePack.version) return;
                // 1点到6点 13点到18点 检查更新，避免影响用户使用 增加随机时间，避免同时检查
                util.delay(1000 * 60 * util.getRandom(0, 20));
                await this.checkVersionUpdate()
            }
            if (hour > 1 && hour < 6) {
                if (this.willUpdatePack.installLoading) return;
                if (this.willUpdatePack.version) {
                    await this.updateInstall()
                }
            }
        }, 1000 * 60 * 60 * 1);
        await this.checkVersionUpdate()
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
        var g = await serverSlideStore.shyServiceSlideElectron.runPid(lodash.cloneDeep(pid))
        pid.status = 'running';
    }
    async stopPid(pid: Pid, event?: React.MouseEvent) {
        var g = await serverSlideStore.shyServiceSlideElectron.stopPid(lodash.cloneDeep(pid))
        pid.status = 'stop'
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

    //更新
    willUpdatePack: {
        loading: boolean,
        version: string,
        filePath: string,
        installLoading: boolean,
    } = { loading: false, version: '', filePath: '', installLoading: false };
    async checkVersionUpdate() {
        this.willUpdatePack.loading = true;
        try {
            var config = (await this.shyServiceSlideElectron.getConfig());
            var r = await masterSock.get('/pub/server/check/version', { version: config.version });
            if (r.ok) {
                if (r.data?.pub_version) {
                    var g: {
                        windowPackUrl: string,
                        macPackUrl: string,
                        linuxPackUrl: string,
                        version: string,
                    } = r.data.pub_version;
                    var url = g.windowPackUrl;
                    if (config.platform == 'darwin') url = g.macPackUrl;
                    if (config.platform == 'linux') url = g.linuxPackUrl;
                    var c = await this.shyServiceSlideElectron.downloadServerPack(url, g.version);
                    this.willUpdatePack.version = g.version;
                    this.willUpdatePack.filePath = c.zipFilePath;
                }
            }
        }
        catch (ex) {

        }
        finally {
            this.willUpdatePack.loading = false
        }
    }
    async updateInstall() {
        try {
            this.willUpdatePack.installLoading = true;
            await this.stopAll();
            await this.shyServiceSlideElectron.packServerSlide(this.willUpdatePack.filePath, this.willUpdatePack.version);
            runInAction(() => {
                this.willUpdatePack.loading = false;
                this.willUpdatePack.version = null;
                this.willUpdatePack.filePath = null;
                this.willUpdatePack.installLoading = false;
            })
        }
        catch (ex) {

        }
        finally {
            this.willUpdatePack.installLoading = false;
            await this.runAll()
        }
    }
}

export var serverSlideStore = new ServerSlideStore()