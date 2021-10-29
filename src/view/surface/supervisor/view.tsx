import React from "react";
import { PageItem } from "../sln/item";
import { surface } from "..";
import { Bar } from "./bar";
import { DocPage } from "./page";
import { EmptyPageView } from "./page/empty";
import { Mime } from "../sln/declare";

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
        return <div className='shy-supervisor'>
            <Bar></Bar>
            <div className='shy-supervisor-view'>
                {this.items.length > 0 && this.items.map(item => this.renderItem(item))}
                {this.items.length == 0 && <EmptyPageView></EmptyPageView>}
            </div>
        </div>
    }
}