
import { PageItem } from "../solution/item";

import { Events } from "rich/src/util/events";
import { SupervisorView } from "./view";

export class Supervisor extends Events {
    items: PageItem[] = [];
    view: SupervisorView;
    onOpenItem(item: PageItem) {
        if (!this.items.exists(g => g == item)) {
            this.items = [item];
            if (this.view) this.view.forceUpdate();
        }
    }
}