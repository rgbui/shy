import React from "react";
import { surface } from "..";
import { Bar } from "./bar";
import { EmptyPageView } from "./page/empty";
import { observer } from "mobx-react";
import { Loading } from "rich/component/view/loading";
import lodash from "lodash";

export var SupervisorView = observer(function () {
    React.useEffect(() => {
        surface.supervisor.emit('mounted');
        var resize = lodash.debounce((event) => {
            surface.supervisor.autoLayout();
        },700);
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [])
    return <div className='shy-supervisor'>
        <Bar></Bar>
        <div className='shy-supervisor-view' ref={e => surface.supervisor.pagesEl = e}>
            {surface.supervisor.loading && <Loading></Loading>}
        </div>
        {!surface.supervisor.item && <EmptyPageView></EmptyPageView>}
    </div>
})
