import React from "react";
import { DocPage } from "../../core/doc";
import { PageItem } from "../../core/workspace/item";
import { Mime } from "../../core/workspace/item.mine";
import { surface } from "../surface";
export class Content extends React.Component {
    constructor(props) { super(props) }
    get items() {
        return surface.openItems;
    }
    renderItem(item: PageItem) {
        switch (item.mime) {
            case Mime.page:
                return <DocPage key={item.id} item={item}></DocPage>
        }
    }
    render() {
        return <div className='sy-content'>
            {this.items.map(item => this.renderItem(item))}
        </div>
    }
}