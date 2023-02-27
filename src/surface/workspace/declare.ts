export type PidType = 'master' | 'org' | 'guard' | 'tim' | "ws" | 'file' | 'api' | 'mail'


export type Pid = {
    id: string;
    types: PidType[],
    url: string
}
