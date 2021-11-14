import React from "react";
import { surface } from "..";
import { Bar } from "./bar";
import { EmptyPageView } from "./page/empty";
import { observer } from "mobx-react";
import { Loading } from "rich/component/view/loading";
export var SupervisorView = observer(function () {
    React.useEffect(() => {
        surface.supervisor.emit('mounted');
    }, [])
    var items = surface.supervisor.items;
    return <div className='shy-supervisor'>
        <Bar></Bar>
        <div className='shy-supervisor-view' ref={e => surface.supervisor.pagesEl = e}>
            {surface.supervisor.loading && <Loading></Loading>}
        </div>
        {items.length == 0 && <EmptyPageView></EmptyPageView>}
    </div>
})
