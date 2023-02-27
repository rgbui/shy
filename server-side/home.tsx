import { observer } from "mobx-react"
import React from "react";
import { ServerConfigView } from "./server-config";
import { ServerConfigCreate } from "./server-config/create";
import { serverSlideStore } from "./store";
export var ServerSlideView = observer(function () {

    return <div>
        {!serverSlideStore.service_machine && <ServerConfigCreate></ServerConfigCreate>}
        {serverSlideStore.service_machine && <ServerConfigView></ServerConfigView>}
    </div>
})