import { PageItem } from "../solution/item";
import { Events } from "rich/src/util/events";
import { SupervisorView } from "./view";
export declare class Supervisor extends Events {
    items: PageItem[];
    view: SupervisorView;
    onOpenItem(item: PageItem): void;
}
