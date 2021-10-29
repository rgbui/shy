import React from "react";
import { PageItem } from "../sln/item";
import { surface } from "..";
import { Bar } from "./bar";
import { DocPage } from "./page";
import { EmptyPageView } from "./page/empty";
import { Mime } from "../sln/declare";
import { observer } from "mobx-react";

export var SupervisorView = observer(function () {
    function renderItem(item: PageItem) {
        switch (item.mime) {
            case Mime.page:
                return <DocPage key={item.id} item={item}></DocPage>
        }
    }
    var items = surface.supervisor.items;
    return <div className='shy-supervisor'>
        <Bar></Bar>
        <div className='shy-supervisor-view'>
            {items.length > 0 && items.map(item => renderItem(item))}
            {items.length == 0 && <EmptyPageView></EmptyPageView>}
        </div>
    </div>
})
