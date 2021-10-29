
import React from 'react';
import { Icon } from 'rich/component/view/icon';
import { Directive } from 'rich/util/bus/directive';
import { messageChannel } from 'rich/util/bus/event.bus';
import { PageItem } from '../../sln/item';
import { surface } from '../..';
import PageSvg from "../../../../assert/svg/page.svg";
import { Mime } from '../../sln/declare';
export class PageRouter extends React.Component {
    onClick(item: PageItem) {
        if (this.supervisor.item === item) return;
        messageChannel.fire(Directive.OpenPageItem, item);
    }
    componentDidMount() {
        messageChannel.on(Directive.UpdatePageItem, this.changePageInfo);
    }
    componentWillUnmount() {
        messageChannel.off(Directive.UpdatePageItem, this.changePageInfo);
    }
    changePageInfo = (id: string, pageInfo) => {
        var pa = this.supervisor.item.closest(g => g.id == id);
        if (pa) {
            Object.assign(pa, pageInfo);
            this.forceUpdate();
        }
    }
    render() {
        var item = this.supervisor.item;
        if (item) {
            var rootItem = item.closest(x => x && x.parent && x.parent.mime != Mime.page, true);
            var pa = item.parent;
            if (pa.mime != Mime.page) pa = null;
            if (rootItem && rootItem == pa) pa = null;
            var ra = (item: PageItem, split = false) => <><span onMouseDown={e => this.onClick(item)} className='shy-supervisor-bar-routers-item'><Icon icon={item.icon ? item.icon : PageSvg} size={18}></Icon><a className='shy-supervisor-bar-router-item-title'>{item.text}</a></span>{split && <em>/</em>}</>;
            return <div className='shy-supervisor-bar-routers'>
                {rootItem && ra(rootItem, true)}
                {pa && pa.parent != rootItem && rootItem && <><label>...</label><em>/</em></>}
                {pa != rootItem && pa && ra(pa, true)}
                {ra(item)}
            </div>
        }
        else return <></>;
    }
    get supervisor() {
        return surface.supervisor;
    }
}