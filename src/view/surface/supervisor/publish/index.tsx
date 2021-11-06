import { EventsComponent } from "rich/component/lib/events.component";
import React from 'react';
import GlobalLink from "rich/src/assert/svg/GlobalLink.svg";
import { Switch } from "rich/component/view/switch";
import { PopoverPosition } from "rich/extensions/popover/position";
import { PageItem } from "../../sln/item";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import "./style.less";
import { Icon } from "rich/component/view/icon";
import { pageItemStore } from "../../../../../services/page.item";
import { observer } from "mobx-react";
import { makeObservable, observable } from "mobx";
@observer
class PagePublish extends EventsComponent {
    constructor(props) {
        super(props);
        makeObservable(this, { item: observable });
    }
    open(item: PageItem) {
        this.item = item;
    }
    item: PageItem = null;
    render() {
        var self = this;
        function setGlobalShare(share: boolean) {
            var itemShare = share ? "net" : 'nas';
            pageItemStore.updatePageItem(self.item, { share: itemShare });
            // self.forceUpdate();
        }
        return <div className='shy-page-publish'>
            <div className='shy-page-publish-access'>
                <div className='shy-page-publish-access-icon'>
                    <Icon size={36} icon={GlobalLink}></Icon>
                    <div>
                        <span>公开至互联网</span>
                        <label>任何人都可以浏览</label>
                    </div>
                </div>
                <Switch checked={this.item?.share == 'net' ? true : false} onChange={e => setGlobalShare(e)}></Switch>
            </div>
            {/* <div>
                分享给好友，一起参于
            </div> */}
        </div>
    }
}
export async function usePagePublish(pos: PopoverPosition, item: PageItem) {
    let popover = await PopoverSingleton(PagePublish, { mask: true });
    let pagePublish = await popover.open(pos);
    pagePublish.open(item);
    return new Promise((resolve: (data: any) => void, reject) => {
        popover.only('close', () => {
            resolve(null)
        });
    })
}