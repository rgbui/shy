import React from "react";
import { PageItem } from "../solution/item";
import { Mime } from "../solution/item/mine";
import { surface } from "../surface";
import { DocPage } from "./doc";

export class SupervisorView extends React.Component {
    constructor(props) {
        super(props);
        surface.supervisor.view = this;
    }
    get supervisor() {
        return surface.supervisor;
    }
    get items() {
        return this.supervisor.items;
    }

    renderItem(item: PageItem) {
        switch (item.mime) {
            case Mime.page:
                return <DocPage key={item.id} item={item}></DocPage>
        }
    }
    render() {
        return <div className='sy-content'>
            {this.items.length > 0 && this.items.map(item => this.renderItem(item))}
            {this.items.length == 0 && <div className='sy-content-empty'>没有打开任何文档</div>}
        </div>
    }
}