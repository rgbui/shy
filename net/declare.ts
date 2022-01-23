
export interface Channel {
	post(url: '/upload/file', parameter: { file: File, uploadProgress: (event: ProgressEvent) => void }): Promise<{ ok: boolean, data: { url: string }, warn: string }>;
	act(url: '/page/notify/toggle', parameter: { id: string, visible: boolean }): void;
	act(url: '/device/register'): Promise<void>;
	query(url: '/device/get'): Promise<string>;
	get(url: '/user/ping', parameter: void): Promise<{ ok: boolean, warn: string }>;
}
