


export interface ShyServiceSlideElectron {
    getDeviceID: () => Promise<string>,
    savePid: (sm: ServiceNumber, pid: Pid) => Promise<void>,
    runPid: (pid: Pid) => Promise<void>,
    deletePid:(pid:Pid)=>Promise<void>,
    stopPid: (pid: Pid) => Promise<void>,
    installSoft: (callback: (data: string) => void) => void
}


export class ServiceNumber {

    public id: string;
    public createDate: Date;
    public creater: string;
    /**
    * 服务商
    */

    public serviceProvider: string;



    public serviceNumber: string;


    public verifyCode: string;



    public workspaceCount: number



    public mongodb: Record<string, any>


    public redis: Record<string, any>


    public search: Record<string, any>


    public remark: string;


    public isShyServiceCenter: boolean;
}


export class ServiceMachine {

    public id: string;
    public createDate: Date;
    public serviceNumber: string;
    public machineName: string;
    public machineCode: string;
    public remark: string;
}

export class Pid {
    public id: string;
    public serviceNumber: string;
    public serviceMachineId: string;
    public createDate: Date;
    public name: string;
    public ip: string;
    public types: string[];
    public port: number;
    public url: string;
    public abled: boolean;
    public weight: number;
    public mode: string;
}

export const ServerServiceNumberKey = 'ServerServiceNumber';
export const ServerServiceMachineIdKey = 'ServerServiceMachineId';