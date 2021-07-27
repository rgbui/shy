
import { PageItem } from "../solution/item";
import { Events } from "rich/util/events";
import { SupervisorView } from "./view";

export class Supervisor extends Events {
    items: PageItem[] = [];
    view: SupervisorView;
    onOpenItem(...items: PageItem[]) {
        this.items = items;
        if (this.view) this.view.forceUpdate();
    }
}