
import { makeObservable, observable, runInAction } from "mobx";
import { yCache } from "../net/cache";
import { masterSock } from "../net/sock";
import { Pid, ServerServiceMachineIdKey, ServerServiceNumberKey, ServiceMachine, ShyServiceSlideElectron } from "./declare";

export class ServerSlideStore {
    machineCode: string;
    service_machine: ServiceMachine = null;
    pids: Pid[] = [];
    constructor() {
        makeObservable(this, {
            machineCode: observable,
            service_machine: observable,
            pids: observable
        })
    }
    get shyServiceSlideElectron() {
        return (window as any).ShyServiceSlideElectron as ShyServiceSlideElectron
    }
    async load() {
        var g = await this.shyServiceSlideElectron.getDeviceID();
        if (g) { this.machineCode = g; }
        var sm = await yCache.get(ServerServiceNumberKey);
        var mid = await yCache.get(ServerServiceMachineIdKey);
        var filter: Record<string, any> = {};
        if (sm && mid) filter = { serviceName: sm, machineId: mid }
        else filter = { machineCode: g }
        var r = await masterSock.get<{ pids: Pid[], service_machine: ServiceMachine }>('/service/machine/pids', filter);
        if (r?.data) {
            runInAction(() => {
                this.service_machine = r.data.service_machine;
                this.pids = r.data.pids;
            })
        }
    }
}

export var serverSlideStore = new ServerSlideStore()