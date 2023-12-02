

export interface FileType {
    name: string;
    url: string;
    id: string;
    ext: string;
    mine: string;
    size: number;
}


export interface ShyDesk {
    ready(): Promise<void>,
    getConfig(): Promise<{
        version: any;
        isAutoStartup: any;
        closeTray: any;
        codeVersion: any;
        platform: NodeJS.Platform;
    }>
    openFile(options: {
        dialogTitle?: string,
        mode?: 'file' | 'dir',
        exts?: string,
        defaultPath?: string
    }): Promise<string>,
    openExternal(url: string): Promise<void>,
    openPath(filePath: string): Promise<void>,
    setStartUp(isAutoStartup: boolean): Promise<void>,

    readLocalStore(): Promise<{ abled: boolean, port: number, storeDir: string, mongodb: { ip: string, port: number, account: string, pwd: string }, esUrl: string }>,
    saveLocalStore(d: { abled: boolean, storeDir: string, mongodb: { ip: string, port: number, account: string, pwd: string }, esUrl: string }): Promise<void>,
    checkMongodb(mongodb: {}): Promise<{ connect: boolean, error: string }>,
    checkEs(esUrl: string): Promise<{ connect: boolean, error: string }>,
    downloadServerPack(url: string, version: string): Promise<{ zipFilePath: string }>,
    packServerSlide(filePath: string, version: string): Promise<void>,
    startServer(): Promise<void>,
    stopServer(): Promise<void>,
    deleteServer(): Promise<void>,
    restartServer(): Promise<void>,
    portIsOccupied(port:number):Promise<boolean>,
}
