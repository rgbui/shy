
import { PageItem } from "../sln/item";
import { Events } from "rich/util/events";
import { SupervisorView } from "./view";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Rect } from "rich/src/common/point";
import { workspaceService } from "../../../services/workspace";
import { usePagePublish } from "./publish";

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
        workspaceService.toggleFavourcePage(this.item)
    }
    async onOpenPublish(event: React.MouseEvent)
    {
        await usePagePublish(
            { roundArea: Rect.fromEvent(event) },
            this.item
        )
    }
    async onOpenPageProperty(event: React.MouseEvent) {
        var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, [])
    }
}