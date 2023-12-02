import { lst } from "rich/i18n/store";



export interface ShyServiceSlideElectron {
    getConfig(): Promise<{
        version: string,
        isAutoStartup: boolean,
        closeTray: boolean,
        platform: 'aix' | 'android' | 'darwin' | 'freebsd' | 'haiku' | 'linux' | 'openbsd' | 'sunos' | 'win32' | 'cygwin' | 'netbsd';
    }>,
    getDeviceID: () => Promise<string>,
    savePid: (sm: ServiceNumber, pid: Pid) => Promise<void>,
    runPid: (pid: Pid) => Promise<void>,
    deletePid: (pid: Pid) => Promise<void>,
    stopPid: (pid: Pid) => Promise<void>,
    checkServiceConnect: (sn: ServiceNumber, name: 'mongodb' | 'redis' | 'es') => Promise<{ error: string, connect: boolean }>
    installSoft: (callback: (data: string) => void) => void,
    openFile(options: {
        dialogTitle?: string,
        mode?: 'file' | 'dir',
        exts?: string,
        defaultPath?: string
    }): Promise<string>,
    openExternal(url: string): Promise<void>,
    openPath(filePath: string): Promise<void>,
    setStartUp(isAutoStartup: boolean): Promise<void>,
    setTray(isTray: boolean): Promise<void>,
    getLocalIp: () => Promise<string>,
    downloadServerPack(url: string, version: string): Promise<{ zipFilePath: string }>,
    packServerSlide(filePath: string, version: string): Promise<void>,
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

export function buildServiceNumberAddress(sn: ServiceNumber) {
    return `shy-server://${sn.serviceNumber}/invite/${sn.verifyCode}`
}

export class ServiceMachine {

    public id: string;
    public createDate: Date;
    public serviceNumberId: string;
    public machineName: string;
    public machineCode: string;
    public remark: string;
    public isInstall: boolean;

}

export class Pid {
    public id: string;
    public serviceNumberId: string;
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
    public storeDir: string;
    public status?: 'running' | 'stop' | 'error';
    public config?: Record<string, any>
}
export const ServerServiceMachineIdKey = 'ServerServiceMachineId';

export var PidTypeOptions = [
    { text: lst('数据服务'), value: 'ws' },
    { text: lst('即时通讯'), value: 'tim' },
    { text: lst('文件管理'), value: 'file' },
    // { text: '搜索服务', value: 'search' }
]