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
            {surface.supervisor.main && !surface.supervisor.slide && <PageSupervisorView store={surface.supervisor.main} ></PageSupervisorView>}
            {surface.supervisor.main && surface.supervisor.slide && <div>
                <PageSupervisorView store={surface.supervisor.main} ></PageSupervisorView>
                <PageSupervisorView store={surface.supervisor.slide}></PageSupervisorView>
            </div>}
            {surface.supervisor.dialog && <PageSupervisorDialog store={surface.supervisor.dialog}></PageSupervisorDialog>}
        </>}
    </div>
})
