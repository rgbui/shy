import React from "react";
import { surface } from "../surface";
import { PageItem } from "../solution/item";
import { Mime } from "../solution/item/mine";
import { DocPage } from "./doc";

export class Supervisor extends React.Component {
    constructor(props) { super(props) }
    get items() {
        return surface.solution.openItems;
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