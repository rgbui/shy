

export interface FileType {
    name: string;
    url: string;
    id: string;
    ext: string;
    mine: string;
    size: number;
}

export type ShyDeskLocalStore = {
    abled: boolean,
    clientId: string,
    port: number,
    region: 'cn' | 'us',
    sideMode: 'dev' | 'beta' | 'pro',
    storeDir: string,
    mongodb: { ip: string, port: number, account: string, pwd: string }, esUrl: string
};

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
    readLocalStore(): Promise<ShyDeskLocalStore>,
    saveLocalStore(d: ShyDeskLocalStore): Promise<void>,
    checkMongodb(mongodb: {}): Promise<{ connect: boolean, error: string }>,
    checkEs(esUrl: string): Promise<{ connect: boolean, error: string }>,
    // downloadServerPack(url: string, version: string): Promise<{ zipFilePath: string }>,
    // packServerSlide(filePath: string, version: string): Promise<void>,
    startServer(): Promise<void>,
    // stopServer(): Promise<void>,
    // deleteServer(): Promise<void>,
    // restartServer(): Promise<void>,
    portIsOccupied(port: number): Promise<boolean>,
}
