import { EventsComponent } from "rich/component/lib/events.component";
import React from 'react';
import GlobalLink from "rich/src/assert/svg/GlobalLink.svg";
import { Switch } from "rich/component/view/switch";
import { PopoverPosition } from "rich/extensions/popover/position";
import { PageItem } from "../../sln/item";
import { workspaceService } from "../../../../services/workspace";
class PagePublish extends EventsComponent {
    open(item: PageItem) {
        this.item = item;
        this.forceUpdate();
    }
    item: PageItem;
    render() {
        var self = this;
        function setGlobalShare(share: boolean) {
            self.item.share = share ? "net" : 'nas';
            workspaceService.updatePage(self.item.id, { share: self.item.share });
        }
        return <div className='shy-page-publish'>
            <div>
                <div>
                    <GlobalLink></GlobalLink>
                    <div><span>公开至互联网</span><label>任何人都可以浏览</label></div>
                </div>
                <Switch checked={this.item.share == 'net' ? true : false} onChange={e => setGlobalShare(e)}></Switch>
            </div>
            {/* <div>
                分享给好友，一起参于
            </div> */}
        </div>
    }
}
export async function useOpenPagePublish(pos: PopoverPosition, item: PageItem) {

}