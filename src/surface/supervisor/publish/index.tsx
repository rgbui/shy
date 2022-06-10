import { EventsComponent } from "rich/component/lib/events.component";
import React from 'react';

import { Switch } from "rich/component/view/switch";
import { PopoverPosition } from "rich/extensions/popover/position";
import { PageItem } from "../../sln/item";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import "./style.less";
import { Icon } from "rich/component/view/icon";
import { pageItemStore } from "../../sln/item/store/sync";
import { observer } from "mobx-react";
import { makeObservable, observable } from "mobx";
import { GlobalLinkSvg, LinkSvg } from "rich/component/svgs";
import { Divider } from "rich/component/view/grid";
import { CopyText } from "rich/component/copy";
import { PagePermission } from "rich/src/page/permission";
import { ShyAlert } from "rich/component/lib/alert";

@observer
class PagePublish extends EventsComponent {
    constructor(props) {
        super(props);
        makeObservable(this, { item: observable });
    }
    open(item: PageItem) {
        this.item = item;
    }
    copyLink() {
        CopyText(this.item.url);
        ShyAlert('页面访问链接已复制');
    }
    item: PageItem = null;
    render() {
        var self = this;
        function setGlobalShare(data) {
            pageItemStore.updatePageItem(self.item, data);
        }
        return <div className='shy-page-publish'>
            <div className='shy-page-publish-access'>
                <div className='shy-page-publish-access-icon'>
                    <Icon size={36} icon={GlobalLinkSvg}></Icon>
                    <div>
                        <span>公开至互联网</span>
                        <label>任何人都可以{this.item?.permission == PagePermission.canEdit ? "编辑" : (this.item?.permission == PagePermission.canInteraction ? "浏览、添加评论、数据" : "浏览")}</label>
                    </div>
                </div>
                <Switch checked={this.item?.share == 'net' ? true : false} onChange={e => setGlobalShare({ share: e ? "net" : 'nas' })}></Switch>
            </div>
            {this.item?.share == 'net' && <>
                <div className='shy-page-publish-permission'><span>可编辑</span><Switch checked={this.item.permission == PagePermission.canEdit} onChange={e => setGlobalShare({ permission: e ? PagePermission.canEdit : PagePermission.canView })}></Switch></div>
                <div className='shy-page-publish-permission'><span>可交互<em>(评论、添加数据)</em></span><Switch checked={this.item.permission == PagePermission.canInteraction} onChange={e => setGlobalShare({ permission: e ? PagePermission.canInteraction : PagePermission.canView })}></Switch></div>
            </>}
            <Divider></Divider>
            <div className="shy-page-publish-item" onClick={e => this.copyLink()}>
                <Icon size={18} icon={LinkSvg}></Icon><span>复制页面访问链接</span>
            </div>
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