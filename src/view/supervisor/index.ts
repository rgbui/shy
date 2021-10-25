
import { PageItem } from "../sln/item";
import { Events } from "rich/util/events";
import { SupervisorView } from "./view";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Rect } from "rich/src/common/point";
import { workspaceService } from "../../../services/workspace";
import { usePagePublish } from "./publish";
import { MenuItemType, MenuItemTypeValue } from "rich/component/view/menu/declare";

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
    async onOpenPublish(event: React.MouseEvent) {
        await usePagePublish({ roundArea: Rect.fromEvent(event) }, this.item)
    }
    async onOpenPageProperty(event: React.MouseEvent) {
        var items: MenuItemType<string>[] = [
            { name: 'smallText', text: '小字号', type: MenuItemTypeValue.switch },
            { name: 'fullWidth', text: '宽版', type: MenuItemTypeValue.switch }
        ];
        while (true) {
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, items);
            if (r?.item) {
                if (r.item.name == 'smallText') {
                    // console.log(r.item.checked);
                }
                else if (r.item.name == 'fullWidth') {
                    // console.log(r.item.checked);
                }
            }
            else break;
        }
    }
}