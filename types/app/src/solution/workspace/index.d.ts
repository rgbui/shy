import { PageItem } from "../item";
import { WorkspaceModule } from "../module/base";
import { WorkspaceView } from "./view";
export declare class Workspace {
    id: string;
    date: number;
    title: string;
    profile_photo: string;
    modules: WorkspaceModule[];
    view?: WorkspaceView;
    domain: string;
    get url(): string;
    load(data: any): void;
    createModule(module: Record<string, any>): WorkspaceModule;
    find(predict: (item: PageItem) => boolean): PageItem;
    remove(predict: (item: PageItem) => boolean): void;
    get(): Promise<Record<string, any>>;
}
