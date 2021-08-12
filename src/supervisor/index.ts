
import { PageItem } from "../sln/item";
import { Events } from "rich/util/events";
import { SupervisorView } from "./view";

export class Supervisor extends Events {
    items: PageItem[] = [];
    view: SupervisorView;
    get item() {
        return this.items[0]
    }
    onOpenItem(...items: PageItem[]) {
        this.items = items;
        if (this.view) this.view.forceUpdate();
    }
    onFavourite(event: React.MouseEvent) {

    }
    onOpenPublish(event: React.MouseEvent) {

    }
    onOpenPageProperty(event: React.MouseEvent) {

    }
}