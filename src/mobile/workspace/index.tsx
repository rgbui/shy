import { observer } from "mobx-react";
import React from "react";
import { LayoutView } from "../layout";
import { WorkspaceSln } from "./sln";
export var WorkspaceView = observer(function () {
    return <LayoutView>
        <WorkspaceSln></WorkspaceSln>
    </LayoutView>
})


