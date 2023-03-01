import React from "react";
import { observer } from "mobx-react";
import { surface } from "../../surface";
export var WsList = observer(function () {

    React.useEffect(() => {


    }, [])
    return <div className="flex">
        {surface.wss.map(ws => {
            return <div key={ws.id}></div>
        })}
    </div>
})