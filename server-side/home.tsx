import { observer } from "mobx-react"
import React from "react";
import { ServerConfigView } from "./machine";
import { ServerConfigCreate } from "./create";
import { serverSlideStore } from "./store";
export var ServerSlideView = observer(function ()
{
    return <div>
        {!serverSlideStore.service_machine && <ServerConfigCreate></ServerConfigCreate>}
        {serverSlideStore.service_machine && <ServerConfigView></ServerConfigView>}
    </div>
})