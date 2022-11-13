import React from "react";
import { surface } from "..";
import { observer } from "mobx-react";
import lodash from "lodash";
import { PageSupervisorView } from "./view/index";
import { PageSupervisorDialog } from "./view/dialoug";

export var SupervisorView = observer(function () {
    React.useEffect(() => {
        surface.supervisor.emit('mounted');
        var resize = lodash.debounce((event) => {
            surface.supervisor.autoLayout();
        }, 700);
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [])
    return <div className='shy-supervisor'>
        {surface.supervisor.opening && <></>}
        {surface.supervisor.opening == false && <>
            {surface.supervisor.page && <PageSupervisorView style={{ right: surface.supervisor.slide ? surface.supervisor.slide_pos + "%" : undefined }} store={surface.supervisor.page} ></PageSupervisorView>}
            {surface.supervisor.slide && <PageSupervisorView slide style={{ left: (100 - surface.supervisor.slide_pos) + "%" }} store={surface.supervisor.slide}></PageSupervisorView>}
            {surface.supervisor.dialog && <PageSupervisorDialog store={surface.supervisor.dialog}></PageSupervisorDialog>}
        </>}
    </div>
})
